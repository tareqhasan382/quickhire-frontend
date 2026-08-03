import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { candidateService } from '../services/candidateService'
import { PageHeader } from '../../admin/components/PageHeader'
import { Skeleton } from '../../../components/ui'
import { ListEditor } from '../components/ListEditor'
import type { ListField, ListItem } from '../components/ListEditor'
import { showToast } from '../../../lib/toast'
import type { Certificate } from '../types'

const CERTIFICATE_FIELDS: ListField[] = [
  { key: 'name', label: 'Certificate name', placeholder: 'AWS Certified Developer' },
  { key: 'issuer', label: 'Issuer', placeholder: 'Amazon Web Services', optional: true },
  { key: 'year', label: 'Year', placeholder: '2023', optional: true },
  {
    key: 'url',
    label: 'Credential URL',
    type: 'text',
    placeholder: 'https://credentials.aws.com/…',
    optional: true,
  },
]

export function CandidateCertificatesPage() {
  const queryClient = useQueryClient()

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['candidate', 'profile'],
    queryFn: candidateService.getProfile,
  })

  const saveMutation = useMutation({
    mutationFn: (items: ListItem[]) =>
      candidateService.updateProfile({
        certificates: items as unknown as Certificate[],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'profile'] })
      showToast.success('Certificates updated')
    },
    onError: (error) => {
      showToast.error(error instanceof Error ? error.message : 'Could not save your certificates.')
    },
  })

  const items: ListItem[] = (profile?.certificates ?? []).map((item) => ({ ...item }))

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Career"
        title="Certificates"
        description="Show the certifications that back up your skills."
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
          fields={CERTIFICATE_FIELDS}
          entityLabel="certificate"
          emptyTitle="No certificates yet"
          emptyDescription="Add a certificate or credential to back up your skills."
          onChange={(next) => saveMutation.mutate(next)}
        />
      )}
    </div>
  )
}
