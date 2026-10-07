import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './auth'
import { Spinner } from './components/common'
import Landing from './pages/Landing'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminOverview from './pages/admin/AdminOverview'
import AdminPhotos from './pages/admin/AdminPhotos'
import AdminSystem from './pages/admin/AdminSystem'
import AdminTaskDetail from './pages/admin/AdminTaskDetail'
import AdminTasks from './pages/admin/AdminTasks'
import AdminTraining from './pages/admin/AdminTraining'
import VolunteerBoard from './pages/volunteer/VolunteerBoard'
import VolunteerTask from './pages/volunteer/VolunteerTask'
import AdminVolunteers from './pages/admin/AdminVolunteers'
import AdminSubmissions from './pages/admin/AdminSubmissions'
import VolunteerJoin from './pages/volunteer/VolunteerJoin'
import VolunteerMine from './pages/volunteer/VolunteerMine'

// Lazy: the 3DGS viewer pulls in three.js (about 1 MB), and volunteers on a
// phone should never download it just to open the upload page.
const AdminTrainingPreview = lazy(() => import('./pages/admin/AdminTrainingPreview'))

function RequireAdmin({ children }: { children: JSX.Element }) {
  const { isAdmin, ready } = useAuth()
  const location = useLocation()
  if (!ready) return <Spinner />
  if (!isAdmin) return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  return children
}

function RequireVolunteer({ children }: { children: JSX.Element }) {
  const { ready, isVolunteer } = useAuth()
  const location = useLocation()
  if (!ready) return <Spinner />
  // Admins may also browse the volunteer UI, which is handy for debugging
  if (!isVolunteer) {
    return <Navigate to="/join" state={{ from: location.pathname }} replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Volunteer UI (phone) */}
      <Route path="/join" element={<VolunteerJoin />} />
      <Route
        path="/v"
        element={
          <RequireVolunteer>
            <VolunteerBoard />
          </RequireVolunteer>
        }
      />
      <Route
        path="/v/tasks/:id"
        element={
          <RequireVolunteer>
            <VolunteerTask />
          </RequireVolunteer>
        }
      />
      <Route
        path="/v/mine"
        element={
          <RequireVolunteer>
            <VolunteerMine />
          </RequireVolunteer>
        }
      />

      {/* Admin console (desktop) */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="tasks" element={<AdminTasks />} />
        <Route path="tasks/:id" element={<AdminTaskDetail />} />
        <Route path="volunteers" element={<AdminVolunteers />} />
        <Route path="submissions" element={<AdminSubmissions />} />
        <Route path="photos" element={<AdminPhotos />} />
        <Route path="training" element={<AdminTraining />} />
        <Route
          path="training/:runId/preview"
          element={
            <Suspense fallback={<Spinner />}>
              <AdminTrainingPreview />
            </Suspense>
          }
        />
        <Route path="system" element={<AdminSystem />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
