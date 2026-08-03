import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  Check,
  ClipboardList,
  Clock,
  GraduationCap,
  MapPin,
  Send,
  Users,
} from 'lucide-react'
import { z } from 'zod'
import { jobService } from '../services/jobService'
import { candidateService } from '../features/candidate/services/candidateService'
import { useAuthStore } from '../store/authStore'
import { useSavedJobsStore } from '../store/savedJobsStore'
import { slugify } from '../services/mappers'
import { ROUTES } from '../constants'
import { formatSalary, timeAgo } from '../utils/format'
import { showToast } from '../lib/toast'
import { ApiError } from '../services/http'
import {
  Avatar,
  Badge,
  Button,
  Container,
  ErrorState,
  Input,
  Modal,
  Skeleton,
  Textarea,
} from '../components/ui'
import { JobCard } from '../components/jobs/JobCard'
import { JobCardSkeleton } from '../components/jobs/JobCardSkeleton'

const applyFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Enter a valid email address'),
  resumeLink: z.string().url('Resume link must be a valid URL'),
  coverNote: z.string().trim().max(1000, 'Cover note must be less than 1000 characters').optional(),
})

type ApplyFormValues = z.infer<typeof applyFormSchema>

function JobHeaderSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft lg:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="size-14 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>
    </div>
  )
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:p-8">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
          {icon}
        </span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
          <span className="mt-1.5 flex size-2 shrink-0 rounded-full bg-primary" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium text-foreground">{value}</dd>
    </div>
  )
}

export function JobDetailsPage() {
  const { id: slug } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isCandidate = user?.role === 'candidate'

  const toggleSave = useSavedJobsStore((state) => state.toggleSave)
  const isSaved = useSavedJobsStore((state) => (slug ? state.isSavedBySlug(slug) : false))

  const [applyOpen, setApplyOpen] = useState(false)

  const {
    data: job,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['jobs', 'slug', slug],
    queryFn: () => jobService.getBySlug(slug ?? ''),
    enabled: Boolean(slug),
  })

  const { data: similarJobs, isLoading: similarLoading } = useQuery({
    queryKey: ['jobs', 'similar', slug],
    queryFn: () => jobService.getSimilar(slug ?? '', 3),
    enabled: Boolean(slug),
  })

  const { data: applications } = useQuery({
    queryKey: ['candidate', 'applications'],
    queryFn: candidateService.getApplications,
    enabled: isCandidate && Boolean(job),
  })

  const alreadyApplied = Boolean(
    job && applications?.some((application) => application.jobId === job.id),
  )

  const { data: profile } = useQuery({
    queryKey: ['candidate', 'profile'],
    queryFn: candidateService.getProfile,
    enabled: applyOpen && isCandidate,
  })

  const form = useForm<ApplyFormValues>({
    resolver: zodResolver(applyFormSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      resumeLink: '',
      coverNote: '',
    },
  })

  useEffect(() => {
    if (!applyOpen) return
    form.reset({
      name: user?.name ?? '',
      email: user?.email ?? '',
      resumeLink: profile?.resumeLink ?? '',
      coverNote: '',
    })
  }, [applyOpen, profile, form, user])

  const applyMutation = useMutation({
    mutationFn: (values: ApplyFormValues) =>
      candidateService.apply(job!.id, {
        name: values.name,
        email: values.email,
        resumeLink: values.resumeLink,
        coverNote: values.coverNote,
      }),
    onSuccess: () => {
      setApplyOpen(false)
      showToast.success('Application submitted', `You applied for ${job?.title}.`)
      queryClient.invalidateQueries({ queryKey: ['candidate', 'applications'] })
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 409) {
        showToast.info('Already applied', 'You have already applied to this job.')
        queryClient.invalidateQueries({ queryKey: ['candidate', 'applications'] })
      } else {
        showToast.error(error instanceof Error ? error.message : 'Could not submit your application.')
      }
    },
  })

  const handleSave = () => {
    if (!job) return
    toggleSave(job.id, job.slug)
    showToast[isSaved ? 'info' : 'success'](isSaved ? 'Removed from saved jobs' : 'Job saved')
  }

  if (isLoading) {
    return (
      <section className="py-10 lg:py-14">
        <Container>
          <div className="mb-6 flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
          </div>
          <JobHeaderSkeleton />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8">
              <Skeleton className="h-44 rounded-2xl" />
              <Skeleton className="h-44 rounded-2xl" />
            </div>
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </Container>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="py-10 lg:py-14">
        <Container>
          <ErrorState
            title="Could not load this job"
            description="Something went wrong while fetching the job details. Please try again."
            onRetry={() => refetch()}
          />
        </Container>
      </section>
    )
  }

  if (!job) {
    return (
      <section className="py-10 lg:py-14">
        <Container>
          <ErrorState
            title="Job not found"
            description="The job you are looking for does not exist or is no longer available."
            action={
              <Link
                to={ROUTES.jobs}
                className="text-sm font-semibold text-primary transition-colors hover:underline"
              >
                Browse all jobs
              </Link>
            }
          />
        </Container>
      </section>
    )
  }

  const closed = job.status === 'Closed'
  const companySlug = slugify(job.company.name)

  const renderApplyCta = () => {
    if (closed) {
      return (
        <Button variant="outline" size="lg" fullWidth disabled>
          <Clock className="size-4" />
          Job closed
        </Button>
      )
    }
    if (!isAuthenticated) {
      return (
        <Button size="lg" fullWidth onClick={() => navigate(ROUTES.login)}>
          <Send className="size-4" />
          Log in to apply
        </Button>
      )
    }
    if (!isCandidate) {
      return null
    }
    if (alreadyApplied) {
      return (
        <Button variant="outline" size="lg" fullWidth disabled>
          <Check className="size-4" />
          Applied
        </Button>
      )
    }
    return (
      <Button size="lg" fullWidth onClick={() => setApplyOpen(true)}>
        <Send className="size-4" />
        Apply now
      </Button>
    )
  }

  return (
    <section className="py-10 lg:py-14">
      <Container>
        <Link
          to={ROUTES.jobs}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          All jobs
        </Link>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <Link to={ROUTES.companyDetails(companySlug)} className="shrink-0">
                <Avatar name={job.company.name} size="xl" className="rounded-2xl" />
              </Link>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {job.featured && <Badge variant="primary" size="sm">Featured</Badge>}
                  {job.remote && <Badge variant="success" size="sm">Remote</Badge>}
                  {closed && <Badge variant="destructive" size="sm">Closed</Badge>}
                </div>
                <h1 className="mt-2 text-2xl font-bold tracking-tight lg:text-3xl">{job.title}</h1>
                <Link
                  to={ROUTES.companyDetails(companySlug)}
                  className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  <Building2 className="size-4" />
                  {job.company.name}
                  {job.company.verified && <BadgeCheck className="size-4 text-primary" />}
                  <ArrowUpRight className="size-3.5" />
                </Link>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {job.location}
                  </span>
                  <span className="text-border">•</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="size-3.5" />
                    {job.employmentType}
                  </span>
                  <span className="text-border">•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {timeAgo(job.postedAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row lg:w-48 lg:flex-col">
              {renderApplyCta()}
              <Button variant="outline" size="lg" fullWidth onClick={handleSave}>
                <Bookmark className={isSaved ? 'size-4 fill-current' : 'size-4'} />
                {isSaved ? 'Saved' : 'Save job'}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-8">
            <SectionCard title="About this job" icon={<ClipboardList className="size-4" />}>
              <p className="text-sm leading-relaxed text-muted-foreground">{job.description}</p>
            </SectionCard>

            {job.responsibilities.length > 0 && (
              <SectionCard title="What you'll do" icon={<Check className="size-4" />}>
                <BulletList items={job.responsibilities} />
              </SectionCard>
            )}

            {job.requirements.length > 0 && (
              <SectionCard title="What we're looking for" icon={<Users className="size-4" />}>
                <BulletList items={job.requirements} />
              </SectionCard>
            )}

            {job.benefits.length > 0 && (
              <SectionCard title="Perks & benefits" icon={<GraduationCap className="size-4" />}>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {job.benefits.map((benefit) => (
                    <span
                      key={benefit}
                      className="flex items-center gap-2.5 rounded-xl bg-muted/60 px-3.5 py-3 text-sm font-medium"
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                        <Check className="size-3" />
                      </span>
                      {benefit}
                    </span>
                  ))}
                </div>
              </SectionCard>
            )}

            {job.skills.length > 0 && (
              <SectionCard title="Skills" icon={<Briefcase className="size-4" />}>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Job details
              </h3>
              <dl className="mt-3">
                <InfoRow label="Salary" value={<span className="font-semibold text-primary">{formatSalary(job.salary)}</span>} />
                <InfoRow label="Employment type" value={job.employmentType} />
                <InfoRow label="Experience level" value={job.experienceLevel} />
                <InfoRow label="Category" value={job.category} />
                <InfoRow label="Location" value={job.location} />
                <InfoRow label="Applicants" value={job.applicantsCount} />
                {job.deadline && (
                  <InfoRow
                    label="Deadline"
                    value={
                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        {new Date(job.deadline).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    }
                  />
                )}
              </dl>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                About the company
              </h3>
              <div className="mt-4 flex items-center gap-3">
                <Avatar name={job.company.name} size="md" />
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
                    {job.company.name}
                    {job.company.verified && <BadgeCheck className="size-4 shrink-0 text-primary" />}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {job.applicantsCount} applicant{job.applicantsCount === 1 ? '' : 's'} · {job.location}
                  </p>
                </div>
              </div>
              <Link
                to={ROUTES.companyDetails(companySlug)}
                className="mt-4 flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:underline"
              >
                View company profile
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-14">
          <h2 className="text-xl font-bold tracking-tight">Similar jobs</h2>
          {similarLoading ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }, (_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
          ) : similarJobs && similarJobs.length > 0 ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {similarJobs.map((item) => (
                <JobCard key={item.id} job={item} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
              <p className="text-sm text-muted-foreground">No similar jobs right now.</p>
            </div>
          )}
        </div>
      </Container>

      <Modal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        title="Apply for this job"
        description={job?.title}
        size="lg"
      >
        {job && (
          <form
            onSubmit={form.handleSubmit((values) => applyMutation.mutate(values))}
            className="space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Full name"
                placeholder="Alex Morgan"
                error={form.formState.errors.name?.message}
                {...form.register('name')}
              />
              <Input
                label="Email"
                type="email"
                placeholder="alex@example.com"
                error={form.formState.errors.email?.message}
                {...form.register('email')}
              />
            </div>
            <Input
              label="Resume link"
              type="url"
              placeholder="https://example.com/resume.pdf"
              hint="Paste a link to your resume (e.g. Google Drive or a portfolio URL)."
              error={form.formState.errors.resumeLink?.message}
              {...form.register('resumeLink')}
            />
            <Textarea
              label="Cover note"
              rows={4}
              placeholder="Tell the recruiter why you're a great fit… (optional)"
              error={form.formState.errors.coverNote?.message}
              {...form.register('coverNote')}
            />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setApplyOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={applyMutation.isPending}>
                <Send className="size-4" />
                Submit application
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </section>
  )
}
