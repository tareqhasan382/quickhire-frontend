import { useState } from 'react'
import { BadgeCheck, Ban, MoreHorizontal, Search, ShieldCheck } from 'lucide-react'
import { adminCompanies } from '../data'
import { DataTable } from '../components/DataTable'
import type { DataTableColumn } from '../components/DataTable'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/Table'
import { Avatar, Dropdown, Input, Rating, Tabs } from '../../../components/ui'
import { showToast } from '../../../lib/toast'
import type { AdminCompany } from '../types'

export function AdminCompaniesPage() {
  const [rows, setRows] = useState<AdminCompany[]>(adminCompanies)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = rows.filter((row) => statusFilter === 'all' || row.status === statusFilter)

  const columns: DataTableColumn<AdminCompany>[] = [
    {
      key: 'company',
      header: 'Company',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              {row.name}
              {row.verified && <BadgeCheck className="size-4 text-primary" />}
            </p>
            <p className="text-xs text-muted-foreground">{row.industry}</p>
          </div>
        </div>
      ),
    },
    { key: 'location', header: 'Location', render: (row) => <span className="text-muted-foreground">{row.location}</span> },
    { key: 'size', header: 'Size', render: (row) => <span className="text-muted-foreground">{row.size}</span> },
    { key: 'plan', header: 'Plan', render: (row) => <StatusBadge status={row.plan} /> },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'openPositions',
      header: 'Open roles',
      render: (row) => <span className="font-medium">{row.openPositions}</span>,
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
                label: row.verified ? 'Revoke verification' : 'Verify company',
                icon: <ShieldCheck className="size-4" />,
                onClick: () => {
                  setRows((current) =>
                    current.map((item) => (item.id === row.id ? { ...item, verified: !item.verified } : item)),
                  )
                  showToast.success(
                    row.verified ? 'Verification revoked' : 'Company verified',
                    `${row.name} is now ${row.verified ? 'unverified' : 'verified'}.`,
                  )
                },
              },
              {
                label: suspended ? 'Reactivate company' : 'Suspend company',
                icon: <Ban className="size-4" />,
                danger: !suspended,
                onClick: () => {
                  setRows((current) =>
                    current.map((item) =>
                      item.id === row.id ? { ...item, status: suspended ? 'Active' : 'Suspended' } : item,
                    ),
                  )
                  showToast.success(
                    suspended ? 'Company reactivated' : 'Company suspended',
                    `${row.name} is now ${suspended ? 'active' : 'suspended'}.`,
                  )
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
        title="Companies"
        description="Review, verify and moderate every company registered on the platform."
        action={
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search companies…"
            leftIcon={<Search className="size-4" />}
            containerClassName="sm:w-72"
          />
        }
      />

      <Tabs
        value={statusFilter}
        onChange={setStatusFilter}
        items={[
          { value: 'all', label: 'All companies', badge: rows.length },
          { value: 'Active', label: 'Active' },
          { value: 'Pending', label: 'Pending' },
          { value: 'Suspended', label: 'Suspended' },
        ]}
      />

      <div className="min-h-0 flex-1">
        <DataTable
          columns={columns}
          rows={filtered}
          keyField="id"
          searchValue={search}
          searchFields={['name', 'industry', 'location']}
          pageSize={12}
          fillHeight
        />
      </div>
    </div>
  )
}
