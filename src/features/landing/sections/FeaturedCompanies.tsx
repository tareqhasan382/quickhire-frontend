import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, MapPin } from 'lucide-react'
import { companyService } from '../../../services/companyService'
import { formatNumber } from '../../../utils/format'
import { Avatar, Container, Rating, SectionHeading, Skeleton } from '../../../components/ui'
import { Reveal } from '../../../components/ui'

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
    </div>
  )
}

export function FeaturedCompanies() {
  const { data: companies, isLoading, isError } = useQuery({
    queryKey: ['companies', 'featured'],
    queryFn: companyService.getFeatured,
  })

  return (
    <section className="border-y border-border bg-card py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Featured companies"
          title="Companies hiring right now"
          description="Join teams that are growing fast, investing in people, and building the future of their industries."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading && Array.from({ length: 4 }, (_, index) => <CompanyCardSkeleton key={index} />)}

          {isError && (
            <div className="sm:col-span-2 lg:col-span-4">
              <p className="text-center text-sm text-muted-foreground">
                We could not load companies right now. Please refresh the page.
              </p>
            </div>
          )}

          {companies?.map((company, index) => (
            <Reveal key={company.id} delay={index * 0.06}>
              <Link
                to={`/companies/${company.slug}`}
                className="group flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lifted"
              >
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

                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {company.description}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-1.5">
                    <Rating value={company.rating} size="size-3.5" />
                    <span className="text-xs text-muted-foreground">
                      {company.rating} ({formatNumber(company.reviewCount)})
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                    {formatNumber(company.openPositions)} jobs
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
