import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LogOut, Menu, Search, ShieldCheck } from 'lucide-react'
import { dashboardNav, dashboardPath, roleLabel } from '../constants/dashboardNav'
import { useAuthStore } from '../store/authStore'
import { useSearchStore } from '../store/searchStore'
import { cn } from '../lib/utils'
import { Avatar, Container, Drawer, Dropdown, Logo, ThemeToggle } from '../components/ui'
import { SearchDialog } from '../components/search/SearchDialog'

type DashboardRole = 'candidate' | 'recruiter' | 'admin'

function settingsPath(role: DashboardRole): string {
  return role === 'admin' ? dashboardPath('admin', 'site-settings') : dashboardPath(role, 'settings')
}

function SidebarContent({ role }: { role: DashboardRole }) {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Logo />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Dashboard">
        {dashboardNav[role].map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={dashboardPath(role, item.path)}
                    end={item.path === ''}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary-soft text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )
                    }
                  >
                    <item.icon className="size-4.5 shrink-0" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
          {user && <Avatar name={user.name} size="sm" />}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user?.name ?? 'Guest'}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Dropdown
            trigger={
              <span className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-card hover:text-foreground">
                <LogOut className="size-4" />
              </span>
            }
            items={[
              { label: 'Settings', to: settingsPath(role) },
              {
                label: 'Sign out',
                danger: true,
                onClick: () => {
                  navigate('/')
                  logout()
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export function DashboardLayout() {
  const user = useAuthStore((state) => state.user)
  const role = user?.role ?? 'candidate'
  const setSearchOpen = useSearchStore((state) => state.setOpen)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card lg:block">
        <SidebarContent role={role} />
      </aside>

      <Drawer open={sidebarOpen} onClose={() => setSidebarOpen(false)} title="Menu" side="left">
        <SidebarContent role={role} />
      </Drawer>

      <div className="flex h-dvh min-h-0 flex-col lg:pl-[17.5rem] lg:pr-6">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-border bg-background/80 backdrop-blur-xl">
          <Container className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="inline-flex size-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            >
              <Menu className="size-5" />
            </button>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="size-3.5" />
              {roleLabel[role]}
            </span>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground sm:flex"
              >
                <Search className="size-4" />
                Search…
              </button>
              <ThemeToggle />
              {user && (
                <Dropdown
                  align="right"
                  trigger={<Avatar name={user.name} size="sm" className="cursor-pointer" />}
                  items={[
                    { label: 'Dashboard', to: dashboardPath(role, '') },
                    { label: 'Settings', to: settingsPath(role) },
                    {
                      label: 'Sign out',
                      danger: true,
                      onClick: () => {
                        navigate('/')
                        useAuthStore.getState().logout()
                      },
                    },
                  ]}
                />
              )}
            </div>
          </Container>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto py-8">
          <Outlet />
        </main>
      </div>

      <SearchDialog />
    </div>
  )
}
