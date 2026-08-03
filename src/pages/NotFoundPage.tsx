import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { buttonStyles } from '../components/ui'

export function NotFoundPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-7xl font-black tracking-tight text-gradient sm:text-8xl">404</p>
        <h1 className="text-2xl font-bold sm:text-3xl">Page not found</h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          The page you are looking for might have been removed, renamed, or is temporarily unavailable.
        </p>
        <Link to="/" className={buttonStyles({ variant: 'primary', size: 'lg', className: 'mt-2' })}>
          <Home className="size-4" />
          Back to home
        </Link>
      </div>
    </section>
  )
}
