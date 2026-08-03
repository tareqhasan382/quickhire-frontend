import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'
import { Badge } from './Badge'
import { Reveal } from './Reveal'

export interface SectionHeadingProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        'mb-10 flex flex-col gap-3 sm:mb-14',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow && (
        <Badge variant="default" size="sm">
          {eyebrow}
        </Badge>
      )}
      <h2 className="max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">{title}</h2>
      {description && (
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
      )}
    </Reveal>
  )
}
