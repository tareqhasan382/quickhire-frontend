import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { candidateService } from '../services/candidateService'
import { PageHeader } from '../../admin/components/PageHeader'
import { Skeleton } from '../../../components/ui'
import { SimpleSectionForm } from '../components/SimpleSectionForm'
import { showToast } from '../../../lib/toast'

export function CandidatePortfolioPage() {
  const queryClient = useQueryClient()

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['candidate', 'profile'],
    queryFn: candidateService.getProfile,
  })

  const formValues = useMemo(
    () => ({ portfolioLink: profile?.portfolioLink ?? '' }),
    [profile],
  )

  const saveMutation = useMutation({
    mutationFn: (values: Record<string, string>) =>
      candidateService.updateProfile({ portfolio_link: values.portfolioLink }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'profile'] })
      showToast.success('Portfolio updated')
    },
    onError: (error) => {
      showToast.error(error instanceof Error ? error.message : 'Could not save your portfolio link.')
    },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Career"
        title="Portfolio"
        description="Share your work — a website, GitHub or Behance profile."
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
              key: 'portfolioLink',
              label: 'Portfolio link',
              type: 'url',
              placeholder: 'https://github.com/username',
              hint: 'A link to your portfolio, GitHub or personal site.',
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
