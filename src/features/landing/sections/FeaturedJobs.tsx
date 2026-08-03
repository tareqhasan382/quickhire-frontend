import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { jobService } from '../../../services/jobService'
import { Container, SectionHeading, buttonStyles } from '../../../components/ui'
import { Reveal } from '../../../components/ui'
import { JobCard } from '../../../components/jobs/JobCard'
import { JobCardSkeleton } from '../../../components/jobs/JobCardSkeleton'
import { ROUTES } from '../../../constants'

export function FeaturedJobs() {
  const { data: jobs, isLoading, isError } = useQuery({
    queryKey: ['jobs', 'featured'],
    queryFn: jobService.getFeatured,
  })

  return (
    <section className="border-y border-border bg-card py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Featured opportunities"
          title="Handpicked jobs for you"
          description="Our team surfaces the most exciting roles every week — apply before they are gone."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }, (_, index) => <JobCardSkeleton key={index} />)}

          {isError && (
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-center text-sm text-muted-foreground">
                We could not load the featured jobs right now. Please refresh the page.
              </p>
            </div>
          )}

          {jobs?.map((job, index) => (
            <Reveal key={job.id} delay={index * 0.05}>
              <JobCard job={job} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex justify-center">
          <Link to={ROUTES.jobs} className={buttonStyles({ variant: 'outline', size: 'lg' })}>
            View all jobs
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </Container>
    </section>
  )
}
