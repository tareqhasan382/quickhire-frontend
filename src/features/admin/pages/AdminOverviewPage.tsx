import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowDownToLine,
  ArrowUpRight,
  Briefcase,
  Building2,
  FileCheck,
  ShieldAlert,
  UserPlus,
  Users,
} from 'lucide-react'
import { adminService } from '../services/adminService'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { StatusBadge } from '../components/Table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton } from '../../../components/ui'
import { Avatar } from '../../../components/ui'
import { timeAgo } from '../../../utils/format'
import { showToast } from '../../../lib/toast'
import { useAuthStore } from '../../../store/authStore'
import { dashboardPath } from '../../../constants/dashboardNav'
import type { ActivityItem } from '../types'

const PIE_COLORS = ['#4f46e5', '#8b5cf6', '#d946ef', '#f59e0b', '#10b981', '#64748b']

const ACTIVITY_ICONS: Record<ActivityItem['type'], typeof UserPlus> = {
  user: UserPlus,
  company: Building2,
  job: Briefcase,
  application: FileCheck,
  report: ShieldAlert,
}

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function todayLabel(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

const QUICK_ACTIONS = [
  { label: 'Manage users', path: 'users', icon: Users },
  { label: 'Manage jobs', path: 'jobs', icon: Briefcase },
  { label: 'Manage companies', path: 'companies', icon: Building2 },
  { label: 'View applications', path: 'applications', icon: FileCheck },
]

const tooltipStyle = {
  background: 'var(--color-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 12,
  fontSize: 12,
  color: 'var(--color-foreground)',
}

function ChartSkeleton() {
  return (
    <div className="space-y-3 p-6">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-56" />
      <Skeleton className="mt-4 h-52 w-full" />
    </div>
  )
}

export function AdminOverviewPage() {
  const adminName = useAuthStore((state) => state.user?.name)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: adminService.getOverview,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Overview"
        description="A snapshot of how the platform is performing across users, jobs, companies and applications."
        action={
          <button
            type="button"
            onClick={() => showToast.info('Report exported', 'A CSV export has been queued.')}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <ArrowDownToLine className="size-4" />
            Export report
          </button>
        }
      />

      <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-6 lg:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 85% 20%, rgba(255,255,255,0.8), transparent 40%), radial-gradient(circle at 20% 100%, rgba(255,255,255,0.5), transparent 45%)',
          }}
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
              {greeting()} · {todayLabel()}
            </p>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-white lg:text-3xl">
              Welcome back, {adminName?.split(' ')[0] ?? 'Admin'}
            </h2>
            <p className="mt-1.5 text-sm text-white/80">
              Here's what's happening across QuickHire today.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.path}
                to={dashboardPath('admin', action.path)}
                className="group inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-white"
              >
                <action.icon className="size-4 text-primary" />
                {action.label}
                <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {isError ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">
          We could not load the admin overview. Please refresh the page.
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {isLoading ? (
              Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <Skeleton className="size-10 rounded-xl" />
                  <Skeleton className="mt-4 h-7 w-24" />
                  <Skeleton className="mt-2 h-4 w-32" />
                </div>
              ))
            ) : (
              <>
                <StatCard label="Total users" value={data!.stats.totalUsers} delta={data!.stats.totalUsersDelta} icon={Users} />
                <StatCard label="Active jobs" value={data!.stats.activeJobs} delta={data!.stats.activeJobsDelta} icon={Briefcase} />
                <StatCard label="Companies" value={data!.stats.companies} delta={data!.stats.companiesDelta} icon={Building2} />
                <StatCard label="Applications" value={data!.stats.applications} delta={data!.stats.applicationsDelta} icon={FileCheck} />
              </>
            )}
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Applications over time</CardTitle>
                <CardDescription>Applications received per month over the last 12 months.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <ChartSkeleton />
                ) : (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data!.analytics.applicationsByMonth} barSize={22}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} width={44} tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-muted)', opacity: 0.4 }} />
                        <Bar dataKey="applications" name="Applications" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New signups</CardTitle>
                <CardDescription>Candidates vs. recruiters joining each month.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <ChartSkeleton />
                ) : (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data!.analytics.registrationsByMonth}>
                        <defs>
                          <linearGradient id="gradCandidates" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gradRecruiters" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} width={40} tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="candidates" name="Candidates" stroke="var(--color-primary)" fill="url(#gradCandidates)" strokeWidth={2} />
                        <Area type="monotone" dataKey="recruiters" name="Recruiters" stroke="var(--color-accent)" fill="url(#gradRecruiters)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent applications</CardTitle>
                <CardDescription>The latest applications submitted across the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[380px] space-y-3 overflow-y-auto">
                    {Array.from({ length: 5 }, (_, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Skeleton className="size-9 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-64" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="h-[380px] divide-y divide-border overflow-y-auto pr-1">
                    {data!.recentApplications.map((application) => (
                      <li key={application.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                        <Avatar name={application.applicant} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{application.applicant}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {application.job} · {application.company}
                          </p>
                        </div>
                        <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                          {timeAgo(application.appliedAt)}
                        </span>
                        <StatusBadge status={application.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity feed</CardTitle>
                <CardDescription>Recent platform events that need attention.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[380px] space-y-3 overflow-y-auto">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Skeleton key={index} className="h-14 w-full rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <ul className="h-[380px] space-y-4 overflow-y-auto pr-1">
                    {data!.activity.map((item) => {
                      const Icon = ACTIVITY_ICONS[item.type]
                      return (
                        <li key={item.id} className="flex gap-3">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                            <Icon className="size-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">{item.title}</p>
                            <p className="text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground/70">{timeAgo(item.time)}</p>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Applications by category</CardTitle>
              <CardDescription>Share of applications received across job categories.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                <div className="flex flex-col items-center gap-6 sm:flex-row">
                  <div className="h-56 w-full max-w-60 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={data!.analytics.jobsByCategory} dataKey="value" nameKey="name" innerRadius={52} outerRadius={86} paddingAngle={2} strokeWidth={0}>
                          {data!.analytics.jobsByCategory.map((entry, index) => (
                            <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="w-full space-y-2.5">
                    {data!.analytics.jobsByCategory.map((item, index) => (
                      <li key={item.name} className="flex items-center gap-3 text-sm">
                        <span className="size-2.5 shrink-0 rounded-full" style={{ background: PIE_COLORS[index % PIE_COLORS.length] }} />
                        <span className="flex-1 text-muted-foreground">{item.name}</span>
                        <span className="font-semibold text-foreground">{item.value.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
