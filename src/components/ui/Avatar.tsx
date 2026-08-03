import { cn } from '../../lib/utils'
import { initials } from '../../utils/format'

const avatarSizes = {
  xs: 'size-8 text-xs',
  sm: 'size-9 text-sm',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-16 text-xl',
} as const

export interface AvatarProps {
  name: string
  src?: string
  size?: keyof typeof avatarSizes
  className?: string
  ring?: boolean
}

export function Avatar({ name, src, size = 'md', className, ring = false }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        ring && 'ring-2 ring-background',
        avatarSizes[size],
        className,
      )}
    >
      {src ? (
        <img src={src} alt={name} className="size-full object-cover" />
      ) : (
        <span className="flex size-full items-center justify-center bg-brand-gradient font-semibold text-white">
          {initials(name)}
        </span>
      )}
    </span>
  )
}
