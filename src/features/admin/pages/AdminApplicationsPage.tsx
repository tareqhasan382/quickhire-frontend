import { useState } from 'react'
import { CheckCircle2, Eye, Handshake, MoreHorizontal, Search, XCircle } from 'lucide-react'
import { adminApplications } from '../data'
import { DataTable } from '../components/DataTable'
import type { DataTableColumn } from '../components/DataTable'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/Table'
import { Avatar, Dropdown, Input, Rating, Tabs } from '../../../components/ui'
import { timeAgo } from '../../../utils/format'
import { showToast } from '../../../lib/toast'
import type { AdminApplication, ApplicationStatus } from '../types'

const NEXT_STAGES: Record<ApplicationStatus, ApplicationStatus[]> = {
  Pending: ['Reviewed', 'Rejected'],
  Reviewed: ['Interview', 'Rejected'],
  Interview: ['Hired', 'Rejected'],
  Hired: [],
  Rejected: [],
}

export function AdminApplicationsPage() {
  const [rows, setRows] = useState<AdminApplication[]>(adminApplications)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = rows.filter((row) => statusFilter === 'all' || row.status === statusFilter)

  const moveTo = (row: AdminApplication, status: ApplicationStatus) => {
    setRows((current) =>
      current.map((item) => (item.id === row.id ? { ...item, status } : item)),
    )
    showToast.success(`Marked as ${status}`, `${row.applicant}'s application for “${row.job}”.`)
  }

  const columns: DataTableColumn<AdminApplication>[] = [
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
                onClick: () => moveTo(row, stage),
              })),
            ]}
          />
        )
      },
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <PageHeader
        eyebrow="Manage"
        title="Applications"
        description="Track applications across every job and company, and advance them through the hiring pipeline."
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
          { value: 'all', label: 'All applications', badge: rows.length },
          { value: 'Pending', label: 'Pending' },
          { value: 'Reviewed', label: 'Reviewed' },
          { value: 'Interview', label: 'Interview' },
          { value: 'Hired', label: 'Hired' },
          { value: 'Rejected', label: 'Rejected' },
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
          fillHeight
        />
      </div>
    </div>
  )
}
