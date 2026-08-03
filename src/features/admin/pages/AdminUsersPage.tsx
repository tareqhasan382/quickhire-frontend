import { useState } from 'react'
import { MoreHorizontal, Search, UserRoundX, UserRoundCheck } from 'lucide-react'
import { adminUsers } from '../data'
import { DataTable } from '../components/DataTable'
import type { DataTableColumn } from '../components/DataTable'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/Table'
import { Avatar, Badge, Dropdown, Input, Tabs } from '../../../components/ui'
import type { BadgeProps } from '../../../components/ui'
import { timeAgo } from '../../../utils/format'
import { showToast } from '../../../lib/toast'
import type { AdminUser } from '../types'

const ROLE_TONES: Record<AdminUser['role'], BadgeProps['variant']> = {
  candidate: 'secondary',
  recruiter: 'primary',
  admin: 'warning',
}

export function AdminUsersPage() {
  const [rows, setRows] = useState<AdminUser[]>(adminUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filtered = rows.filter((row) => roleFilter === 'all' || row.role === roleFilter)

  const columns: DataTableColumn<AdminUser>[] = [
    {
      key: 'user',
      header: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{row.name}</p>
            <p className="truncate text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <Badge variant={ROLE_TONES[row.role]} size="sm" className="capitalize">
          {row.role}
        </Badge>
      ),
    },
    { key: 'location', header: 'Location', render: (row) => <span className="text-muted-foreground">{row.location}</span> },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'applications',
      header: 'Applications',
      render: (row) => <span className="font-medium">{row.applications}</span>,
    },
    {
      key: 'joinedAt',
      header: 'Joined',
      render: (row) => <span className="text-muted-foreground">{timeAgo(row.joinedAt)}</span>,
    },
    {
      key: 'lastActive',
      header: 'Last active',
      render: (row) => <span className="text-muted-foreground">{timeAgo(row.lastActive)}</span>,
    },
    {
      key: 'actions',
      header: '',
      headerClassName: 'w-12',
      render: (row) => {
        const suspended = row.status === 'Suspended'
        return (
          <Dropdown
            trigger={
              <span className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <MoreHorizontal className="size-4" />
              </span>
            }
            items={[
              {
                label: suspended ? 'Reactivate account' : 'Suspend account',
                icon: suspended ? <UserRoundCheck className="size-4" /> : <UserRoundX className="size-4" />,
                onClick: () => {
                  setRows((current) =>
                    current.map((item) =>
                      item.id === row.id
                        ? { ...item, status: suspended ? 'Active' : 'Suspended' }
                        : item,
                    ),
                  )
                  showToast.success(
                    suspended ? 'Account reactivated' : 'Account suspended',
                    `${row.name} is now ${suspended ? 'active' : 'suspended'}.`,
                  )
                },
              },
              {
                label: 'Delete user',
                icon: <UserRoundX className="size-4" />,
                danger: true,
                onClick: () => {
                  setRows((current) => current.filter((item) => item.id !== row.id))
                  showToast.error('User deleted', `${row.name} was removed from the platform.`)
                },
              },
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
        title="Users"
        description="Manage every candidate, recruiter and admin account on the platform."
        action={
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email…"
            leftIcon={<Search className="size-4" />}
            containerClassName="sm:w-72"
          />
        }
      />

      <Tabs
        value={roleFilter}
        onChange={setRoleFilter}
        items={[
          { value: 'all', label: 'All users', badge: rows.length },
          { value: 'candidate', label: 'Candidates' },
          { value: 'recruiter', label: 'Recruiters' },
          { value: 'admin', label: 'Admins' },
        ]}
      />

      <div className="min-h-0 flex-1">
        <DataTable
          columns={columns}
          rows={filtered}
          keyField="id"
          searchValue={search}
          searchFields={['name', 'email', 'location']}
          pageSize={12}
          fillHeight
        />
      </div>
    </div>
  )
}
