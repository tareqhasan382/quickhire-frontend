import type { ReactNode } from 'react'
import { cn } from '../../../lib/utils'

export interface AuthCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function AuthCard({ title, subtitle, children, footer, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        'w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lifted sm:p-8',
        className,
      )}
    >
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm leading-relaxed text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="mt-6">{children}</div>
      {footer && <div className="mt-6 border-t border-border pt-5">{footer}</div>}
    </div>
  )
}
