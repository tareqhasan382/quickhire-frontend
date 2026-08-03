import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { candidateService } from '../services/candidateService'
import { PageHeader } from '../../admin/components/PageHeader'
import { Skeleton } from '../../../components/ui'
import { SimpleSectionForm } from '../components/SimpleSectionForm'
import { showToast } from '../../../lib/toast'

export function CandidateResumePage() {
  const queryClient = useQueryClient()

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['candidate', 'profile'],
    queryFn: candidateService.getProfile,
  })

  const formValues = useMemo(
    () => ({ resumeLink: profile?.resumeLink ?? '' }),
    [profile],
  )

  const saveMutation = useMutation({
    mutationFn: (values: Record<string, string>) =>
      candidateService.updateProfile({ resume_link: values.resumeLink }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'profile'] })
      showToast.success('Resume updated')
    },
    onError: (error) => {
      showToast.error(error instanceof Error ? error.message : 'Could not save your resume link.')
    },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Career"
        title="Resume"
        description="Add a public link to your latest resume."
      />

      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-6">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="mt-4 h-10 w-32" />
        </div>
      ) : isError || !profile ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">
          We could not load your profile. Please refresh the page.
        </div>
      ) : (
        <SimpleSectionForm
          fields={[
            {
              key: 'resumeLink',
              label: 'Resume link',
              type: 'url',
              placeholder: 'https://example.com/resume.pdf',
              hint: 'Share a Google Drive, Dropbox or hosted PDF link.',
            },
          ]}
          values={formValues}
          isSaving={saveMutation.isPending}
          onSave={(values) => saveMutation.mutate(values)}
        />
      )}
    </div>
  )
}
