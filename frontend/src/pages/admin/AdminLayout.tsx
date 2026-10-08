import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth'
import { LanguageSwitcher } from '../../components/common'
import { useI18n } from '../../i18n'
import { api } from '../../api'
import { useAsync, usePolling } from '../../components/common'

export default function AdminLayout() {
  const { t } = useI18n()
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const { data: tasks, silentRefresh } = useAsync(() => api.listTasks(false), [session?.admin_id])
  usePolling(silentRefresh, 2000, true)

  const items = [
    { to: '/admin', end: true, label: t('admin.nav.overview'), icon: '📊' },
    { to: '/admin/tasks', end: false, label: t('admin.nav.tasks'), icon: '🏢' },
    { to: '/admin/checkpoint-reviews', end: false, label: t('admin.review.nav'), icon: '📥' },
    { to: '/admin/volunteers', end: false, label: t('admin.vol.title'), icon: '👥' },
    { to: '/admin/photos', end: false, label: t('admin.nav.photos'), icon: '🖼️' },
    { to: '/admin/training', end: false, label: t('admin.nav.training'), icon: '🧠' },
    { to: '/admin/system', end: false, label: t('admin.nav.system'), icon: '⚙️' },
  ]

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand">
          <strong>{t('app.name')}</strong>
          <span>{t('app.tagline')}</span>
        </div>

        <nav>
          <div className="sidebar-task-heading">
            {session?.admin_id === 1 ? t('admin.nav.allTasks') : t('admin.nav.tasks')}
          </div>
          {tasks?.map(item => <NavLink key={item.task.id} to={`/admin/tasks/${item.task.id}`} className={({isActive}) => isActive ? 'active sidebar-task' : 'sidebar-task'}><span>📌</span><span>{item.task.name}<small>{item.task.access_code}</small></span></NavLink>)}
          {!tasks?.length && <div className="sidebar-task-heading">{t('common.none')}</div>}
          {items.filter(item => item.to !== '/admin/training' || session?.admin_id === 1).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="foot">
          <span>👤 {session?.nickname ?? t('common.admin')}</span>
          <LanguageSwitcher compact />
          <button
            type="button"
            onClick={async () => {
              await logout()
              navigate('/admin/login', { replace: true })
            }}
          >
            {t('common.logout')}
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
