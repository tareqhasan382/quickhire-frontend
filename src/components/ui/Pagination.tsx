import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { buttonStyles } from './buttonStyles'

function getPageItems(page: number, totalPages: number, siblingCount = 1): (number | 'ellipsis')[] {
  const totalNumbers = siblingCount * 2 + 5
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const leftSibling = Math.max(page - siblingCount, 1)
  const rightSibling = Math.min(page + siblingCount, totalPages)
  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < totalPages - 1

  const items: (number | 'ellipsis')[] = []
  if (!showLeftEllipsis) {
    for (let i = 1; i <= rightSibling; i++) items.push(i)
  } else {
    items.push(1)
    items.push('ellipsis')
    for (let i = leftSibling; i <= rightSibling; i++) items.push(i)
  }
  if (showRightEllipsis) {
    items.push('ellipsis')
    items.push(totalPages)
  }
  return items
}

export interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
  siblingCount?: number
  className?: string
}

export function Pagination({ page, totalPages, onChange, siblingCount = 1, className }: PaginationProps) {
  const items = useMemo(() => getPageItems(page, totalPages, siblingCount), [page, totalPages, siblingCount])

  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-1.5', className)}>
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={buttonStyles({ variant: 'outline', size: 'icon', className: 'disabled:opacity-40' })}
      >
        <ChevronLeft className="size-4" />
      </button>

      {items.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onChange(item)}
            className={buttonStyles({
              variant: item === page ? 'primary' : 'outline',
              size: 'icon',
            })}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className={buttonStyles({ variant: 'outline', size: 'icon', className: 'disabled:opacity-40' })}
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  )
}
