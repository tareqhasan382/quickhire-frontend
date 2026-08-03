import { useAuthStore } from '../store/authStore'

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:5000/api'

export function delay<T>(data: T, ms = 700): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export function wait(ms = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function delayError(message = 'Something went wrong. Please try again.', ms = 900): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms))
}

export interface ApiMeta {
  page: number
  limit: number
  total: number
}

export interface ApiEnvelope<T> {
  success: boolean
  message?: string
  meta?: ApiMeta
  data: T
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<ApiEnvelope<T>> {
  const token = useAuthStore.getState().token
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  } catch {
    throw new ApiError('Could not reach the server. Please try again.', 0)
  }

  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null

  if (!response.ok || !body || body.success === false) {
    throw new ApiError(body?.message || `Request failed (${response.status})`, response.status)
  }

  return body
}
