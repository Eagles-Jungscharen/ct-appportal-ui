import { authFetch } from './client'
import type { AppDto } from './types'

export const fetchApps = async (token: string): Promise<AppDto[]> => {
  return await authFetch<AppDto[]>('/api/apps', token)
}

export const fetchAllApps = async (token: string): Promise<AppDto[]> => {
  return await authFetch<AppDto[]>('/api/appmanagement/apps', token)
}

export const createApp = async (token: string, data: Omit<AppDto, 'id'>): Promise<AppDto> => {
  return await authFetch<AppDto>('/api/appmanagement/apps', token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateApp = async (token: string, id: string, data: Partial<AppDto>): Promise<AppDto> => {
  return await authFetch<AppDto>(`/api/appmanagement/apps/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deleteApp = async (token: string, id: string): Promise<void> => {
  return await authFetch<void>(`/api/appmanagement/apps/${id}`, token, {
    method: 'DELETE',
  })
}
