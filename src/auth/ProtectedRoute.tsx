import { useAppAuth } from '../hooks/useAppAuth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, login } = useAppAuth()

  if (isLoading) return null

  if (!isAuthenticated) {
    login()
    return null
  }

  return <>{children}</>
}
