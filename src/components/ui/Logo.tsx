import { Link } from 'react-router-dom'
import { Briefcase } from 'lucide-react'
import { APP_NAME } from '../../constants'
import { cn } from '../../lib/utils'

export interface LogoProps {
  to?: string
  className?: string
  showText?: boolean
}

export function Logo({ to = '/', className, showText = true }: LogoProps) {
  return (
    <Link to={to} className={cn('group inline-flex items-center gap-2.5', className)} aria-label={APP_NAME}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
        <Briefcase className="size-5" />
      </span>
      {showText && (
        <span className="text-xl font-bold tracking-tight text-foreground">
          Quick<span className="text-primary">Hire</span>
        </span>
      )}
    </Link>
  )
}
