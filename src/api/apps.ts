import { authFetch } from './client'
import type { AppDto } from './types'

export function fetchApps(token: string): Promise<AppDto[]> {
  return authFetch<AppDto[]>('/api/apps', token)
}

export function fetchAllApps(token: string): Promise<AppDto[]> {
  return authFetch<AppDto[]>('/api/appmanagement/apps', token)
}

export function createApp(token: string, data: Omit<AppDto, 'id'>): Promise<AppDto> {
  return authFetch<AppDto>('/api/appmanagement/apps', token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateApp(token: string, id: string, data: Partial<AppDto>): Promise<AppDto> {
  return authFetch<AppDto>(`/api/appmanagement/apps/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteApp(token: string, id: string): Promise<void> {
  return authFetch<void>(`/api/appmanagement/apps/${id}`, token, {
    method: 'DELETE',
  })
}
