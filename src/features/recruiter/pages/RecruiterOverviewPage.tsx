import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Briefcase, CheckCircle2, Eye, UserRoundSearch, Users } from 'lucide-react'
import { recruiterService } from '../services/recruiterService'
import { PageHeader } from '../../admin/components/PageHeader'
import { StatCard } from '../../admin/components/StatCard'
import { StatusBadge } from '../../admin/components/Table'
import {
  Avatar,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  Skeleton,
  buttonStyles,
} from '../../../components/ui'
import { timeAgo } from '../../../utils/format'
import { dashboardPath } from '../../../constants/dashboardNav'

export function RecruiterOverviewPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['recruiter', 'overview'],
    queryFn: recruiterService.getOverview,
  })

  const stats = data
    ? {
        totalJobs: data.jobs.length,
        activeJobs: data.jobs.filter((job) => job.status === 'Active').length,
        totalApplicants: data.applications.length,
        pipeline: data.applications.filter((app) =>
          ['Pending', 'Reviewed', 'Interview'].includes(app.status),
        ).length,
        views: data.jobs.reduce((sum, job) => sum + job.views, 0),
      }
    : { totalJobs: 0, activeJobs: 0, totalApplicants: 0, pipeline: 0, views: 0 }

  const topJobs = data ? [...data.jobs].sort((a, b) => b.applicants - a.applicants).slice(0, 5) : []
  const recentApplications = data ? data.applications.slice(0, 6) : []

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Recruiter"
        title="Overview"
        description="Track your job postings, applicants and hiring progress at a glance."
        action={
          <Link
            to={dashboardPath('recruiter', 'post-job')}
            className={buttonStyles({ variant: 'primary', size: 'md' })}
          >
            Post a job
          </Link>
        }
      />

      {isError ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">
          We could not load your dashboard. Please refresh the page.
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <Skeleton className="size-10 rounded-xl" />
                    <Skeleton className="mt-4 h-7 w-24" />
                    <Skeleton className="mt-2 h-4 w-32" />
                  </div>
                ))
              : (
                <>
                  <StatCard label="Total jobs" value={stats.totalJobs} icon={Briefcase} />
                  <StatCard label="Active jobs" value={stats.activeJobs} icon={CheckCircle2} />
                  <StatCard label="Total applicants" value={stats.totalApplicants} icon={Users} />
                  <StatCard label="In pipeline" value={stats.pipeline} icon={UserRoundSearch} />
                </>
              )}
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent applicants</CardTitle>
                  <CardDescription>The latest applications to your jobs.</CardDescription>
                </div>
                <Link
                  to={dashboardPath('recruiter', 'applicants')}
                  className={buttonStyles({ variant: 'outline', size: 'sm' })}
                >
                  View all
                </Link>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
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
                ) : recentApplications.length === 0 ? (
                  <EmptyState
                    title="No applications yet"
                    description="When candidates apply to your jobs, they will show up here."
                    action={
                      <Link
                        to={dashboardPath('recruiter', 'post-job')}
                        className={buttonStyles({ variant: 'primary', size: 'sm' })}
                      >
                        Post your first job
                      </Link>
                    }
                  />
                ) : (
                  <ul className="divide-y divide-border">
                    {recentApplications.map((application) => (
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
                <CardTitle>Top jobs</CardTitle>
                <CardDescription>Your jobs with the most applicants.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Skeleton key={index} className="h-12 w-full rounded-xl" />
                    ))}
                  </div>
                ) : topJobs.length === 0 ? (
                  <EmptyState
                    title="No jobs posted"
                    description="Create your first job to start receiving applicants."
                  />
                ) : (
                  <ul className="space-y-4">
                    {topJobs.map((job) => {
                      const max = Math.max(1, ...topJobs.map((item) => item.applicants))
                      const width = job.applicants === 0 ? 0 : Math.round((job.applicants / max) * 100)
                      return (
                        <li key={job.id}>
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-medium text-foreground">{job.title}</p>
                            <span className="shrink-0 text-xs text-muted-foreground">{job.applicants} applicants</span>
                          </div>
                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${width}%` }}
                            />
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
              <CardTitle>Job performance</CardTitle>
              <CardDescription>Views and applicants across every posting.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }, (_, index) => (
                    <Skeleton key={index} className="h-12 w-full rounded-xl" />
                  ))}
                </div>
              ) : data!.jobs.length === 0 ? (
                <EmptyState
                  title="No jobs yet"
                  description="Post a job to start tracking performance here."
                />
              ) : (
                <ul className="divide-y divide-border">
                  {data!.jobs.slice(0, 6).map((job) => (
                    <li key={job.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{job.title}</p>
                        <p className="text-xs text-muted-foreground">{job.company}</p>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Eye className="size-4" />
                          {job.views}
                        </span>
                        <span className="flex w-24 items-center gap-1.5 text-sm text-muted-foreground">
                          <Users className="size-4" />
                          {job.applicants}
                        </span>
                        <StatusBadge status={job.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
