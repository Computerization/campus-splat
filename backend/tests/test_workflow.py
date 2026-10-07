"""Account identity, ownership, concurrency and complete submission state machine."""
import json
import re
import pytest
from concurrent.futures import ThreadPoolExecutor

from sqlalchemy import select
from app.database import SessionLocal
from app.models import VolunteerAccount, TaskAssignment, Photo
from .conftest import jpeg_bytes, make_textured_image


def headers(session):
    return {'Authorization': f"Bearer {session['token']}"}


def register(client, name, password='shared'):
    r = client.post('/api/auth/volunteer/register', json={'username':name, 'password':password})
    assert r.status_code == 201, r.text
    return r.json()


def task(client, admin, name='测试任务', shots=1):
    r = client.post('/api/admin/tasks', headers=admin, json={'name':name})
    assert r.status_code == 201, r.text
    t = r.json()
    cp = client.post(f"/api/admin/tasks/{t['id']}/checkpoints", headers=admin, json={'name':'拍摄点', 'shot_count':shots}).json()
    return t, cp


def submit(client, volunteer, task_id, cp_id, seed=912):
    return client.post(f'/api/volunteer/tasks/{task_id}/submit', headers=volunteer,
        data={'manifest':json.dumps([{'checkpoint_id':cp_id}])},
        files=[('files',('photo.jpg',jpeg_bytes(make_textured_image(1800,1200,seed=seed)),'image/jpeg'))])


def test_three_fixed_admins_and_independent_sessions(client):
    sessions = []
    for i in range(1,4):
        r = client.post('/api/auth/admin/login',json={'password':f'admin{i:03d}'})
        assert r.status_code == 200
        assert r.json()['admin_id'] == i
        sessions.append(r.json())
    assert client.post('/api/auth/admin/login',json={'password':'admin123'}).status_code == 401
    for password in ('admin004', 'admin005'):
        assert client.post('/api/auth/admin/login',json={'password':password}).status_code == 401
    from app.security import create_session
    with SessionLocal() as db:
        retired = create_session(db, role='admin', admin_id=4, nickname='旧管理员 004')
        retired_token = retired.token
    assert client.get('/api/auth/me',headers={'Authorization':f'Bearer {retired_token}'}).status_code == 401
    second = client.post('/api/auth/admin/login',json={'password':'admin001'}).json()
    client.post('/api/auth/logout',headers=headers(sessions[0]))
    assert client.get('/api/auth/me',headers=headers(second)).status_code == 200
    assert client.delete('/api/auth/admin/account',headers=headers(second)).status_code in (404,405)


@pytest.mark.parametrize('admin_id', [2, 3])
def test_training_only_available_to_admin_001(client, admin_headers, admin_id):
    restricted = headers(client.post('/api/auth/admin/login', json={'password': f'admin{admin_id:03d}'}).json())
    owned, _ = task(client, restricted, f'无训练权限管理员{admin_id}任务')
    routes = [
        ('GET', '/api/admin/training', None),
        ('GET', '/api/admin/training/queue', None),
        ('GET', f"/api/admin/training/preflight?task_id={owned['id']}", None),
        ('POST', '/api/admin/training', {'task_id': owned['id']}),
        ('GET', '/api/admin/training/999999', None),
        ('GET', '/api/admin/training/999999/log', None),
        ('GET', '/api/admin/training/999999/preview', None),
        ('GET', '/api/admin/training/999999/artifacts/model.ply', None),
        ('POST', '/api/admin/training/999999/cancel', None),
        ('PUT', '/api/admin/training/999999/transforms', {'placements': []}),
        ('GET', '/api/admin/training/blocks/999999/log', None),
        ('POST', '/api/admin/training/blocks/999999/retry', None),
    ]
    for method, path, body in routes:
        response = client.request(method, path, headers=restricted, json=body)
        assert response.status_code == 403, (method, path, response.text)
        assert response.json()['detail'] == '只有管理员 001 有训练权限'
    assert client.get('/api/admin/overview', headers=restricted).json()['training'] == []
    assert client.get('/api/admin/system', headers=restricted).json()['training_queue'] is None
    assert client.get('/api/admin/volunteers', headers=restricted).status_code == 200
    assert client.get('/api/admin/training', headers=admin_headers).status_code == 200
    assert client.get('/api/admin/training/queue', headers=admin_headers).status_code == 200


def test_permanent_ids_released_names_and_shared_passwords(client, admin_headers):
    first = register(client,'封存姓名')
    other = register(client,'不同姓名')
    assert int(other['volunteer_id']) == int(first['volunteer_id']) + 1
    assert client.post('/api/auth/volunteer/register',json={'username':' 封存姓名 ', 'password':'x'}).status_code == 409
    assert client.delete('/api/auth/volunteer/account',headers=headers(first)).status_code == 200
    assert client.get('/api/auth/me',headers=headers(first)).status_code == 401
    again = register(client,'封存姓名','new')
    assert int(again['volunteer_id']) > int(other['volunteer_id'])
    assert client.post('/api/auth/volunteer/login',json={'username':'封存姓名','password':'shared'}).status_code == 401
    assert client.post('/api/auth/volunteer/login',json={'username':'封存姓名','password':'new'}).status_code == 200
    with SessionLocal() as db:
        archived = db.get(VolunteerAccount,int(first['volunteer_id'])+1)
        assert archived.username == '封存姓名' and archived.password == 'shared' and not archived.active
        assert archived.active_username is None
    accounts = client.get('/api/admin/volunteers',headers=admin_headers).json()
    assert first['volunteer_id'] not in [a['id'] for a in accounts]
    assert next(a for a in accounts if a['id'] == again['volunteer_id'])['password'] == 'new'


def test_account_updates_and_revocation(client,admin_headers):
    account = register(client,'账号管理姓名')
    another = register(client,'被占用姓名')
    path = f"/api/admin/volunteers/{account['volunteer_id']}"
    assert client.patch(path,headers=admin_headers,json={'username':another['nickname']}).status_code == 409
    r = client.patch(path,headers=admin_headers,json={'username':'新真实姓名','password':'updated'})
    assert r.status_code == 200 and r.json()['id'] == account['volunteer_id']
    assert client.get('/api/auth/me',headers=headers(account)).status_code == 401
    signed = client.post('/api/auth/volunteer/login',json={'username':'新真实姓名','password':'updated'}).json()
    assert signed['volunteer_id'] == account['volunteer_id']
    assert client.patch('/api/auth/volunteer/password',headers=headers(signed),json={'current_password':'bad','password':'changed'}).status_code == 400
    assert client.patch('/api/auth/volunteer/password',headers=headers(signed),json={'current_password':'updated','password':'changed'}).status_code == 200
    assert client.post('/api/auth/volunteer/login',json={'username':'新真实姓名','password':'changed'}).status_code == 200
    assert client.delete(path,headers=admin_headers).status_code == 200
    assert client.get('/api/auth/me',headers=headers(signed)).status_code == 401


def test_ownership_task_codes_and_participants(client,admin_headers):
    other_admin = headers(client.post('/api/auth/admin/login',json={'password':'admin002'}).json())
    t,cp = task(client,admin_headers)
    assert re.fullmatch('[A-Z0-9]{5}',t['access_code'])
    assert client.patch(f"/api/admin/tasks/{t['id']}",headers=admin_headers,json={'access_code':'ABCDE'}).status_code == 400
    for path in [f"/api/admin/tasks/{t['id']}",f"/api/admin/tasks/{t['id']}/export.csv",f"/api/admin/training/preflight?task_id={t['id']}"]:
        assert client.get(path,headers=other_admin).status_code == 403
    assert client.patch(f"/api/admin/checkpoints/{cp['id']}",headers=other_admin,json={'name':'入侵'}).status_code == 403
    assert client.delete(f"/api/admin/tasks/{t['id']}",headers=other_admin).status_code == 403
    owned, _ = task(client,other_admin,'第二管理员任务')
    assert client.patch(f"/api/admin/tasks/{t['id']}?task_id={owned['id']}",headers=other_admin,
        json={'task_id':owned['id'],'name':'伪造任务归属'}).status_code == 403
    assert t['id'] not in [x['task']['id'] for x in client.get('/api/admin/tasks',headers=other_admin).json()]
    v = headers(register(client,'参与者'))
    observer = headers(register(client,'观察者'))
    assert client.post(f"/api/volunteer/tasks/{t['id']}/claim",headers=v).status_code == 200
    item = next(i for i in client.get('/api/volunteer/tasks',headers=observer).json()['items'] if i['task']['id']==t['id'])
    assert item['active_volunteers'] == ['参与者']
    item = next(i for i in client.get('/api/admin/tasks',headers=admin_headers).json() if i['task']['id']==t['id'])
    assert item['active_volunteers'] == ['参与者']
    assert client.post('/api/admin/tasks',headers=v,json={'name':'非法'}).status_code == 403
    assert client.get('/api/admin/volunteers',headers=v).status_code == 403


def test_ten_slots_concurrent_claims_and_abandon(client,admin_headers):
    v = headers(register(client,'任务槽姓名'))
    tasks = [task(client,admin_headers,f'任务槽{i}')[0] for i in range(11)]
    for t in tasks[:9]:
        assert client.post(f"/api/volunteer/tasks/{t['id']}/claim",headers=v).status_code == 200
    with ThreadPoolExecutor(max_workers=2) as pool:
        codes = list(pool.map(lambda t: client.post(f"/api/volunteer/tasks/{t['id']}/claim",headers=v).status_code, tasks[9:]))
    assert sorted(codes) == [200,409]
    assert client.get('/api/volunteer/tasks',headers=v).json()['slots_used'] == 10
    assert client.post(f"/api/volunteer/tasks/{tasks[0]['id']}/abandon",headers=v).status_code == 200
    assert client.get('/api/volunteer/tasks',headers=v).json()['slots_used'] == 9
    again = client.post(f"/api/volunteer/tasks/{tasks[0]['id']}/claim",headers=v)
    assert again.status_code == 200 and again.json()['attempt'] == 2


def test_submission_return_resubmit_accept_and_media_isolation(client,admin_headers):
    t,cp = task(client,admin_headers,'审核任务')
    v = headers(register(client,'提交姓名'))
    observer = headers(register(client,'照片隔离姓名'))
    client.post(f"/api/volunteer/tasks/{t['id']}/claim",headers=v)
    response = submit(client,v,t['id'],cp['id'])
    assert response.status_code == 200,response.text
    assignment = response.json()['assignment']
    aid = assignment['id']
    pid = response.json()['results'][0]['photo_id']
    assert assignment['status'] == 'submitted'
    assert client.get('/api/volunteer/tasks',headers=v).json()['slots_used'] == 1
    assert client.post(f"/api/volunteer/tasks/{t['id']}/abandon",headers=v).status_code == 409
    assert submit(client,v,t['id'],cp['id'],913).status_code == 409
    assert client.get(f'/api/media/file/{pid}',headers=observer).status_code == 403
    other_admin = headers(client.post('/api/auth/admin/login',json={'password':'admin003'}).json())
    assert client.get(f'/api/media/file/{pid}',headers=other_admin).status_code == 403
    assert client.post(f'/api/admin/submissions/{aid}/review',headers=other_admin,json={'decision':'accept'}).status_code == 403
    r = client.post(f'/api/admin/submissions/{aid}/review',headers=admin_headers,json={'decision':'return','note':'补充角度'})
    assert r.json()['status'] == 'in_progress'
    before = client.get(f"/api/volunteer/tasks/{t['id']}",headers=v).json()
    assert len(before['photos']) == 1 and before['assignment']['review_note'] == '补充角度'
    retained = client.post(f"/api/volunteer/tasks/{t['id']}/submit",headers=v,
        data={'manifest':json.dumps([{'checkpoint_id':cp['id'],'photo_id':pid}])},
        files=[('files',('retained.jpg',b'','image/jpeg'))])
    assert retained.status_code == 200,retained.text
    assert client.post(f'/api/admin/submissions/{aid}/review',headers=admin_headers,json={'decision':'accept'}).json()['status']=='accepted'
    assert client.get('/api/volunteer/tasks',headers=v).json()['slots_used']==0
    assert client.post(f'/api/admin/submissions/{aid}/review',headers=admin_headers,json={'decision':'return'}).status_code==409
    assert client.post(f"/api/volunteer/tasks/{t['id']}/claim",headers=v).status_code==409
    assert client.get(f"/api/volunteer/tasks/{t['id']}",headers=v).json()['assignment']['status']=='accepted'


def test_pending_submission_occupies_tenth_slot(client, admin_headers):
    v = headers(register(client, '待审核任务槽姓名'))
    tasks = [task(client, admin_headers, f'待审任务槽{i}') for i in range(11)]
    for t, _ in tasks[:10]:
        assert client.post(f"/api/volunteer/tasks/{t['id']}/claim", headers=v).status_code == 200
    t, cp = tasks[0]
    r = submit(client, v, t['id'], cp['id'], seed=934)
    assert r.status_code == 200, r.text
    aid = r.json()['assignment']['id']
    extra = tasks[-1][0]
    assert client.post(f"/api/volunteer/tasks/{extra['id']}/claim", headers=v).status_code == 409
    assert client.post(f'/api/admin/submissions/{aid}/review', headers=admin_headers,
        json={'decision':'accept'}).status_code == 200
    assert client.post(f"/api/volunteer/tasks/{extra['id']}/claim", headers=v).status_code == 200


def test_concurrent_registration_keeps_active_name_unique(client):
    def attempt(_):
        return client.post('/api/auth/volunteer/register', json={'username':'并发注册姓名','password':'shared'})
    with ThreadPoolExecutor(max_workers=2) as pool:
        responses = list(pool.map(attempt, range(2)))
    assert sorted(r.status_code for r in responses) == [201, 409]
    winner = next(r.json() for r in responses if r.status_code == 201)
    with SessionLocal() as db:
        rows = list(db.scalars(select(VolunteerAccount).where(VolunteerAccount.active_username == '并发注册姓名')))
        assert len(rows) == 1 and f'{rows[0].id - 1:05d}' == winner['volunteer_id']


def test_incomplete_and_invalid_submission_roll_back(client,admin_headers):
    t,cp = task(client,admin_headers,'完整性检查',shots=2)
    v = headers(register(client,'完整性姓名'))
    client.post(f"/api/volunteer/tasks/{t['id']}/claim",headers=v)
    assert submit(client,v,t['id'],cp['id']).status_code==400
    manifest = json.dumps([{'checkpoint_id':cp['id']},{'checkpoint_id':cp['id']}])
    good = jpeg_bytes(make_textured_image(1800,1200,seed=951))
    r=client.post(f"/api/volunteer/tasks/{t['id']}/submit",headers=v,data={'manifest':manifest},
        files=[('files',('good.jpg',good,'image/jpeg')),('files',('bad.jpg',b'broken','image/jpeg'))])
    assert r.status_code==400,r.text
    detail=client.get(f"/api/volunteer/tasks/{t['id']}",headers=v).json()
    assert detail['assignment']['status']=='in_progress' and detail['photos']==[]
    assert client.post(f"/api/volunteer/tasks/{t['id']}/abandon",headers=v).status_code==200


def test_delete_task_releases_slots_without_erasing_account(client,admin_headers):
    t,cp=task(client,admin_headers,'删除任务')
    account=register(client,'保留账号姓名')
    v=headers(account)
    client.post(f"/api/volunteer/tasks/{t['id']}/claim",headers=v)
    assert client.delete(f"/api/admin/tasks/{t['id']}",headers=admin_headers).status_code==200
    assert client.get('/api/volunteer/tasks',headers=v).json()['slots_used']==0
    assert client.get('/api/auth/me',headers=v).json()['volunteer_id']==account['volunteer_id']
    assert client.post('/api/admin/reset',headers=admin_headers,json={'confirm':'DELETE'}).status_code==403
