import { cn } from '../../lib/utils'

export const buttonVariants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
  secondary: 'bg-muted text-foreground hover:bg-muted/80',
  outline: 'border border-border bg-card text-foreground hover:bg-muted',
  ghost: 'text-foreground hover:bg-muted',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
  link: 'text-primary underline-offset-4 hover:underline',
  gradient: 'bg-brand-gradient text-white hover:opacity-90 shadow-sm',
} as const

export const buttonSizes = {
  sm: 'h-9 rounded-lg px-3 text-sm gap-1.5',
  md: 'h-10 rounded-xl px-4 text-sm gap-2',
  lg: 'h-12 rounded-xl px-6 text-base gap-2',
  icon: 'size-10 rounded-xl',
} as const

export type ButtonVariant = keyof typeof buttonVariants
export type ButtonSize = keyof typeof buttonSizes

export function buttonStyles(
  options: {
    variant?: ButtonVariant
    size?: ButtonSize
    fullWidth?: boolean
    className?: string
  } = {},
) {
  const { variant = 'primary', size = 'md', fullWidth, className } = options
  const isLink = variant === 'link'
  return cn(
    'inline-flex select-none items-center justify-center whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60',
    buttonVariants[variant],
    !isLink && buttonSizes[size],
    fullWidth && 'w-full',
    className,
  )
}
