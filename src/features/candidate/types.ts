import type { Role } from '../../types'

export type ApplicationStatus = 'Pending' | 'Reviewed' | 'Interview' | 'Hired' | 'Rejected'

export interface WorkExperience {
  title: string
  company: string
  location?: string
  startDate?: string
  endDate?: string
  current?: boolean
  description?: string
}

export interface Education {
  school: string
  degree?: string
  field?: string
  startDate?: string
  endDate?: string
  description?: string
}

export interface Certificate {
  name: string
  issuer?: string
  year?: string
  url?: string
}

export interface CandidateProfile {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
  title?: string
  phone?: string
  location?: string
  verified: boolean
  bio?: string
  skills: string[]
  languages: string[]
  resumeLink?: string
  portfolioLink?: string
  workExperience: WorkExperience[]
  education: Education[]
  certificates: Certificate[]
}

export interface ProfileUpdateInput {
  name?: string
  avatar?: string
  title?: string
  phone?: string
  location?: string
  bio?: string
  skills?: string[]
  languages?: string[]
  resume_link?: string
  portfolio_link?: string
  workExperience?: WorkExperience[]
  education?: Education[]
  certificates?: Certificate[]
}

export interface CandidateApplication {
  id: string
  jobId: string
  job: string
  company: string
  appliedAt: string
  status: ApplicationStatus
  rating: number
  resumeLink: string
  coverNote?: string
}

export interface BackendApplication {
  _id: string
  job_id: { _id: string; title: string; company: string } | string
  user_id: { _id: string; name: string; email: string } | string
  name: string
  email: string
  resume_link: string
  cover_note?: string
  status: ApplicationStatus
  rating: number
  createdAt?: string
  updatedAt?: string
}
