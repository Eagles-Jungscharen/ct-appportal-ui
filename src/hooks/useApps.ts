import { useQuery } from '@tanstack/react-query'
import { fetchApps } from '../api/apps'
import { useAuth } from '../auth/useAuth'

export function useApps() {
  const { token, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['apps'],
    queryFn: () => fetchApps(token!),
    enabled: isAuthenticated && !!token,
    staleTime: 2 * 60 * 1000,
  })
}
