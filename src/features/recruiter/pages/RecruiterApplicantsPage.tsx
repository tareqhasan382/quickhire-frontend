import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CheckCircle2,
  ExternalLink,
  Eye,
  Handshake,
  MoreHorizontal,
  Search,
  XCircle,
} from 'lucide-react'
import { recruiterService } from '../services/recruiterService'
import { DataTable } from '../../admin/components/DataTable'
import type { DataTableColumn } from '../../admin/components/DataTable'
import { PageHeader } from '../../admin/components/PageHeader'
import { StatusBadge } from '../../admin/components/Table'
import { Avatar, Dropdown, Input, Rating, Tabs } from '../../../components/ui'
import { timeAgo } from '../../../utils/format'
import { showToast } from '../../../lib/toast'
import type { ApplicationStatus, RecruiterApplication } from '../types'

const NEXT_STAGES: Record<ApplicationStatus, ApplicationStatus[]> = {
  Pending: ['Reviewed', 'Rejected'],
  Reviewed: ['Interview', 'Rejected'],
  Interview: ['Hired', 'Rejected'],
  Hired: [],
  Rejected: [],
}

const STATUS_ORDER = ['Pending', 'Reviewed', 'Interview', 'Hired', 'Rejected'] as const

export function RecruiterApplicantsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const queryClient = useQueryClient()

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['recruiter', 'applications'],
    queryFn: recruiterService.getApplications,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      recruiterService.updateApplicationStatus(id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'applications'] })
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'overview'] })
      showToast.success(`Marked as ${variables.status}`)
    },
    onError: (error) => {
      showToast.error(error instanceof Error ? error.message : 'Could not update the application.')
    },
  })

  const filtered = rows.filter((row) => statusFilter === 'all' || row.status === statusFilter)

  const columns: DataTableColumn<RecruiterApplication>[] = [
    {
      key: 'applicant',
      header: 'Applicant',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.applicant} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{row.applicant}</p>
            <p className="truncate text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'job',
      header: 'Job',
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-foreground">{row.job}</p>
          <p className="text-xs text-muted-foreground">{row.company}</p>
        </div>
      ),
    },
    {
      key: 'appliedAt',
      header: 'Applied',
      render: (row) => <span className="text-muted-foreground">{timeAgo(row.appliedAt)}</span>,
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (row) => (
        <span className="flex items-center gap-1.5">
          <Rating value={row.rating} size="size-3.5" />
          <span className="text-xs text-muted-foreground">{row.rating}</span>
        </span>
      ),
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
      headerClassName: 'w-12',
      render: (row) => {
        const next = NEXT_STAGES[row.status]
        if (next.length === 0) return null
        return (
          <Dropdown
            trigger={
              <span className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <MoreHorizontal className="size-4" />
              </span>
            }
            items={[
              ...next.map((stage) => ({
                label: `Mark as ${stage.toLowerCase()}`,
                icon:
                  stage === 'Hired' ? (
                    <Handshake className="size-4" />
                  ) : stage === 'Rejected' ? (
                    <XCircle className="size-4" />
                  ) : stage === 'Reviewed' ? (
                    <Eye className="size-4" />
                  ) : (
                    <CheckCircle2 className="size-4" />
                  ),
                danger: stage === 'Rejected',
                onClick: () => updateMutation.mutate({ id: row.id, status: stage }),
              })),
            ]}
          />
        )
      },
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
        eyebrow="Hiring"
        title="Applicants"
        description="Review and manage applications across all of your job postings."
        action={
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search applicants…"
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
          searchFields={['applicant', 'email', 'job', 'company']}
          pageSize={12}
          isLoading={isLoading}
          emptyTitle="No applications found"
          emptyDescription="Try adjusting your search or filters."
          fillHeight
        />
      </div>
    </div>
  )
}
