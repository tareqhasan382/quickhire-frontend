import type { Role, User } from '../../../types'
import { apiFetch } from '../../../services/http'
import type { BackendUser } from '../../../services/mappers'
import { mapUser } from '../../../services/mappers'
import { wait } from '../../../services/http'

export interface LoginInput {
  email: string
  password: string
}

export interface SignupInput {
  name: string
  email: string
  password: string
  role: Role
}

export interface AuthResult {
  user: User
  token: string
}

export interface DemoAccount {
  label: string
  name: string
  email: string
  password: string
  role: Role
}

const DEMO_ENV: { label: string; name: string; role: Role; emailVar: string; passwordVar: string }[] = [
  { label: 'Candidate', name: 'Alex Morgan', role: 'candidate', emailVar: 'VITE_DEMO_CANDIDATE_EMAIL', passwordVar: 'VITE_DEMO_CANDIDATE_PASSWORD' },
  { label: 'Recruiter', name: 'Jordan Rivera', role: 'recruiter', emailVar: 'VITE_DEMO_RECRUITER_EMAIL', passwordVar: 'VITE_DEMO_RECRUITER_PASSWORD' },
  { label: 'Admin', name: 'Sam Patel', role: 'admin', emailVar: 'VITE_DEMO_ADMIN_EMAIL', passwordVar: 'VITE_DEMO_ADMIN_PASSWORD' },
]

export const DEMO_ACCOUNTS: DemoAccount[] = DEMO_ENV.map((item) => {
  const email = import.meta.env[item.emailVar] as string | undefined
  const password = import.meta.env[item.passwordVar] as string | undefined
  return email && password
    ? { label: item.label, name: item.name, email, password, role: item.role }
    : null
}).filter((account): account is DemoAccount => account !== null)

export const VERIFICATION_CODE = '123456'

const DELAY = 900

export const authService = {
  async login(input: LoginInput): Promise<AuthResult> {
    const { data } = await apiFetch<{ user: BackendUser; token: string }>('/user/login', {
      method: 'POST',
      body: JSON.stringify({ email: input.email.trim(), password: input.password }),
    })
    return { user: mapUser(data.user), token: data.token }
  },

  async signup(input: SignupInput): Promise<User> {
    const { data } = await apiFetch<BackendUser>('/user/register', {
      method: 'POST',
      body: JSON.stringify({
        name: input.name.trim(),
        email: input.email.trim(),
        password: input.password,
        role: input.role,
      }),
    })
    return mapUser(data)
  },

  async forgotPassword(email: string): Promise<void> {
    await wait(DELAY)
    void email
  },

  async resetPassword(password: string): Promise<void> {
    await wait(DELAY)
    void password
  },

  async verifyEmail(code: string): Promise<void> {
    await wait(DELAY)
    if (code !== VERIFICATION_CODE) {
      throw new Error('That code is invalid or has expired.')
    }
  },
}
