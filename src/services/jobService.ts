import type { Job, JobFilters, PaginatedResult } from '../types'
import { categories } from '../data/categories'
import { getCompanies } from './companyService'
import { apiFetch } from './http'
import type { BackendJob } from './mappers'
import { mapJob } from './mappers'

const MAX_JOBS_LIMIT = 200

function categorySlugToName(slug: string): string {
  return categories.find((category) => category.slug === slug)?.name ?? slug
}

function buildJobQuery(filters: JobFilters, page: number, pageSize: number): URLSearchParams {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(pageSize))

  if (filters.query) params.set('search', filters.query)
  if (filters.location) params.set('location', filters.location)
  if (filters.category) params.set('category', categorySlugToName(filters.category))
  if (filters.employmentTypes?.length) params.set('employmentType', filters.employmentTypes.join(','))
  if (filters.experienceLevels?.length) params.set('experienceLevel', filters.experienceLevels.join(','))
  if (filters.remote) params.set('locationType', 'Remote')
  if (filters.minSalary) params.set('minSalary', String(filters.minSalary))
  if (filters.sort && filters.sort !== 'newest') params.set('sort', filters.sort)

  return params
}

async function mapJobs(rawList: BackendJob[]): Promise<Job[]> {
  const companies = await getCompanies()
  return rawList.map((raw) => mapJob(raw, companies))
}

export const jobService = {
  async getFeatured(): Promise<Job[]> {
    const { data } = await apiFetch<BackendJob[]>('/jobs/featured')
    return mapJobs(data)
  },

  async getBySlug(slug: string): Promise<Job | undefined> {
    const { data } = await apiFetch<BackendJob[]>(`/jobs?limit=${MAX_JOBS_LIMIT}`)
    const jobs = await mapJobs(data)
    return jobs.find((job) => job.slug === slug)
  },

  async getSimilar(slug: string, limit = 3): Promise<Job[]> {
    const { data } = await apiFetch<BackendJob[]>(`/jobs?limit=${MAX_JOBS_LIMIT}`)
    const jobs = await mapJobs(data)
    const current = jobs.find((job) => job.slug === slug)
    if (!current) return []

    const sameCategory = jobs.filter(
      (job) => job.slug !== slug && job.category === current.category && job.status === 'Active',
    )
    if (sameCategory.length >= limit) return sameCategory.slice(0, limit)

    const rest = jobs.filter(
      (job) =>
        job.slug !== slug &&
        job.category !== current.category &&
        job.status === 'Active' &&
        job.skills.some((skill) => current.skills.includes(skill)),
    )
    return [...sameCategory, ...rest].slice(0, limit)
  },

  async getByCompany(companyName: string): Promise<Job[]> {
    const { data } = await apiFetch<BackendJob[]>(
      `/jobs?company=${encodeURIComponent(companyName)}&limit=${MAX_JOBS_LIMIT}`,
    )
    return mapJobs(data)
  },

  async search(query: string): Promise<Job[]> {
    const term = query.trim()
    if (!term) return []
    const { data } = await apiFetch<BackendJob[]>(
      `/jobs?search=${encodeURIComponent(term)}&limit=8`,
    )
    return mapJobs(data)
  },

  async searchJobs(
    filters: JobFilters = {},
    page = 1,
    pageSize = 9,
  ): Promise<PaginatedResult<Job>> {
    const query = buildJobQuery(filters, page, pageSize)
    const { data, meta } = await apiFetch<BackendJob[]>(`/jobs?${query.toString()}`)
    const jobs = await mapJobs(data)
    const total = meta?.total ?? jobs.length
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    return {
      items: jobs,
      total,
      page: meta?.page ?? page,
      pageSize,
      totalPages,
    }
  },
}
