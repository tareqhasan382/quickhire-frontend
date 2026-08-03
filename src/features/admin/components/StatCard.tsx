import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { formatNumber } from '../../../utils/format'
import { cn } from '../../../lib/utils'

export interface StatCardProps {
  label: string
  value: number
  delta?: number
  suffix?: string
  icon: LucideIcon
  iconClassName?: string
}

export function StatCard({ label, value, delta, suffix, icon: Icon, iconClassName }: StatCardProps) {
  const positive = (delta ?? 0) >= 0
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary',
            iconClassName,
          )}
        >
          <Icon className="size-5" />
        </span>
        {delta !== undefined && (
          <span
            className={cn(
              'flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
              positive ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive',
            )}
          >
            {positive ? (
              <ArrowUpRight className="size-3.5" />
            ) : (
              <ArrowDownRight className="size-3.5" />
            )}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight">
        {formatNumber(value)}
        {suffix}
      </p>
      <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
