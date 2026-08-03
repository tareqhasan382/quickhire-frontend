import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { SearchX } from 'lucide-react'
import { EmptyState, Pagination, Skeleton } from '../../../components/ui'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from './Table'
import { cn } from '../../../lib/utils'

export interface DataTableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
  headerClassName?: string
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  keyField: keyof T
  searchValue?: string
  searchFields?: (keyof T)[]
  pageSize?: number
  fillHeight?: boolean
  isLoading?: boolean
  skeletonRows?: number
  emptyTitle?: string
  emptyDescription?: string
}

export function DataTable<T>({
  columns,
  rows,
  keyField,
  searchValue = '',
  searchFields = [],
  pageSize = 12,
  fillHeight = false,
  isLoading = false,
  skeletonRows = 12,
  emptyTitle = 'No results found',
  emptyDescription = 'Try adjusting your search or filters.',
}: DataTableProps<T>) {
  const [page, setPage] = useState(1)

  const shellClassName = cn(
    'overflow-hidden rounded-2xl border border-border bg-card shadow-soft',
    fillHeight && 'flex h-full min-h-0 flex-col',
  )
  const scrollClassName = cn(
    'overflow-auto',
    fillHeight ? 'min-h-0 flex-1' : 'min-h-[320px] max-h-[520px]',
  )

  const filtered = useMemo(() => {
    const term = searchValue.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((row) =>
      searchFields.some((field) => String(row[field] ?? '').toLowerCase().includes(term)),
    )
  }, [rows, searchValue, searchFields])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  if (isLoading) {
    return (
      <div className={shellClassName}>
        <div className={scrollClassName}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: skeletonRows }, (_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-border">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3">
                      <Skeleton className="h-4 w-full max-w-44" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="size-7" />}
        title={emptyTitle}
        description={emptyDescription}
      />
    )
  }

  const from = (safePage - 1) * pageSize + 1
  const to = Math.min(safePage * pageSize, filtered.length)

  return (
    <div className={shellClassName}>
      <div className={scrollClassName}>
        <Table>
          <TableHead className="sticky top-0 z-10 bg-card">
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHeaderCell key={column.key} className={column.headerClassName}>
                  {column.header}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map((row) => (
              <TableRow key={String(row[keyField])}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex shrink-0 flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{from}</span>–
          <span className="font-medium text-foreground">{to}</span> of{' '}
          <span className="font-medium text-foreground">{filtered.length}</span>
        </p>
        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  )
}
