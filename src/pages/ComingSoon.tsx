import { Hammer, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container, buttonStyles } from '../components/ui'

export interface ComingSoonProps {
  title: string
  description?: string
}

export function ComingSoon({
  title,
  description = 'This page is part of the current build. It is coming soon — sit tight!',
}: ComingSoonProps) {
  return (
    <section className="flex min-h-[70vh] items-center justify-center py-16">
      <Container>
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Hammer className="size-8" />
          </span>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
          <Link to="/" className={buttonStyles({ variant: 'primary', size: 'md', className: 'mt-2' })}>
            <Home className="size-4" />
            Back to home
          </Link>
        </div>
      </Container>
    </section>
  )
}
