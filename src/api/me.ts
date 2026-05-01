import { authFetch } from './client'
import type { MeDto } from './types'

export function fetchMe(token: string): Promise<MeDto> {
  return authFetch<MeDto>('/api/me', token)
}
