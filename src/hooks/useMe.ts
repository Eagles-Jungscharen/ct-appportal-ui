import { useQuery } from '@tanstack/react-query'
import { fetchMe } from '../api/me'
import { useAuth } from '../auth/useAuth'

export function useMe() {
  const { token, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['me'],
    queryFn: () => fetchMe(token!),
    enabled: isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000,
  })
}
