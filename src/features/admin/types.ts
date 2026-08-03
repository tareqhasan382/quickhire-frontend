import type { EmploymentType, ExperienceLevel } from '../../types'

export type UserStatus = 'Active' | 'Suspended' | 'Pending'
export type ApplicationStatus = 'Pending' | 'Reviewed' | 'Interview' | 'Hired' | 'Rejected'
export type AdminJobStatus = 'Active' | 'Closed' | 'Draft'
export type CompanyStatus = 'Active' | 'Pending' | 'Suspended'
export type CompanyPlan = 'Free' | 'Pro' | 'Enterprise'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'candidate' | 'recruiter' | 'admin'
  status: UserStatus
  location: string
  joinedAt: string
  lastActive: string
  applications: number
}

export interface AdminCompany {
  id: string
  slug: string
  name: string
  industry: string
  location: string
  size: string
  status: CompanyStatus
  verified: boolean
  plan: CompanyPlan
  openPositions: number
  rating: number
}

export interface AdminJob {
  id: string
  title: string
  company: string
  category: string
  employmentType: EmploymentType
  experienceLevel: ExperienceLevel
  status: AdminJobStatus
  featured: boolean
  applicants: number
  views: number
  postedAt: string
}

export interface AdminApplication {
  id: string
  applicant: string
  email: string
  job: string
  company: string
  appliedAt: string
  status: ApplicationStatus
  rating: number
}

export interface ActivityItem {
  id: string
  type: 'user' | 'company' | 'job' | 'application' | 'report'
  title: string
  description: string
  time: string
}

export interface AdminStats {
  totalUsers: number
  activeJobs: number
  companies: number
  applications: number
  totalUsersDelta: number
  activeJobsDelta: number
  companiesDelta: number
  applicationsDelta: number
}

export interface MonthlyMetric {
  month: string
  applications: number
  hires: number
}

export interface MonthlyRegistrations {
  month: string
  candidates: number
  recruiters: number
}

export interface CategoryMetric {
  name: string
  value: number
}
