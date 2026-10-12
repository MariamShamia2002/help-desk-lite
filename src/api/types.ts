export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'RESET_TOKEN_INVALID'
  | 'RESET_TOKEN_EXPIRED'
  | 'RESET_TOKEN_USED'
  | 'UNAUTHENTICATED'
  | 'INVALID_CREDENTIALS'
  | 'ACCESS_TOKEN_EXPIRED'
  | 'SESSION_REVOKED'
  | 'ACCOUNT_DEACTIVATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'EMAIL_TAKEN'
  | 'TICKET_CLOSED'
  | 'TICKET_NOT_EDITABLE'
  | 'ASSIGNMENT_CONFLICT'
  | 'VERSION_CONFLICT'
  | 'CANNOT_CHANGE_OWN_ROLE'
  | 'CANNOT_DEACTIVATE_SELF'
  | 'LAST_ADMIN'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'
  // Client-side only: the request never got a response.
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'

export interface ApiErrorBody {
  code: ApiErrorCode
  message: string
  fields?: Record<string, string>
  extra?: Record<string, unknown>
  requestId?: string
}

export interface ApiResponse<T> {
  data: T
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export type Role = 'customer' | 'agent' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
}

/** Returned by login, signup and refresh. */
export interface AuthSession {
  user: AuthUser
  accessToken: string
  expiresIn: number
}
