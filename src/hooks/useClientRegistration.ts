import { useMutation } from '@tanstack/react-query'
import { registerClient } from '../api/clients'
import { useAuth } from '../auth/useAuth'
import type { ClientRegistrationDto } from '../api/types'

export function useClientRegistration() {
  const { token } = useAuth()

  return useMutation({
    mutationFn: (data: ClientRegistrationDto) => registerClient(token!, data),
  })
}
