import { authFetch } from './client'
import type { ClientRegistrationDto, ClientRegistrationResultDto } from './types'

export const registerClient = async (
  token: string,
  data: ClientRegistrationDto,
): Promise<ClientRegistrationResultDto> => {
  return await authFetch<ClientRegistrationResultDto>('/api/appmanagement/clients', token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
