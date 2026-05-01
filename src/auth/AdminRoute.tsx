import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth()

  if (isLoading) return null

  if (!isAuthenticated) return <Navigate to="/" replace />

  if (!isAdmin) return <Navigate to="/unauthorized" replace />

  return <>{children}</>
}
