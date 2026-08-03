import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight, Building2, CornerDownLeft, MapPin, Search, TrendingUp, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { jobService } from '../../services/jobService'
import { useSearchStore } from '../../store/searchStore'
import { ROUTES } from '../../constants'
import { Modal } from '../ui'

const POPULAR_SEARCHES = ['React', 'Designer', 'Remote', 'Fintech', 'Data Scientist', 'Marketing']

export function SearchDialog() {
  const open = useSearchStore((state) => state.open)
  const setOpen = useSearchStore((state) => state.setOpen)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')

  const trimmed = query.trim()
  const { data, isLoading } = useQuery({
    queryKey: ['job-search', trimmed],
    queryFn: () => jobService.search(trimmed),
    enabled: open && trimmed.length > 0,
  })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        if (open) setQuery('')
        setOpen(!open)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, setOpen])

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(timer)
  }, [open])

  const close = () => {
    setQuery('')
    setOpen(false)
  }

  const goToJob = (slug: string) => {
    setQuery('')
    setOpen(false)
    navigate(ROUTES.jobDetails(slug))
  }

  return (
    <Modal open={open} onClose={close} title="Search jobs" showClose={false} size="lg" className="overflow-hidden">
      <div className="-m-5">
        <div className="flex items-center gap-3 border-b border-border px-5">
          <Search className="size-5 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search jobs, companies, skills…"
            className="h-14 w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
          <kbd className="hidden rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground sm:block">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-3">
          {trimmed.length === 0 ? (
            <div>
              <p className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <TrendingUp className="size-3.5" />
                Popular searches
              </p>
              <div className="flex flex-wrap gap-2 px-3 pb-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : isLoading ? (
            <div className="space-y-2 p-3">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="h-14 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : data && data.length > 0 ? (
            <div>
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {data.length} result{data.length === 1 ? '' : 's'}
              </p>
              <div className="space-y-1">
                {data.map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => goToJob(job.slug)}
                    className="group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{job.title}</p>
                      <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                        <Building2 className="size-3.5 shrink-0" />
                        {job.company.name}
                        <span className="text-border">•</span>
                        <MapPin className="size-3.5 shrink-0" />
                        {job.location}
                      </p>
                    </div>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-3 py-10 text-center text-sm text-muted-foreground">
              No jobs found for “{trimmed}”. Try a different keyword.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-muted/50 px-5 py-2.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-border bg-card px-1.5 py-0.5">↑</kbd>
            <kbd className="rounded border border-border bg-card px-1.5 py-0.5">↓</kbd>
            to navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-border bg-card px-1.5 py-0.5">
              <CornerDownLeft className="size-3" />
            </kbd>
            to select
          </span>
        </div>
      </div>
    </Modal>
  )
}
