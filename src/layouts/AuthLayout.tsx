import { Outlet } from 'react-router-dom'
import { Container, Logo, ThemeToggle } from '../components/ui'

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 bg-brand-gradient opacity-[0.05]" />
      <header className="relative z-10 flex h-16 items-center border-b border-border bg-background/80 backdrop-blur-xl">
        <Container className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </Container>
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <Outlet />
      </main>
    </div>
  )
}
