import { useQuery } from '@tanstack/react-query'
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
import { CalendarClock, Percent, TrendingUp, UserCheck } from 'lucide-react'
import { adminService } from '../services/adminService'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton } from '../../../components/ui'

const PIE_COLORS = ['#4f46e5', '#8b5cf6', '#d946ef', '#f59e0b', '#10b981', '#64748b']

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

export function AdminAnalyticsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: adminService.getAnalytics,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        description="Deep-dive into platform growth, hiring velocity and category demand."
      />

      {isError ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">
          We could not load the analytics. Please refresh the page.
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
                <StatCard label="Applications this month" value={5100} delta={12.8} icon={TrendingUp} />
                <StatCard label="Hires this month" value={842} delta={20.1} icon={UserCheck} />
                <StatCard label="Avg. time to hire" value={18} icon={CalendarClock} />
                <StatCard label="Interview → hire rate" value={32} suffix="%" icon={Percent} />
              </>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Applications vs. hires</CardTitle>
              <CardDescription>Monthly application volume compared with successful hires.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data!.applicationsByMonth}>
                      <defs>
                        <linearGradient id="gradApps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradHires" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} width={44} tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="applications" name="Applications" stroke="var(--color-primary)" fill="url(#gradApps)" strokeWidth={2} />
                      <Area type="monotone" dataKey="hires" name="Hires" stroke="var(--color-success)" fill="url(#gradHires)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>New registrations</CardTitle>
                <CardDescription>Candidates and recruiters signing up each month.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <ChartSkeleton />
                ) : (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data!.registrationsByMonth} barSize={12}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} width={40} tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-muted)', opacity: 0.4 }} />
                        <Bar dataKey="candidates" name="Candidates" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="recruiters" name="Recruiters" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Jobs by category</CardTitle>
                <CardDescription>Distribution of active job listings across categories.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <ChartSkeleton />
                ) : (
                  <div className="flex flex-col items-center gap-6 sm:flex-row">
                    <div className="h-56 w-full max-w-56 shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={data!.jobsByCategory} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80} paddingAngle={2} strokeWidth={0}>
                            {data!.jobsByCategory.map((entry, index) => (
                              <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={tooltipStyle} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <ul className="w-full space-y-2.5">
                      {data!.jobsByCategory.map((item, index) => (
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
          </div>
        </>
      )}
    </div>
  )
}
