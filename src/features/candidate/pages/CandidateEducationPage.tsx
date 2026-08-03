import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { candidateService } from '../services/candidateService'
import { PageHeader } from '../../admin/components/PageHeader'
import { Skeleton } from '../../../components/ui'
import { ListEditor } from '../components/ListEditor'
import type { ListField, ListItem } from '../components/ListEditor'
import { showToast } from '../../../lib/toast'
import type { Education } from '../types'

const EDUCATION_FIELDS: ListField[] = [
  { key: 'school', label: 'School / University', placeholder: 'University of California, Berkeley' },
  { key: 'degree', label: 'Degree', placeholder: 'BSc', optional: true },
  { key: 'field', label: 'Field of study', placeholder: 'Computer Science', optional: true },
  { key: 'startDate', label: 'Start date', type: 'date', optional: true },
  { key: 'endDate', label: 'End date', type: 'date', optional: true },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Achievements, coursework or notes…',
    optional: true,
  },
]

export function CandidateEducationPage() {
  const queryClient = useQueryClient()

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['candidate', 'profile'],
    queryFn: candidateService.getProfile,
  })

  const saveMutation = useMutation({
    mutationFn: (items: ListItem[]) =>
      candidateService.updateProfile({
        education: items as unknown as Education[],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'profile'] })
      showToast.success('Education updated')
    },
    onError: (error) => {
      showToast.error(error instanceof Error ? error.message : 'Could not save your education.')
    },
  })

  const items: ListItem[] = (profile?.education ?? []).map((item) => ({ ...item }))

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Career"
        title="Education"
        description="Your academic background and qualifications."
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
          fields={EDUCATION_FIELDS}
          entityLabel="education"
          emptyTitle="No education added yet"
          emptyDescription="Add your degree or certification to strengthen your profile."
          onChange={(next) => saveMutation.mutate(next)}
        />
      )}
    </div>
  )
}
