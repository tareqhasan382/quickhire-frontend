import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { slugify } from '../services/mappers'

interface SavedJob {
  id: string
  slug: string
}

interface SavedJobsState {
  saved: SavedJob[]
  toggleSave: (jobId: string, slug?: string) => void
  isSaved: (jobId: string) => boolean
  isSavedBySlug: (slug: string) => boolean
}

export const useSavedJobsStore = create<SavedJobsState>()(
  persist(
    (set, get) => ({
      saved: [],
      toggleSave: (jobId, slug) =>
        set((state) => {
          const exists = state.saved.some((item) => item.id === jobId)
          const next = exists
            ? state.saved.filter((item) => item.id !== jobId)
            : [...state.saved, { id: jobId, slug: slug ?? slugify(jobId) }]
          return { saved: next }
        }),
      isSaved: (jobId) => get().saved.some((item) => item.id === jobId),
      isSavedBySlug: (slug) => get().saved.some((item) => item.slug === slug),
    }),
    { name: 'quickhire-saved-jobs' },
  ),
)
