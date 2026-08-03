import { motion } from 'framer-motion'
import type { MouseEvent } from 'react'
import { BadgeCheck, Bookmark, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Job } from '../../types'
import { ROUTES } from '../../constants'
import { formatSalary, timeAgo } from '../../utils/format'
import { cn } from '../../lib/utils'
import { Avatar, Badge } from '../ui'
import { useSavedJobsStore } from '../../store/savedJobsStore'
import { showToast } from '../../lib/toast'

export function JobCard({ job, className }: { job: Job; className?: string }) {
  const toggleSave = useSavedJobsStore((state) => state.toggleSave)
  const isSaved = useSavedJobsStore((state) => state.isSaved(job.id))
  const saved = isSaved

  const handleToggleSave = (event: MouseEvent) => {
    event.preventDefault()
    toggleSave(job.id)
    showToast[saved ? 'info' : 'success'](saved ? 'Removed from saved jobs' : 'Job saved')
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', duration: 0.4, bounce: 0.25 }}
      className="h-full"
    >
      <Link
        to={ROUTES.jobDetails(job.slug)}
        className={cn(
          'group flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-colors duration-200 hover:border-primary/40',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar name={job.company.name} size="lg" />
            <div>
              <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                {job.company.name}
                {job.company.verified && <BadgeCheck className="size-4 text-primary" />}
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                {job.featured && <Badge variant="primary" size="sm">Featured</Badge>}
                {job.remote && <Badge variant="success" size="sm">Remote</Badge>}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleSave}
            aria-label={saved ? 'Remove from saved jobs' : 'Save job'}
            className={cn(
              'rounded-lg p-2 transition-colors',
              saved
                ? 'bg-primary-soft text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Bookmark className={cn('size-4.5', saved && 'fill-current')} />
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="text-base font-semibold leading-snug transition-colors group-hover:text-primary">
            {job.title}
          </h3>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {job.location}
            </span>
            <span className="text-border">•</span>
            <span>{job.employmentType}</span>
            <span className="text-border">•</span>
            <span>{job.experienceLevel}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm font-semibold text-foreground">{formatSalary(job.salary)}</span>
          <span className="text-xs text-muted-foreground">{timeAgo(job.postedAt)}</span>
        </div>
      </Link>
    </motion.div>
  )
}
