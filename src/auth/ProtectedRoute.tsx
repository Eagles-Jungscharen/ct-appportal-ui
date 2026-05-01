import { useAuth } from './useAuth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, login } = useAuth()

  if (isLoading) return null

  if (!isAuthenticated) {
    login()
    return null
  }

  return <>{children}</>
}
