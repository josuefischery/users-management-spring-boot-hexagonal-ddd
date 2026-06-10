import type { ApiErrorResponse, CreateUserPayload, UpdateUserPayload, User } from '../models/user'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '')

const USERS_ENDPOINT = `${API_BASE_URL}/users`

export class ApiClientError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
  }
}

async function request<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(input, {
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
      ...init,
    })
  } catch {
    throw new Error('No hay conexion con el backend. Verifica que Spring Boot este ejecutandose.')
  }

  if (!response.ok) {
    throw await buildApiError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

async function buildApiError(response: Response) {
  if (response.status === 502 || response.status === 504) {
    return new ApiClientError(
      response.status,
      'Backend no disponible. Verifica que Spring Boot este ejecutandose en el puerto 8080.',
    )
  }

  try {
    const body = (await response.json()) as ApiErrorResponse
    return new ApiClientError(response.status, body.message || response.statusText)
  } catch {
    return new ApiClientError(response.status, response.statusText || 'Error del servidor')
  }
}

export const usersService = {
  getAll() {
    return request<User[]>(USERS_ENDPOINT)
  },

  getById(id: string) {
    return request<User>(`${USERS_ENDPOINT}/${encodeURIComponent(id)}`)
  },

  create(payload: CreateUserPayload) {
    return request<User>(USERS_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  update(id: string, payload: UpdateUserPayload) {
    return request<User>(`${USERS_ENDPOINT}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  remove(id: string) {
    return request<void>(`${USERS_ENDPOINT}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
  },
}
