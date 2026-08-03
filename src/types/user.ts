export type Role = 'admin' | 'recruiter' | 'candidate'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
  title?: string
  phone?: string
  location?: string
  verified: boolean
}
