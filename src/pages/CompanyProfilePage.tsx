import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Calendar,
  Check,
  ExternalLink,
  MapPin,
  Users,
} from 'lucide-react'
import { companyService } from '../services/companyService'
import { jobService } from '../services/jobService'
import { formatNumber } from '../utils/format'
import { Avatar, Badge, Container, ErrorState, Rating, Skeleton } from '../components/ui'
import { JobCard } from '../components/jobs/JobCard'
import { JobCardSkeleton } from '../components/jobs/JobCardSkeleton'
import { ROUTES } from '../constants'

function CompanyHeaderSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft lg:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium text-foreground">{value}</dd>
    </div>
  )
}

export function CompanyProfilePage() {
  const { id: slug } = useParams<{ id: string }>()

  const {
    data: company,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['companies', slug],
    queryFn: () => companyService.getBySlug(slug ?? ''),
    enabled: Boolean(slug),
  })

  const { data: jobs, isLoading: jobsLoading, isError: jobsError } = useQuery({
    queryKey: ['jobs', 'company', company?.name],
    queryFn: () => jobService.getByCompany(company!.name),
    enabled: Boolean(company),
  })

  if (isLoading) {
    return (
      <section className="py-10 lg:py-14">
        <Container>
          <div className="mb-6 flex items-center gap-2">
            <Skeleton className="h-4 w-28" />
          </div>
          <CompanyHeaderSkeleton />
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8">
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
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
            title="Could not load this company"
            description="Something went wrong while fetching the company profile. Please try again."
            onRetry={() => refetch()}
          />
        </Container>
      </section>
    )
  }

  if (!company) {
    return (
      <section className="py-10 lg:py-14">
        <Container>
          <ErrorState
            title="Company not found"
            description="The company you are looking for does not exist or is no longer available."
            action={
              <Link
                to={ROUTES.companies}
                className="text-sm font-semibold text-primary transition-colors hover:underline"
              >
                Browse all companies
              </Link>
            }
          />
        </Container>
      </section>
    )
  }

  return (
    <section className="py-10 lg:py-14">
      <Container>
        <Link
          to={ROUTES.companies}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          All companies
        </Link>

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          <div className="pointer-events-none h-20 bg-brand-gradient opacity-80" />
          <div className="p-6 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <Avatar name={company.name} size="xl" className="ring-4 ring-card" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">{company.name}</h1>
                    {company.verified && (
                      <BadgeCheck className="size-5 shrink-0 text-primary" />
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="size-3.5" />
                      {company.industry}
                    </span>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {company.location}
                    </span>
                  </div>
                </div>
              </div>

              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Visit website
                <ExternalLink className="size-4" />
              </a>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-4">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Open roles
                </dt>
                <dd className="mt-1 text-xl font-bold">{formatNumber(company.openPositions)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Rating</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <Rating value={company.rating} size="size-4" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {company.rating} ({formatNumber(company.reviewCount)})
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Company size</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-xl font-bold">
                  <Users className="size-4 text-muted-foreground" />
                  {company.size}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Founded</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-xl font-bold">
                  <Calendar className="size-4 text-muted-foreground" />
                  {company.founded}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-8">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:p-8">
              <h2 className="text-lg font-semibold">About {company.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{company.description}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:p-8">
              <h2 className="text-lg font-semibold">Why join {company.name}</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {company.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-2.5 rounded-xl bg-muted/60 px-3.5 py-3 text-sm font-medium"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                      <Check className="size-3.5" />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Open positions at {company.name}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {jobs ? `${jobs.length} active` : ''}
                </span>
              </div>
              {jobsError ? (
                <ErrorState
                  title="Could not load jobs"
                  description="We could not fetch the open roles for this company right now."
                />
              ) : jobsLoading ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  {Array.from({ length: 4 }, (_, index) => (
                    <JobCardSkeleton key={index} />
                  ))}
                </div>
              ) : jobs && jobs.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
                  <p className="text-sm font-medium text-foreground">No open roles right now</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Check back soon — {company.name} is always hiring great people.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Company info
              </h3>
              <dl className="mt-3">
                <InfoRow label="Industry" value={company.industry} />
                <InfoRow label="Founded" value={company.founded} />
                <InfoRow label="Size" value={company.size} />
                <InfoRow label="Location" value={company.location} />
              </dl>
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:underline"
              >
                {company.website.replace(/^https?:\/\//, '')}
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Focus areas
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {company.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  )
}
