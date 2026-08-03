import { useQuery } from '@tanstack/react-query'
import { jobService } from '../../../services/jobService'
import type { JobFilters } from '../../../types'

export function useJobsQuery(filters: JobFilters, page: number, pageSize = 9) {
  return useQuery({
    queryKey: ['jobs', 'search', filters, page, pageSize],
    queryFn: () => jobService.searchJobs(filters, page, pageSize),
    placeholderData: (previous) => previous,
  })
}
