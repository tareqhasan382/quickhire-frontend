import { useState } from 'react'
import { MoreHorizontal, Search, Star } from 'lucide-react'
import { adminJobs } from '../data'
import { DataTable } from '../components/DataTable'
import type { DataTableColumn } from '../components/DataTable'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/Table'
import { Badge, Dropdown, Input, Tabs } from '../../../components/ui'
import { formatNumber, timeAgo } from '../../../utils/format'
import { showToast } from '../../../lib/toast'
import type { AdminJob } from '../types'

export function AdminJobsPage() {
  const [rows, setRows] = useState<AdminJob[]>(adminJobs)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = rows.filter((row) => statusFilter === 'all' || row.status === statusFilter)

  const columns: DataTableColumn<AdminJob>[] = [
    {
      key: 'title',
      header: 'Job',
      render: (row) => (
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            {row.title}
            {row.featured && <Badge variant="primary" size="sm">Featured</Badge>}
          </p>
          <p className="text-xs text-muted-foreground">{row.company}</p>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (row) => <span className="text-muted-foreground">{row.category}</span> },
    { key: 'employmentType', header: 'Type', render: (row) => <span className="text-muted-foreground">{row.employmentType}</span> },
    { key: 'experienceLevel', header: 'Level', render: (row) => <span className="text-muted-foreground">{row.experienceLevel}</span> },
    {
      key: 'applicants',
      header: 'Applicants',
      render: (row) => <span className="font-medium">{formatNumber(row.applicants)}</span>,
    },
    {
      key: 'views',
      header: 'Views',
      render: (row) => <span className="text-muted-foreground">{formatNumber(row.views)}</span>,
    },
    {
      key: 'postedAt',
      header: 'Posted',
      render: (row) => <span className="text-muted-foreground">{timeAgo(row.postedAt)}</span>,
    },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'w-12',
      render: (row) => (
        <Dropdown
          trigger={
            <span className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <MoreHorizontal className="size-4" />
            </span>
          }
          items={[
            {
              label: row.featured ? 'Remove from featured' : 'Feature job',
              icon: <Star className="size-4" />,
              onClick: () => {
                setRows((current) =>
                  current.map((item) => (item.id === row.id ? { ...item, featured: !item.featured } : item)),
                )
                showToast.success(
                  row.featured ? 'Removed from featured' : 'Job featured',
                  `“${row.title}” ${row.featured ? 'is no longer' : 'is now'} featured.`,
                )
              },
            },
            {
              label: row.status === 'Closed' ? 'Reopen job' : 'Close job',
              onClick: () => {
                setRows((current) =>
                  current.map((item) =>
                    item.id === row.id ? { ...item, status: item.status === 'Closed' ? 'Active' : 'Closed' } : item,
                  ),
                )
                showToast.success(
                  row.status === 'Closed' ? 'Job reopened' : 'Job closed',
                  `“${row.title}” is now ${row.status === 'Closed' ? 'active' : 'closed'}.`,
                )
              },
            },
          ]}
        />
      ),
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <PageHeader
        eyebrow="Manage"
        title="Jobs"
        description="Monitor every job listing, feature the best roles and moderate content."
        action={
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search jobs…"
            leftIcon={<Search className="size-4" />}
            containerClassName="sm:w-72"
          />
        }
      />

      <Tabs
        value={statusFilter}
        onChange={setStatusFilter}
        items={[
          { value: 'all', label: 'All jobs', badge: rows.length },
          { value: 'Active', label: 'Active' },
          { value: 'Closed', label: 'Closed' },
          { value: 'Draft', label: 'Draft' },
        ]}
      />

      <div className="min-h-0 flex-1">
        <DataTable
          columns={columns}
          rows={filtered}
          keyField="id"
          searchValue={search}
          searchFields={['title', 'company', 'category']}
          pageSize={12}
          fillHeight
        />
      </div>
    </div>
  )
}
