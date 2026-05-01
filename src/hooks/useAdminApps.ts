import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAllApps, createApp, updateApp, deleteApp } from '../api/apps'
import { useAuth } from '../auth/useAuth'
import type { AppDto } from '../api/types'

export function useAdminApps() {
  const { token } = useAuth()

  return useQuery({
    queryKey: ['admin', 'apps'],
    queryFn: () => fetchAllApps(token!),
    enabled: !!token,
    staleTime: 1 * 60 * 1000,
  })
}

export function useCreateApp() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<AppDto, 'id'>) => createApp(token!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'apps'] })
      queryClient.invalidateQueries({ queryKey: ['apps'] })
    },
  })
}

export function useUpdateApp() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AppDto> }) =>
      updateApp(token!, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'apps'] })
      queryClient.invalidateQueries({ queryKey: ['apps'] })
    },
  })
}

export function useDeleteApp() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteApp(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'apps'] })
      queryClient.invalidateQueries({ queryKey: ['apps'] })
    },
  })
}
