import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Briefcase, MapPin, Search, SearchX, SlidersHorizontal, X } from 'lucide-react'
import { categories } from '../data/categories'
import { useJobFilters } from '../features/jobs/hooks/useJobFilters'
import { useJobsQuery } from '../features/jobs/hooks/useJobsQuery'
import { JobFilters } from '../features/jobs/components/JobFilters'
import { SORT_OPTIONS } from '../features/jobs/constants'
import { JobCard } from '../components/jobs/JobCard'
import { JobCardSkeleton } from '../components/jobs/JobCardSkeleton'
import {
  Button,
  Container,
  Drawer,
  EmptyState,
  ErrorState,
  Pagination,
  Select,
} from '../components/ui'
import { useIsMobile } from '../hooks/useMediaQuery'
import type { JobSort } from '../types'

interface FilterChip {
  key: string
  label: ReactNode
  onClear: () => void
}

export function JobSearchPage() {
  const store = useJobFilters()
  const { filters, page, activeFilterCount, update, setSort, setPage, reset } = store
  const [keyword, setKeyword] = useState(filters.query ?? '')
  const [location, setLocation] = useState(filters.location ?? '')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isMobile = useIsMobile()

  const { data, isLoading, isError, refetch } = useJobsQuery(filters, page)

  const handleSearch = (event: FormEvent) => {
    event.preventDefault()
    update({ query: keyword, location })
  }

  const chips: FilterChip[] = []
  if (filters.query) {
    chips.push({ key: 'q', label: `“${filters.query}”`, onClear: () => update({ query: undefined }) })
  }
  if (filters.location) {
    chips.push({ key: 'loc', label: filters.location, onClear: () => update({ location: undefined }) })
  }
  if (filters.category) {
    const name = categories.find((item) => item.slug === filters.category)?.name ?? filters.category
    chips.push({ key: 'cat', label: name, onClear: () => update({ category: undefined }) })
  }
  filters.employmentTypes?.forEach((type) =>
    chips.push({ key: `et-${type}`, label: type, onClear: () => store.toggleEmploymentType(type) }),
  )
  filters.experienceLevels?.forEach((level) =>
    chips.push({ key: `el-${level}`, label: level, onClear: () => store.toggleExperienceLevel(level) }),
  )
  if (filters.remote) {
    chips.push({ key: 'remote', label: 'Remote only', onClear: () => update({ remote: undefined }) })
  }
  if (filters.minSalary) {
    chips.push({
      key: 'salary',
      label: `$${filters.minSalary.toLocaleString()}+`,
      onClear: () => update({ minSalary: undefined }),
    })
  }

  const resultCount = data?.total ?? 0
  const from = resultCount === 0 ? 0 : (page - 1) * (data?.pageSize ?? 9) + 1
  const to = Math.min(page * (data?.pageSize ?? 9), resultCount)

  return (
    <>
      <section className="border-b border-border bg-card">
        <Container className="py-12 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Job search
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Find your next opportunity
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Search thousands of curated roles, filter by what matters, and apply in minutes.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="mt-8 rounded-2xl border border-border bg-background p-2 shadow-soft"
          >
            <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <div className="flex items-center gap-2 rounded-xl px-3">
                <Briefcase className="size-4 shrink-0 text-muted-foreground" />
                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Job title, skill or company"
                  aria-label="Job title, skill or company"
                  className="h-11 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 rounded-xl px-3">
                <MapPin className="size-4 shrink-0 text-muted-foreground" />
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="City, country or Remote"
                  aria-label="Location"
                  className="h-11 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              >
                <Search className="size-4" />
                Search
              </button>
            </div>
          </form>

          {chips.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onClear}
                  className="group flex items-center gap-1.5 rounded-full border border-border bg-background py-1 pl-3 pr-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40"
                >
                  {chip.label}
                  <span className="flex size-4 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <X className="size-3" />
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={reset}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Clear all
              </button>
            </div>
          )}
        </Container>
      </section>

      <section className="py-10 lg:py-14">
        <Container>
          <div className="flex gap-10">
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-soft">
                <JobFilters store={store} />
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {isLoading ? (
                    'Searching jobs…'
                  ) : (
                    <>
                      <span className="font-semibold text-foreground">{resultCount}</span>{' '}
                      {resultCount === 1 ? 'job' : 'jobs'} found
                      {filters.query && (
                        <>
                          {' '}
                          for <span className="font-medium text-foreground">“{filters.query}”</span>
                        </>
                      )}
                    </>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="md"
                    className="lg:hidden"
                    onClick={() => setDrawerOpen(true)}
                  >
                    <SlidersHorizontal className="size-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                  <Select
                    value={filters.sort}
                    onChange={(event) => setSort(event.target.value as JobSort)}
                    options={SORT_OPTIONS}
                    aria-label="Sort jobs"
                    className="w-44 sm:w-52"
                  />
                </div>
              </div>

              <div className="mt-6">
                {isError ? (
                  <ErrorState onRetry={() => refetch()} />
                ) : isLoading ? (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 9 }, (_, index) => (
                      <JobCardSkeleton key={index} />
                    ))}
                  </div>
                ) : data && data.items.length > 0 ? (
                  <>
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {data.items.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                    <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                      <p className="text-sm text-muted-foreground">
                        Showing <span className="font-medium text-foreground">{from}</span>-
                        <span className="font-medium text-foreground">{to}</span> of{' '}
                        <span className="font-medium text-foreground">{resultCount}</span> jobs
                      </p>
                      <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
                    </div>
                  </>
                ) : (
                  <EmptyState
                    icon={<SearchX className="size-7" />}
                    title="No jobs match your search"
                    description="Try adjusting your keywords or removing a few filters to see more results."
                    action={
                      <Button variant="outline" size="sm" onClick={reset}>
                        Clear all filters
                      </Button>
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {isMobile && (
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Filters">
          <JobFilters store={store} />
        </Drawer>
      )}
    </>
  )
}
