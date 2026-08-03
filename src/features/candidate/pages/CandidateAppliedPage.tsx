import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ExternalLink, Search, Undo2 } from 'lucide-react'
import { candidateService } from '../services/candidateService'
import { DataTable } from '../../admin/components/DataTable'
import type { DataTableColumn } from '../../admin/components/DataTable'
import { PageHeader } from '../../admin/components/PageHeader'
import { StatusBadge } from '../../admin/components/Table'
import { Avatar, Button, Input, Modal, Tabs } from '../../../components/ui'
import { timeAgo } from '../../../utils/format'
import { showToast } from '../../../lib/toast'
import type { CandidateApplication } from '../types'

const STATUS_ORDER = ['Pending', 'Reviewed', 'Interview', 'Hired', 'Rejected'] as const

export function CandidateAppliedPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [withdrawTarget, setWithdrawTarget] = useState<CandidateApplication | null>(null)
  const queryClient = useQueryClient()

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['candidate', 'applications'],
    queryFn: candidateService.getApplications,
  })

  const withdrawMutation = useMutation({
    mutationFn: (id: string) => candidateService.withdrawApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'applications'] })
      queryClient.invalidateQueries({ queryKey: ['candidate', 'overview'] })
      showToast.success('Application withdrawn')
      setWithdrawTarget(null)
    },
    onError: (error) => {
      showToast.error(error instanceof Error ? error.message : 'Could not withdraw the application.')
    },
  })

  const filtered = rows.filter((row) => statusFilter === 'all' || row.status === statusFilter)

  const columns: DataTableColumn<CandidateApplication>[] = [
    {
      key: 'job',
      header: 'Job',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.company} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{row.job}</p>
            <p className="truncate text-xs text-muted-foreground">{row.company}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'appliedAt',
      header: 'Applied',
      render: (row) => <span className="text-muted-foreground">{timeAgo(row.appliedAt)}</span>,
    },
    {
      key: 'resume',
      header: 'Resume',
      render: (row) =>
        row.resumeLink ? (
          <a
            href={row.resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:underline"
          >
            View
            <ExternalLink className="size-3.5" />
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'w-24',
      render: (row) => (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={row.status === 'Hired' || row.status === 'Rejected'}
          onClick={() => setWithdrawTarget(row)}
        >
          <Undo2 className="size-4" />
          Withdraw
        </Button>
      ),
    },
  ]

  const statusCounts: Record<string, number> = {
    all: rows.length,
    ...Object.fromEntries(
      STATUS_ORDER.map((status) => [
        status,
        rows.filter((row) => row.status === status).length,
      ]),
    ),
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <PageHeader
        eyebrow="Activity"
        title="Applied Jobs"
        description="Track the status of every job you have applied to."
        action={
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search applications…"
            leftIcon={<Search className="size-4" />}
            containerClassName="sm:w-72"
          />
        }
      />

      <Tabs
        value={statusFilter}
        onChange={setStatusFilter}
        items={[
          { value: 'all', label: 'All applications', badge: statusCounts.all },
          ...STATUS_ORDER.map((status) => ({
            value: status,
            label: status,
            badge: statusCounts[status],
          })),
        ]}
      />

      <div className="min-h-0 flex-1">
        <DataTable
          columns={columns}
          rows={filtered}
          keyField="id"
          searchValue={search}
          searchFields={['job', 'company']}
          pageSize={12}
          isLoading={isLoading}
          emptyTitle="No applications found"
          emptyDescription="Try adjusting your search or filters."
          fillHeight
        />
      </div>

      <Modal
        open={withdrawTarget !== null}
        onClose={() => setWithdrawTarget(null)}
        title="Withdraw application"
        description={`This will remove your application for ${withdrawTarget?.job ?? ''}. You can apply again later.`}
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setWithdrawTarget(null)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            isLoading={withdrawMutation.isPending}
            onClick={() => withdrawTarget && withdrawMutation.mutate(withdrawTarget.id)}
          >
            Withdraw application
          </Button>
        </div>
      </Modal>
    </div>
  )
}
