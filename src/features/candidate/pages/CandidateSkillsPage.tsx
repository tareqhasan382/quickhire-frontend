import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { candidateService } from '../services/candidateService'
import { PageHeader } from '../../admin/components/PageHeader'
import { Skeleton } from '../../../components/ui'
import { SimpleSectionForm } from '../components/SimpleSectionForm'
import { showToast } from '../../../lib/toast'

const toCsv = (values: string[]) => values.join(', ')

const splitCsv = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

export function CandidateSkillsPage() {
  const queryClient = useQueryClient()

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['candidate', 'profile'],
    queryFn: candidateService.getProfile,
  })

  const formValues = useMemo(
    () => ({
      skills: profile ? toCsv(profile.skills) : '',
      languages: profile ? toCsv(profile.languages) : '',
    }),
    [profile],
  )

  const saveMutation = useMutation({
    mutationFn: (values: Record<string, string>) =>
      candidateService.updateProfile({
        skills: splitCsv(values.skills),
        languages: splitCsv(values.languages),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'profile'] })
      showToast.success('Skills updated')
    },
    onError: (error) => {
      showToast.error(error instanceof Error ? error.message : 'Could not save your skills.')
    },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Career"
        title="Skills"
        description="List the skills and languages you bring to the table."
      />

      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
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
              key: 'skills',
              label: 'Skills',
              placeholder: 'React, TypeScript, Node.js',
              hint: 'Comma separated',
            },
            {
              key: 'languages',
              label: 'Languages',
              placeholder: 'English, Spanish',
              hint: 'Comma separated',
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
