import type { Company, CompanySummary, Job, Role, SalaryRange, User } from '../types'

export interface BackendUser {
  _id?: string
  id?: string
  name: string
  email: string
  role: Role
  avatar?: string
  title?: string
  phone?: string
  location?: string
  isVerified?: boolean
  bio?: string
  skills?: string[]
  languages?: string[]
  resume_link?: string
  portfolio_link?: string
  workExperience?: BackendWorkExperience[]
  education?: BackendEducation[]
  certificates?: BackendCertificate[]
  savedJobs?: (string | BackendJob)[]
}

export interface BackendWorkExperience {
  title: string
  company: string
  location?: string
  startDate?: string
  endDate?: string
  current?: boolean
  description?: string
}

export interface BackendEducation {
  school: string
  degree?: string
  field?: string
  startDate?: string
  endDate?: string
  description?: string
}

export interface BackendCertificate {
  name: string
  issuer?: string
  year?: string
  url?: string
}

export interface BackendCompany {
  _id: string
  name: string
  logo?: string
  industry: string
  location: string
  website?: string
  size: string
  founded?: number
  description: string
  benefits?: string[]
  rating: number
  reviewCount: number
  verified: boolean
  featured: boolean
  tags?: string[]
  openPositions?: number
}

export interface BackendJob {
  _id: string
  title: string
  company: string
  location?: { type?: string; city?: string; country?: string }
  category: string
  summary?: string
  description: string
  requirements?: string[]
  responsibilities?: string[]
  benefits?: string[]
  employmentType: Job['employmentType']
  experienceLevel: Job['experienceLevel']
  salary: SalaryRange
  skills?: string[]
  tags?: string[]
  status: Job['status']
  featured?: boolean
  views?: number
  applicantsCount?: number
  deadline?: string | null
  createdAt?: string
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function mapUser(raw: BackendUser): User {
  return {
    id: raw._id ?? raw.id ?? '',
    name: raw.name,
    email: raw.email,
    role: raw.role,
    avatar: raw.avatar,
    title: raw.title,
    phone: raw.phone,
    location: raw.location,
    verified: Boolean(raw.isVerified),
  }
}

export function mapCompany(raw: BackendCompany): Company {
  return {
    id: raw._id,
    slug: slugify(raw.name),
    name: raw.name,
    logo: raw.logo,
    industry: raw.industry,
    location: raw.location,
    website: raw.website ?? '',
    size: raw.size,
    founded: raw.founded ?? 0,
    description: raw.description,
    benefits: raw.benefits ?? [],
    openPositions: raw.openPositions ?? 0,
    rating: raw.rating,
    reviewCount: raw.reviewCount,
    verified: raw.verified,
    featured: raw.featured,
    tags: raw.tags ?? [],
  }
}

export function formatJobLocation(location?: BackendJob['location']): string {
  if (!location) return ''
  if (location.type === 'Remote') return 'Remote'
  const place = [location.city, location.country].filter(Boolean).join(', ')
  return place || location.type || ''
}

export function mapJob(raw: BackendJob, companies: Company[]): Job {
  const company = companies.find((item) => item.name === raw.company)
  const summary: CompanySummary = company
    ? { id: company.id, name: company.name, logo: company.logo, verified: company.verified }
    : { id: '', name: raw.company, verified: false }

  return {
    id: raw._id,
    slug: slugify(raw.title),
    title: raw.title,
    company: summary,
    category: raw.category,
    location: formatJobLocation(raw.location),
    remote: raw.location?.type === 'Remote',
    employmentType: raw.employmentType,
    experienceLevel: raw.experienceLevel,
    salary: raw.salary,
    skills: raw.skills ?? [],
    tags: raw.tags ?? [],
    summary: raw.summary ?? '',
    description: raw.description,
    requirements: raw.requirements ?? [],
    responsibilities: raw.responsibilities ?? [],
    benefits: raw.benefits ?? [],
    postedAt: raw.createdAt ?? '',
    deadline: raw.deadline ? new Date(raw.deadline).toISOString() : '',
    applicantsCount: raw.applicantsCount ?? 0,
    featured: raw.featured ?? false,
    status: raw.status ?? 'Active',
    views: raw.views ?? 0,
  }
}
