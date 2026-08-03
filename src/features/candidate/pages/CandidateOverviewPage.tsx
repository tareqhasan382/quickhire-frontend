import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bookmark,
  CalendarClock,
  ClipboardList,
  UserRoundSearch,
} from 'lucide-react'
import { candidateService } from '../services/candidateService'
import { jobService } from '../../../services/jobService'
import { PageHeader } from '../../admin/components/PageHeader'
import { StatCard } from '../../admin/components/StatCard'
import { StatusBadge } from '../../admin/components/Table'
import { JobCard } from '../../../components/jobs/JobCard'
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

const PIPELINE_STAGES = ['Pending', 'Reviewed', 'Interview']

function computeCompletion(profile: Awaited<ReturnType<typeof candidateService.getProfile>>) {
  const checks = [
    Boolean(profile.name),
    Boolean(profile.title),
    Boolean(profile.phone),
    Boolean(profile.location),
    Boolean(profile.bio),
    profile.skills.length > 0,
    Boolean(profile.resumeLink),
    Boolean(profile.portfolioLink),
    profile.workExperience.length > 0,
    profile.education.length > 0,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function CandidateOverviewPage() {
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['candidate', 'profile'],
    queryFn: candidateService.getProfile,
  })

  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ['candidate', 'applications'],
    queryFn: candidateService.getApplications,
  })

  const { data: savedJobs = [], isLoading: savedLoading } = useQuery({
    queryKey: ['candidate', 'saved-jobs'],
    queryFn: candidateService.getSavedJobs,
  })

  const { data: recommended } = useQuery({
    queryKey: ['candidate', 'recommended'],
    queryFn: () => jobService.searchJobs({}, 1, 3),
  })

  const loading = profileLoading || applicationsLoading || savedLoading

  const stats = {
    totalApplications: applications.length,
    pipeline: applications.filter((app) => PIPELINE_STAGES.includes(app.status)).length,
    interviews: applications.filter((app) => app.status === 'Interview').length,
    saved: savedJobs.length,
  }

  const recentApplications = applications.slice(0, 5)
  const savedPreview = savedJobs.slice(0, 4)
  const recommendedJobs = recommended?.items ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Candidate"
        title="Overview"
        description="Track your applications, saved jobs and recommended opportunities."
        action={
          <Link to="/jobs" className={buttonStyles({ variant: 'primary', size: 'md' })}>
            Browse jobs
            <ArrowRight className="size-4" />
          </Link>
        }
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <Skeleton className="size-10 rounded-xl" />
              <Skeleton className="mt-4 h-7 w-24" />
              <Skeleton className="mt-2 h-4 w-32" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total applications" value={stats.totalApplications} icon={ClipboardList} />
          <StatCard label="In pipeline" value={stats.pipeline} icon={UserRoundSearch} />
          <StatCard label="Interviews" value={stats.interviews} icon={CalendarClock} />
          <StatCard label="Saved jobs" value={stats.saved} icon={Bookmark} />
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Recent applications</CardTitle>
              <CardDescription>The latest jobs you have applied to.</CardDescription>
            </div>
            <Link
              to={dashboardPath('candidate', 'applied')}
              className={buttonStyles({ variant: 'outline', size: 'sm' })}
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {applicationsLoading ? (
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
                description="When you apply to jobs, they will show up here."
                action={
                  <Link to="/jobs" className={buttonStyles({ variant: 'primary', size: 'sm' })}>
                    Find a job
                  </Link>
                }
              />
            ) : (
              <ul className="divide-y divide-border">
                {recentApplications.map((application) => (
                  <li key={application.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <Avatar name={application.company} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{application.job}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {application.company} · {timeAgo(application.appliedAt)}
                      </p>
                    </div>
                    <StatusBadge status={application.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile completion</CardTitle>
            <CardDescription>Fill in your details to stand out to recruiters.</CardDescription>
          </CardHeader>
          <CardContent>
            {profileLoading || !profile ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold">{computeCompletion(profile)}%</span>
                  <span className="text-sm text-muted-foreground">complete</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${computeCompletion(profile)}%` }}
                  />
                </div>
                <Link
                  to={dashboardPath('candidate', 'profile')}
                  className={buttonStyles({ variant: 'outline', size: 'sm', className: 'w-full' })}
                >
                  Complete your profile
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Saved jobs</CardTitle>
              <CardDescription>Jobs you have bookmarked for later.</CardDescription>
            </div>
            <Link
              to={dashboardPath('candidate', 'saved')}
              className={buttonStyles({ variant: 'outline', size: 'sm' })}
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {savedLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <Skeleton key={index} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            ) : savedPreview.length === 0 ? (
              <EmptyState
                title="Nothing saved yet"
                description="Bookmark jobs you like to revisit them later."
                action={
                  <Link to="/jobs" className={buttonStyles({ variant: 'primary', size: 'sm' })}>
                    Browse jobs
                  </Link>
                }
              />
            ) : (
              <ul className="divide-y divide-border">
                {savedPreview.map((job) => (
                  <li key={job.id} className="py-3 first:pt-0 last:pb-0">
                    <Link
                      to={`/jobs/${job.slug}`}
                      className="block rounded-xl px-2 py-2 transition-colors hover:bg-muted"
                    >
                      <p className="truncate text-sm font-medium text-foreground">{job.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {job.company.name} · {job.location}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Recommended for you</CardTitle>
              <CardDescription>Fresh opportunities matched to your profile.</CardDescription>
            </div>
            <Link to="/jobs" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
              Browse all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {recommendedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
