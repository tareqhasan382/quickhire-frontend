import type { SalaryRange } from '../types'
import { CURRENCY_SYMBOLS } from '../constants'

const salaryPeriodLabel: Record<SalaryRange['period'], string> = {
  year: '/yr',
  month: '/mo',
  hour: '/hr',
}

export function formatSalary(salary: SalaryRange): string {
  const symbol = CURRENCY_SYMBOLS[salary.currency] ?? ''
  const suffix = salaryPeriodLabel[salary.period]
  return `${symbol}${salary.min.toLocaleString()} – ${symbol}${salary.max.toLocaleString()} ${suffix}`.trim()
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`
  return String(value)
}

export function timeAgo(dateIso: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateIso).getTime()) / 1000)

  if (seconds < 60) return 'just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`

  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`

  return new Date(dateIso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return `${count} ${count === 1 ? singular : (plural ?? `${singular}s`)}`
}
