import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { candidateService } from '../services/candidateService'
import { PageHeader } from '../../admin/components/PageHeader'
import { Skeleton } from '../../../components/ui'
import { ListEditor } from '../components/ListEditor'
import type { ListField, ListItem } from '../components/ListEditor'
import { showToast } from '../../../lib/toast'
import type { WorkExperience } from '../types'

const EXPERIENCE_FIELDS: ListField[] = [
  { key: 'title', label: 'Job title', placeholder: 'Frontend Developer' },
  { key: 'company', label: 'Company', placeholder: 'Acme Inc.' },
  { key: 'location', label: 'Location', placeholder: 'San Francisco', optional: true },
  { key: 'startDate', label: 'Start date', type: 'date', optional: true },
  { key: 'endDate', label: 'End date', type: 'date', optional: true },
  { key: 'current', label: 'I currently work here', type: 'checkbox', optional: true },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'What did you do in this role?',
    optional: true,
  },
]

export function CandidateExperiencePage() {
  const queryClient = useQueryClient()

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['candidate', 'profile'],
    queryFn: candidateService.getProfile,
  })

  const saveMutation = useMutation({
    mutationFn: (items: ListItem[]) =>
      candidateService.updateProfile({
        workExperience: items as unknown as WorkExperience[],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'profile'] })
      showToast.success('Work experience updated')
    },
    onError: (error) => {
      showToast.error(error instanceof Error ? error.message : 'Could not save your work experience.')
    },
  })

  const items: ListItem[] = (profile?.workExperience ?? []).map((item) => ({ ...item }))

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Career"
        title="Work Experience"
        description="Your professional history helps recruiters understand your background."
      />

      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-6">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="mt-3 h-12 w-full rounded-xl" />
          <Skeleton className="mt-4 h-10 w-32" />
        </div>
      ) : isError || !profile ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">
          We could not load your profile. Please refresh the page.
        </div>
      ) : (
        <ListEditor
          items={items}
          fields={EXPERIENCE_FIELDS}
          entityLabel="experience"
          emptyTitle="No work experience yet"
          emptyDescription="Add a job to showcase your professional background."
          onChange={(next) => saveMutation.mutate(next)}
        />
      )}
    </div>
  )
}
