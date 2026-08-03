import { Star, StarHalf } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Rating({ value, className, size = 'size-4' }: { value: number; className?: string; size?: string }) {
  const fullStars = Math.floor(value)
  const hasHalf = value - fullStars >= 0.5

  return (
    <span className={cn('inline-flex items-center gap-0.5 text-amber-400', className)} aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: fullStars }, (_, index) => (
        <Star key={index} className={cn(size, 'fill-current')} />
      ))}
      {hasHalf && <StarHalf className={cn(size, 'fill-current')} />}
    </span>
  )
}
