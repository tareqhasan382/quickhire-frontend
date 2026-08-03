import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, MoreHorizontal, Pencil, Search, Trash2 } from 'lucide-react'
import { recruiterService } from '../services/recruiterService'
import { DataTable } from '../../admin/components/DataTable'
import type { DataTableColumn } from '../../admin/components/DataTable'
import { PageHeader } from '../../admin/components/PageHeader'
import { StatusBadge } from '../../admin/components/Table'
import {
  Badge,
  Button,
  Dropdown,
  Input,
  Modal,
  Tabs,
  buttonStyles,
} from '../../../components/ui'
import { timeAgo } from '../../../utils/format'
import { showToast } from '../../../lib/toast'
import { dashboardPath } from '../../../constants/dashboardNav'
import type { RecruiterJob } from '../types'

const JOB_STATUSES = ['Active', 'Draft', 'Closed'] as const

export function RecruiterJobsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deletingJob, setDeletingJob] = useState<RecruiterJob | null>(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['recruiter', 'jobs'],
    queryFn: recruiterService.getMyJobs,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => recruiterService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'jobs'] })
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'overview'] })
      setDeletingJob(null)
      showToast.success('Job deleted', 'The job posting was removed.')
    },
    onError: (error) => {
      showToast.error(error instanceof Error ? error.message : 'Could not delete the job.')
    },
  })

  const filtered = rows.filter((row) => statusFilter === 'all' || row.status === statusFilter)

  const columns: DataTableColumn<RecruiterJob>[] = [
    {
      key: 'title',
      header: 'Job',
      render: (row) => (
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">{row.title}</p>
          {row.featured && (
            <Badge variant="warning" size="sm">
              Featured
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => <span className="text-muted-foreground">{row.category}</span>,
    },
    {
      key: 'employmentType',
      header: 'Type',
      render: (row) => <span className="text-muted-foreground">{row.employmentType}</span>,
    },
    {
      key: 'experienceLevel',
      header: 'Level',
      render: (row) => <span className="text-muted-foreground">{row.experienceLevel}</span>,
    },
    {
      key: 'applicants',
      header: 'Applicants',
      render: (row) => <span className="font-medium">{row.applicants}</span>,
    },
    {
      key: 'views',
      header: 'Views',
      render: (row) => (
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Eye className="size-3.5" />
          {row.views}
        </span>
      ),
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
              label: 'Edit job',
              icon: <Pencil className="size-4" />,
              onClick: () => navigate(`/dashboard/recruiter/post-job?edit=${row.id}`),
            },
            {
              label: 'Delete job',
              icon: <Trash2 className="size-4" />,
              danger: true,
              onClick: () => setDeletingJob(row),
            },
          ]}
        />
      ),
    },
  ]

  const statusCounts: Record<string, number> = {
    all: rows.length,
    Active: rows.filter((row) => row.status === 'Active').length,
    Draft: rows.filter((row) => row.status === 'Draft').length,
    Closed: rows.filter((row) => row.status === 'Closed').length,
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <PageHeader
        eyebrow="Jobs"
        title="My jobs"
        description="Manage every job posting your company has published."
        action={
          <div className="flex items-center gap-3">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search jobs…"
              leftIcon={<Search className="size-4" />}
              containerClassName="sm:w-64"
            />
            <Link
              to={dashboardPath('recruiter', 'post-job')}
              className={buttonStyles({ variant: 'primary', size: 'md' })}
            >
              Post a job
            </Link>
          </div>
        }
      />

      <Tabs
        value={statusFilter}
        onChange={setStatusFilter}
        items={[
          { value: 'all', label: 'All jobs', badge: statusCounts.all },
          ...JOB_STATUSES.map((status) => ({
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
          searchFields={['title', 'category', 'company']}
          pageSize={12}
          isLoading={isLoading}
          emptyTitle="No jobs found"
          emptyDescription="Try adjusting your search or filters."
          fillHeight
        />
      </div>

      <Modal
        open={deletingJob !== null}
        onClose={() => setDeletingJob(null)}
        title="Delete job"
        description={`“${deletingJob?.title}” will be permanently removed. This action cannot be undone.`}
        size="sm"
      >
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeletingJob(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            isLoading={deleteMutation.isPending}
            onClick={() => deletingJob && deleteMutation.mutate(deletingJob.id)}
          >
            Delete job
          </Button>
        </div>
      </Modal>
    </div>
  )
}
