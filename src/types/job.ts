export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance'

export type ExperienceLevel = 'Entry' | 'Junior' | 'Mid' | 'Senior' | 'Lead'

export type JobStatus = 'Active' | 'Closed' | 'Draft'

export interface SalaryRange {
  min: number
  max: number
  currency: 'USD' | 'EUR' | 'GBP'
  period: 'year' | 'hour' | 'month'
}

export interface CompanySummary {
  id: string
  name: string
  logo?: string
  verified: boolean
}

export interface Job {
  id: string
  slug: string
  title: string
  company: CompanySummary
  category: string
  location: string
  remote: boolean
  employmentType: EmploymentType
  experienceLevel: ExperienceLevel
  salary: SalaryRange
  skills: string[]
  tags: string[]
  summary: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  postedAt: string
  deadline: string
  applicantsCount: number
  featured: boolean
  status: JobStatus
  views: number
}
