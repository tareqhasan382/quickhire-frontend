import type { EmploymentType, ExperienceLevel, JobStatus, SalaryRange } from '../../types'

export type ApplicationStatus = 'Pending' | 'Reviewed' | 'Interview' | 'Hired' | 'Rejected'

export interface RecruiterJob {
  id: string
  title: string
  company: string
  category: string
  employmentType: EmploymentType
  experienceLevel: ExperienceLevel
  status: JobStatus
  featured: boolean
  applicants: number
  views: number
  postedAt: string
}

export interface RecruiterApplication {
  id: string
  applicant: string
  email: string
  job: string
  company: string
  appliedAt: string
  status: ApplicationStatus
  rating: number
  resumeLink: string
  coverNote?: string
}

export interface JobPayload {
  title: string
  company: string
  location: { type: 'Remote' | 'Onsite' | 'Hybrid'; city?: string; country?: string }
  category: string
  summary?: string
  description: string
  requirements?: string[]
  responsibilities?: string[]
  benefits?: string[]
  employmentType: EmploymentType
  experienceLevel: ExperienceLevel
  salary: SalaryRange
  skills?: string[]
  tags?: string[]
  status: JobStatus
  deadline?: string
}

export interface CompanyPayload {
  name: string
  industry: string
  location: string
  website?: string
  size: string
  founded?: number
  description: string
  benefits?: string[]
  tags?: string[]
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
