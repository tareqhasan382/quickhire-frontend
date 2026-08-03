import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button, Checkbox, EmptyState, Input, Modal, Textarea } from '../../../components/ui'

export interface ListField {
  key: string
  label: string
  placeholder?: string
  type?: 'text' | 'date' | 'textarea' | 'checkbox'
  optional?: boolean
}

export type ListItem = Record<string, string | boolean | undefined>

interface ListEditorProps {
  items: ListItem[]
  fields: ListField[]
  entityLabel: string
  emptyTitle?: string
  emptyDescription?: string
  onChange: (items: ListItem[]) => void
}

type Draft = Record<string, string | boolean>

function buildDraft(fields: ListField[]): Draft {
  const draft: Draft = {}
  for (const field of fields) {
    draft[field.key] = field.type === 'checkbox' ? false : ''
  }
  return draft
}

export function ListEditor({
  items,
  fields,
  entityLabel,
  emptyTitle,
  emptyDescription,
  onChange,
}: ListEditorProps) {
  const [open, setOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number>(-1)
  const [draft, setDraft] = useState<Draft>(buildDraft(fields))
  const [error, setError] = useState('')

  const titleFields = fields.filter((field) => field.type !== 'checkbox')

  const startAdd = () => {
    setEditingIndex(-1)
    setDraft(buildDraft(fields))
    setError('')
    setOpen(true)
  }

  const startEdit = (index: number) => {
    const item = items[index]
    setEditingIndex(index)
    const next = buildDraft(fields)
    for (const field of fields) {
      const value = item[field.key]
      next[field.key] =
        typeof value === 'boolean' ? value : typeof value === 'string' ? value : ''
    }
    setDraft(next)
    setError('')
    setOpen(true)
  }

  const save = () => {
    for (const field of fields) {
      if (field.type !== 'checkbox' && !field.optional && !String(draft[field.key] ?? '').trim()) {
        setError(`${field.label} is required.`)
        return
      }
    }

    const item: ListItem = {}
    for (const field of fields) {
      const value = draft[field.key]
      if (field.type === 'checkbox') {
        item[field.key] = Boolean(value)
      } else if (field.type === 'textarea') {
        const text = String(value ?? '').trim()
        if (text) item[field.key] = text
      } else {
        const text = String(value ?? '').trim()
        if (text) item[field.key] = text
      }
    }

    if (editingIndex === -1) {
      onChange([...items, item])
    } else {
      onChange(items.map((current, index) => (index === editingIndex ? item : current)))
    }
    setOpen(false)
  }

  const remove = (index: number) => {
    onChange(items.filter((_, current) => current !== index))
  }

  const primary = titleFields[0]?.key
  const secondary = titleFields[1]?.key

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
          <EmptyState
            title={emptyTitle ?? `No ${entityLabel.toLowerCase()} added yet`}
            description={emptyDescription ?? `Add your first ${entityLabel.toLowerCase()} to get started.`}
          />
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
          {items.map((item, index) => {
            const title = primary ? String(item[primary] ?? '') : ''
            const subtitle = secondary ? String(item[secondary] ?? '') : ''
            const flagKey = fields.find((field) => field.type === 'checkbox')?.key
            return (
              <li key={index} className="flex items-center gap-3 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{title}</p>
                    {flagKey && item[flagKey] && (
                      <span className="rounded-md bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">
                        Current
                      </span>
                    )}
                  </div>
                  {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => startEdit(index)}
                  aria-label={`Edit ${entityLabel.toLowerCase()}`}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={`Delete ${entityLabel.toLowerCase()}`}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div>
        <Button type="button" variant="outline" onClick={startAdd}>
          <Plus className="size-4" />
          Add {entityLabel.toLowerCase()}
        </Button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingIndex === -1 ? `Add ${entityLabel.toLowerCase()}` : `Edit ${entityLabel.toLowerCase()}`}
        size="lg"
      >
        <div className="space-y-4">
          {fields.map((field) => {
            const value = draft[field.key]
            if (field.type === 'checkbox') {
              return (
                <Checkbox
                  key={field.key}
                  label={field.label}
                  checked={Boolean(value)}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, [field.key]: event.target.checked }))
                  }
                />
              )
            }
            if (field.type === 'textarea') {
              return (
                <Textarea
                  key={field.key}
                  label={field.label}
                  placeholder={field.placeholder}
                  rows={3}
                  value={String(value ?? '')}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, [field.key]: event.target.value }))
                  }
                />
              )
            }
            return (
              <Input
                key={field.key}
                label={field.label}
                type={field.type === 'date' ? 'month' : 'text'}
                placeholder={field.placeholder}
                value={String(value ?? '')}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, [field.key]: event.target.value }))
                }
              />
            )
          })}
          {error && <p className="text-xs font-medium text-destructive">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={save}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
