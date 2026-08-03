import type { EmploymentType, ExperienceLevel } from './job'

export type JobSort = 'newest' | 'oldest' | 'salary-high' | 'salary-low' | 'popular'

export interface JobFilters {
  query?: string
  location?: string
  category?: string
  employmentTypes?: EmploymentType[]
  experienceLevels?: ExperienceLevel[]
  remote?: boolean
  minSalary?: number
  sort?: JobSort
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
