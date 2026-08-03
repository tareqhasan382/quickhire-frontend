import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button, Card, CardContent, Input, Textarea } from '../../../components/ui'

export interface SimpleField {
  key: string
  label: string
  placeholder?: string
  hint?: string
  textarea?: boolean
  type?: string
  required?: boolean
}

interface SimpleSectionFormProps {
  fields: SimpleField[]
  values: Record<string, string>
  isSaving: boolean
  onSave: (values: Record<string, string>) => void
}

export function SimpleSectionForm({ fields, values, isSaving, onSave }: SimpleSectionFormProps) {
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [error, setError] = useState('')

  useEffect(() => {
    setDraft(values)
  }, [values])

  const save = () => {
    for (const field of fields) {
      if (field.required && !(draft[field.key] ?? '').trim()) {
        setError(`${field.label} is required.`)
        return
      }
    }
    const payload: Record<string, string> = {}
    for (const field of fields) {
      payload[field.key] = (draft[field.key] ?? '').trim()
    }
    onSave(payload)
  }

  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((field) =>
            field.textarea ? (
              <Textarea
                key={field.key}
                label={field.label}
                placeholder={field.placeholder}
                rows={3}
                className={field.textarea ? 'sm:col-span-2' : undefined}
                value={draft[field.key] ?? ''}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, [field.key]: event.target.value }))
                }
              />
            ) : (
              <Input
                key={field.key}
                label={field.label}
                type={field.type ?? 'text'}
                placeholder={field.placeholder}
                hint={field.hint}
                className={field.textarea ? 'sm:col-span-2' : undefined}
                value={draft[field.key] ?? ''}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, [field.key]: event.target.value }))
                }
              />
            ),
          )}
        </div>
        {error && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
            <AlertCircle className="size-3.5" />
            {error}
          </p>
        )}
        <div className="flex justify-end">
          <Button type="button" isLoading={isSaving} onClick={save}>
            Save changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
