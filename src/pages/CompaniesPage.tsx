import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, MapPin, Search, SearchX } from 'lucide-react'
import { companyService } from '../services/companyService'
import { formatNumber } from '../utils/format'
import { Avatar, Container, EmptyState, ErrorState, Rating, Skeleton } from '../components/ui'
import type { Company } from '../types'

function CompanyCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="mt-4 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-4/5" />
      <Skeleton className="mt-4 h-3 w-1/2" />
    </div>
  )
}

function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      to={`/companies/${company.slug}`}
      className="group flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lifted"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={company.name} size="lg" />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
              {company.name}
              {company.verified && <BadgeCheck className="size-4 shrink-0 text-primary" />}
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {company.location}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
          {company.industry}
        </span>
      </div>

      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {company.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {company.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-1.5">
          <Rating value={company.rating} size="size-3.5" />
          <span className="text-xs text-muted-foreground">
            {company.rating} ({formatNumber(company.reviewCount)})
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-primary">
          {formatNumber(company.openPositions)} open roles
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

export function CompaniesPage() {
  const [query, setQuery] = useState('')
  const { data: companies, isLoading, isError, refetch } = useQuery({
    queryKey: ['companies'],
    queryFn: companyService.getAll,
  })

  const filtered = useMemo(() => {
    if (!companies) return []
    const term = query.trim().toLowerCase()
    if (!term) return companies
    return companies.filter((company) =>
      [company.name, company.industry, company.location, ...company.tags]
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [companies, query])

  return (
    <>
      <section className="border-b border-border bg-card">
        <Container className="py-12 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Companies</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Browse companies hiring on QuickHire
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Explore teams that are growing fast, investing in people, and building the future of
              their industries.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2 rounded-2xl border border-border bg-background px-4 shadow-soft">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, industry, location or tag…"
              aria-label="Search companies"
              className="h-12 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </Container>
      </section>

      <section className="py-10 lg:py-14">
        <Container>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {isLoading ? (
                'Loading companies…'
              ) : (
                <>
                  <span className="font-semibold text-foreground">{filtered.length}</span>{' '}
                  {filtered.length === 1 ? 'company' : 'companies'}
                  {query && (
                    <>
                      {' '}
                      matching <span className="font-medium text-foreground">“{query}”</span>
                    </>
                  )}
                </>
              )}
            </p>
          </div>

          {isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => (
                <CompanyCardSkeleton key={index} />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<SearchX className="size-7" />}
              title="No companies match your search"
              description="Try a different keyword, or clear your search to see all companies."
              action={
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Clear search
                </button>
              }
            />
          )}
        </Container>
      </section>
    </>
  )
}
