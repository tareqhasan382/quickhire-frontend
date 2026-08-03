import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AppliedJob {
  jobId: string
  appliedAt: string
}

interface AppliedJobsState {
  appliedJobs: AppliedJob[]
  applyToJob: (jobId: string) => void
  hasApplied: (jobId: string) => boolean
}

export const useAppliedJobsStore = create<AppliedJobsState>()(
  persist(
    (set, get) => ({
      appliedJobs: [],
      applyToJob: (jobId) =>
        set((state) =>
          state.appliedJobs.some((item) => item.jobId === jobId)
            ? state
            : {
                appliedJobs: [...state.appliedJobs, { jobId, appliedAt: new Date().toISOString() }],
              },
        ),
      hasApplied: (jobId) => get().appliedJobs.some((item) => item.jobId === jobId),
    }),
    { name: 'quickhire-applied-jobs' },
  ),
)
