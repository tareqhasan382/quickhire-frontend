import { z } from 'zod'

export const JOB_LOCATION_TYPES = ['Remote', 'Onsite', 'Hybrid'] as const
export const SALARY_CURRENCIES = ['USD', 'EUR', 'GBP'] as const
export const SALARY_PERIODS = ['year', 'hour', 'month'] as const
export const COMPANY_INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'E-commerce',
  'Marketing',
  'Design',
  'Consulting',
  'Manufacturing',
  'Real Estate',
  'Travel',
  'Food & Beverage',
  'Media',
  'Other',
] as const
export const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'] as const

export const jobFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title must be under 120 characters'),
  company: z.string().min(2, 'Company name is required'),
  category: z.string().min(1, 'Select a category'),
  locationType: z.enum(JOB_LOCATION_TYPES),
  city: z.string().optional(),
  country: z.string().optional(),
  employmentType: z.string().min(1, 'Select an employment type'),
  experienceLevel: z.string().min(1, 'Select an experience level'),
  salaryMin: z.string().refine(
    (value) => value !== '' && !Number.isNaN(Number(value)) && Number(value) >= 0,
    { message: 'Enter a valid minimum salary' },
  ),
  salaryMax: z.string().refine(
    (value) => value !== '' && !Number.isNaN(Number(value)) && Number(value) >= 0,
    { message: 'Enter a valid maximum salary' },
  ),
  currency: z.enum(SALARY_CURRENCIES),
  period: z.enum(SALARY_PERIODS),
  deadline: z.string().optional(),
  status: z.enum(['Active', 'Draft', 'Closed']),
  summary: z.string().max(300, 'Summary must be under 300 characters').optional(),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  benefits: z.string().optional(),
  skills: z.string().optional(),
  tags: z.string().optional(),
})
export type JobFormValues = z.infer<typeof jobFormSchema>

export const companyFormSchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  industry: z.string().min(1, 'Select an industry'),
  size: z.string().min(1, 'Select a company size'),
  location: z.string().min(2, 'Location is required'),
  website: z.union([z.literal(''), z.string().url('Enter a valid URL')]).optional(),
  founded: z.string().optional(),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  benefits: z.string().optional(),
  tags: z.string().optional(),
})
export type CompanyFormValues = z.infer<typeof companyFormSchema>

export const DEFAULT_JOB_FORM: JobFormValues = {
  title: '',
  company: '',
  category: '',
  locationType: 'Remote',
  city: '',
  country: '',
  employmentType: 'Full-time',
  experienceLevel: 'Mid',
  salaryMin: '',
  salaryMax: '',
  currency: 'USD',
  period: 'year',
  deadline: '',
  status: 'Active',
  summary: '',
  description: '',
  requirements: '',
  responsibilities: '',
  benefits: '',
  skills: '',
  tags: '',
}

export const DEFAULT_COMPANY_FORM: CompanyFormValues = {
  name: '',
  industry: '',
  size: '',
  location: '',
  website: '',
  founded: '',
  description: '',
  benefits: '',
  tags: '',
}
