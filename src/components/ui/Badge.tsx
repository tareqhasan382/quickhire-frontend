import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

const badgeVariants = {
  default: 'bg-primary-soft text-primary',
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-muted text-muted-foreground',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  destructive: 'bg-destructive/15 text-destructive',
  outline: 'border border-border text-foreground',
} as const

const badgeSizes = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs',
} as const

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants
  size?: keyof typeof badgeSizes
  icon?: ReactNode
}

export function Badge({ className, variant = 'default', size = 'md', icon, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        badgeVariants[variant],
        badgeSizes[size],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  )
}
