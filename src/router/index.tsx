import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '../auth/ProtectedRoute'
import { AdminRoute } from '../auth/AdminRoute'
import { OidcCallback } from '../auth/OidcCallback'
import { PageShell } from '../components/PageShell'
import { AppPortal } from '../pages/AppPortal'
import { AdminDashboard } from '../pages/admin/AdminDashboard'
import { Unauthorized } from '../pages/Unauthorized'

export const router = createBrowserRouter([
  {
    path: '/auth/callback',
    element: <OidcCallback />,
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <PageShell>
          <AppPortal />
        </PageShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <PageShell>
          <AdminDashboard />
        </PageShell>
      </AdminRoute>
    ),
  },
  {
    path: '/admin/*',
    element: (
      <AdminRoute>
        <PageShell>
          <AdminDashboard />
        </PageShell>
      </AdminRoute>
    ),
  },
])
