import { authFetch } from './client'
import type { GroupAssignmentDto } from './types'

export function assignGroups(
  token: string,
  appId: string,
  data: GroupAssignmentDto,
): Promise<void> {
  return authFetch<void>(`/api/appmanagement/apps/${appId}/assignments`, token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
