import type { EmploymentType, ExperienceLevel, JobSort } from '../../types'

export const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Freelance', label: 'Freelance' },
]

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'Entry', label: 'Entry level' },
  { value: 'Junior', label: 'Junior' },
  { value: 'Mid', label: 'Mid level' },
  { value: 'Senior', label: 'Senior' },
  { value: 'Lead', label: 'Lead' },
]

export const SALARY_BANDS: { value: number; label: string }[] = [
  { value: 60000, label: '$60k+' },
  { value: 80000, label: '$80k+' },
  { value: 100000, label: '$100k+' },
  { value: 120000, label: '$120k+' },
  { value: 150000, label: '$150k+' },
]

export const SORT_OPTIONS: { value: JobSort; label: string }[] = [
  { value: 'newest', label: 'Most recent' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'salary-high', label: 'Highest salary' },
  { value: 'salary-low', label: 'Lowest salary' },
  { value: 'popular', label: 'Most popular' },
]
