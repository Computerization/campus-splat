import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth'
import { LanguageSwitcher } from '../../components/common'
import { useI18n } from '../../i18n'

export default function AdminLayout() {
  const { t } = useI18n()
  const { session, logout } = useAuth()
  const navigate = useNavigate()

  const items = [
    { to: '/admin', end: true, label: t('admin.nav.overview'), icon: '📊' },
    { to: '/admin/tasks', end: false, label: t('admin.nav.tasks'), icon: '🏢' },
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
          {items.map((item) => (
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
