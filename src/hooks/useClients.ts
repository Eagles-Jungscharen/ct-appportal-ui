import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteClient, fetchClients, updateClient } from '../api/clients'
import type { UpdateClientDto } from '../api/types'
import { useAppAuth } from './useAppAuth'

export function useClients() {
  const { token } = useAppAuth()

  return useQuery({
    queryKey: ['admin', 'clients'],
    queryFn: () => fetchClients(token!),
    enabled: !!token,
    staleTime: 60_000,
  })
}

export function useUpdateClient() {
  const { token } = useAppAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: string; data: UpdateClientDto }) =>
      updateClient(token!, clientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] })
    },
  })
}

export function useDeleteClient() {
  const { token } = useAppAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (clientId: string) => deleteClient(token!, clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] })
    },
  })
}
