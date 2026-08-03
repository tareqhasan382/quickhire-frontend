export const APP_NAME = 'QuickHire'

export const APP_TAGLINE = 'Find your dream job faster'

export const APP_DESCRIPTION =
  'QuickHire is the modern hiring marketplace connecting top talent with companies that value great work.'

export const NAV_LINKS = [
  { label: 'Find Jobs', href: '/jobs' },
  { label: 'Companies', href: '/companies' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
] as const

export const ROUTES = {
  home: '/',
  jobs: '/jobs',
  jobDetails: (slug: string) => `/jobs/${slug}`,
  companies: '/companies',
  companyDetails: (slug: string) => `/companies/${slug}`,
  login: '/login',
  signup: '/signup',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',
  dashboard: '/dashboard',
} as const

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
}
