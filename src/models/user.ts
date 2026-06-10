export const USER_ROLES = ['ADMIN', 'MEMBER', 'REVIEWER'] as const
export const USER_STATUSES = ['ACTIVE', 'INACTIVE', 'PENDING', 'BLOCKED'] as const

export type UserRole = (typeof USER_ROLES)[number]
export type UserStatus = (typeof USER_STATUSES)[number]

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
}

export interface CreateUserPayload {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
}

export interface UpdateUserPayload {
  name: string
  email: string
  password?: string
  role: UserRole
  status: UserStatus
}

export interface ApiErrorResponse {
  status: number
  message: string
}

export interface UserFormState {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  status: UserStatus
}
