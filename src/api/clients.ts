import { authFetch } from './client'
import type { ClientRegistrationDto, ClientRegistrationResultDto } from './types'

export function registerClient(
  token: string,
  data: ClientRegistrationDto,
): Promise<ClientRegistrationResultDto> {
  return authFetch<ClientRegistrationResultDto>('/api/appmanagement/clients', token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
