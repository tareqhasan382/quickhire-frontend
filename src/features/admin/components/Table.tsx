import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '../../../lib/utils'
import { Badge } from '../../../components/ui'
import type { BadgeProps } from '../../../components/ui'

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return <table className={cn('w-full text-sm', className)} {...props} />
}

export function TableHead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('border-b border-border', className)} {...props} />
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('divide-y divide-border', className)} {...props} />
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('transition-colors hover:bg-muted/50', className)} {...props} />
}

export function TableHeaderCell({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('whitespace-nowrap px-4 py-3 align-middle', className)} {...props} />
}

const STATUS_TONES: Record<string, BadgeProps['variant']> = {
  Active: 'success',
  Verified: 'success',
  Hired: 'success',
  Reviewed: 'primary',
  Interview: 'warning',
  Pending: 'warning',
  Suspended: 'destructive',
  Rejected: 'destructive',
  Closed: 'destructive',
  Draft: 'secondary',
  Free: 'secondary',
  Pro: 'primary',
  Enterprise: 'warning',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={STATUS_TONES[status] ?? 'secondary'} size="sm">
      {status}
    </Badge>
  )
}
