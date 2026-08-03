import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Bookmark, MapPin } from 'lucide-react'
import { candidateService } from '../services/candidateService'
import { PageHeader } from '../../admin/components/PageHeader'
import { Avatar, Button, EmptyState, Skeleton, buttonStyles } from '../../../components/ui'
import { formatSalary, timeAgo } from '../../../utils/format'
import { showToast } from '../../../lib/toast'

export function CandidateSavedPage() {
  const queryClient = useQueryClient()

  const { data: jobs = [], isLoading, isError } = useQuery({
    queryKey: ['candidate', 'saved-jobs'],
    queryFn: candidateService.getSavedJobs,
  })

  const unsaveMutation = useMutation({
    mutationFn: (id: string) => candidateService.unsaveJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'saved-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['candidate', 'overview'] })
    },
    onError: (error) => {
      showToast.error(error instanceof Error ? error.message : 'Could not remove the saved job.')
    },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Activity"
        title="Saved Jobs"
        description="Jobs you have bookmarked — revisit and apply at any time."
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">
          We could not load your saved jobs. Please refresh the page.
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-16">
          <EmptyState
            title="No saved jobs"
            description="Bookmark jobs you like and they will appear here."
            action={
              <Link to="/jobs" className={buttonStyles({ variant: 'primary', size: 'md' })}>
                Browse jobs
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
          {jobs.map((job) => (
            <li key={job.id} className="flex items-center gap-4 px-5 py-4">
              <Link
                to={`/jobs/${job.slug}`}
                className="flex min-w-0 flex-1 items-center gap-4"
              >
                <Avatar name={job.company.name} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground transition-colors hover:text-primary">
                    {job.title}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span>{job.company.name}</span>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {job.location}
                    </span>
                    <span className="text-border">•</span>
                    <span>{formatSalary(job.salary)}</span>
                    <span className="text-border">•</span>
                    <span>{timeAgo(job.postedAt)}</span>
                  </div>
                </div>
              </Link>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                isLoading={unsaveMutation.isPending}
                onClick={() => unsaveMutation.mutate(job.id)}
              >
                <Bookmark className="size-4 fill-current" />
                Unsave
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
