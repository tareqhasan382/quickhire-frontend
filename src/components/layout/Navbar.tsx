import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, Menu, Search, Settings, User } from 'lucide-react'
import { NAV_LINKS, ROUTES } from '../../constants'
import { dashboardPath } from '../../constants/dashboardNav'
import { cn } from '../../lib/utils'
import { useAuthStore } from '../../store/authStore'
import { useSearchStore } from '../../store/searchStore'
import { Avatar, Container, Drawer, Dropdown, Logo, ThemeToggle, buttonStyles } from '../ui'
import type { Role } from '../../types'

function profilePath(role: Role): string {
  if (role === 'candidate') return 'profile'
  if (role === 'recruiter') return 'company-profile'
  return 'users'
}

function settingsPath(role: Role): string {
  return role === 'admin' ? 'site-settings' : 'settings'
}

export function Navbar() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const setSearchOpen = useSearchStore((state) => state.setOpen)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b transition-all duration-300',
          scrolled
            ? 'border-border bg-background/80 shadow-soft backdrop-blur-xl'
            : 'border-transparent bg-background/0',
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Logo />

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-soft text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground md:flex"
            >
              <Search className="size-4" />
              <span>Search jobs…</span>
              <kbd className="ml-2 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            </button>

            <ThemeToggle />

            {isAuthenticated && user ? (
              <Dropdown
                align="right"
                trigger={
                  <span className="flex items-center gap-2 rounded-xl p-1 pr-3 transition-colors hover:bg-muted">
                    <Avatar name={user.name} size="sm" />
                    <span className="hidden text-sm font-medium lg:block">{user.name.split(' ')[0]}</span>
                  </span>
                }
                items={[
                  { label: 'Dashboard', icon: <LayoutDashboard className="size-4" />, to: dashboardPath(user.role, '') },
                  { label: 'My Profile', icon: <User className="size-4" />, to: dashboardPath(user.role, profilePath(user.role)) },
                  { label: 'Settings', icon: <Settings className="size-4" />, to: dashboardPath(user.role, settingsPath(user.role)) },
                  {
                    label: 'Sign out',
                    icon: <LogOut className="size-4" />,
                    danger: true,
                    onClick: () => {
                      navigate('/')
                      logout()
                    },
                  },
                ]}
              />
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link to={ROUTES.login} className={buttonStyles({ variant: 'ghost', size: 'sm' })}>
                  Log in
                </Link>
                <Link to={ROUTES.signup} className={buttonStyles({ variant: 'primary', size: 'sm' })}>
                  Sign up
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="inline-flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </Container>
      </header>

      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} title="Menu" side="right">
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false)
              setSearchOpen(true)
            }}
            className="mb-2 flex items-center gap-2 rounded-xl bg-muted px-3 py-3 text-sm font-medium text-muted-foreground"
          >
            <Search className="size-4" />
            Search jobs…
            <kbd className="ml-auto rounded-md border border-border bg-card px-1.5 py-0.5 text-[10px]">⌘K</kbd>
          </button>

          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'rounded-xl px-3 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-soft text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="mt-4 border-t border-border pt-4">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar name={user.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  aria-label="Sign out"
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to={ROUTES.login} className={buttonStyles({ variant: 'outline', fullWidth: true })}>
                  Log in
                </Link>
                <Link to={ROUTES.signup} className={buttonStyles({ variant: 'primary', fullWidth: true })}>
                  Sign up free
                </Link>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </>
  )
}
