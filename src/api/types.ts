// --- Me ---
export interface MeDto {
  userId: string
  displayName: string
  isAdmin: boolean
  groups: string[]
}

// --- Apps ---
export interface RoleDto {
  id: string
  name: string
  description?: string
}

export interface AppDto {
  id: string
  name: string
  description?: string
  url: string
  iconUrl?: string
  redirectUris: string[]
  roles: RoleDto[]
}

// --- Assignments ---
export interface GroupAssignmentDto {
  appId: string
  groupIds: string[]
  userIds: string[]
}

// --- Clients ---
export interface ClientDto {
  clientId: string
  name: string
  owner: string
  redirectUris: string[]
}

export interface ClientRegistrationDto {
  name: string
  redirectUris: string[]
}

export interface ClientRegistrationResultDto {
  clientId: string
}

export interface UpdateClientDto {
  name?: string
  owner?: string
  redirectUris?: string[]
}

// --- API Errors ---
export interface ApiError {
  status: number
  message: string
}
