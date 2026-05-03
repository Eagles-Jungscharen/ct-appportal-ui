import { useMutation } from '@tanstack/react-query'
import { registerClient } from '../api/clients'
import type { ClientRegistrationDto } from '../api/types'
import { useAppAuth } from './useAppAuth'

export function useClientRegistration() {
  const { token } = useAppAuth()

  return useMutation({
    mutationFn: (data: ClientRegistrationDto) => registerClient(token!, data),
  })
}
