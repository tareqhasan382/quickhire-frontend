import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardContent, CategorySelect, Input, Select, Textarea } from '../../../components/ui'
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from '../../jobs/constants'
import {
  DEFAULT_JOB_FORM,
  JOB_LOCATION_TYPES,
  SALARY_CURRENCIES,
  SALARY_PERIODS,
  jobFormSchema,
} from '../schemas'
import type { JobFormValues } from '../schemas'

const locationTypeOptions = JOB_LOCATION_TYPES.map((value) => ({ value, label: value }))
const currencyOptions = SALARY_CURRENCIES.map((value) => ({ value, label: value }))
const periodOptions = SALARY_PERIODS.map((value) => ({
  value,
  label: value === 'year' ? 'Per year' : value === 'month' ? 'Per month' : 'Per hour',
}))
const statusOptions = [
  { value: 'Active', label: 'Active (visible to candidates)' },
  { value: 'Draft', label: 'Draft (hidden)' },
  { value: 'Closed', label: 'Closed' },
]

export interface JobFormProps {
  initialValues?: Partial<JobFormValues>
  isSubmitting?: boolean
  submitLabel?: string
  onSubmit: (values: JobFormValues) => void
}

function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function JobForm({
  initialValues,
  isSubmitting = false,
  submitLabel = 'Publish job',
  onSubmit,
}: JobFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: { ...DEFAULT_JOB_FORM, ...initialValues },
  })

  const submit = handleSubmit((values) => onSubmit(values))

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <Card>
        <CardContent className="space-y-5 p-6">
          <SectionTitle title="Overview" hint="The basics candidates see first." />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Job title"
              placeholder="e.g. Senior Frontend Engineer"
              error={errors.title?.message}
              {...register('title')}
            />
            <Input
              label="Company"
              placeholder="Your company name"
              error={errors.company?.message}
              {...register('company')}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <CategorySelect
              label="Category"
              placeholder="Select a category"
              error={errors.category?.message}
              {...register('category')}
            />
            <Input
              label="Summary"
              placeholder="One line summary (optional)"
              error={errors.summary?.message}
              {...register('summary')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-5 p-6">
          <SectionTitle title="Location & type" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="Work model"
              options={locationTypeOptions}
              error={errors.locationType?.message}
              {...register('locationType')}
            />
            <Select
              label="Employment type"
              options={EMPLOYMENT_TYPES}
              error={errors.employmentType?.message}
              {...register('employmentType')}
            />
            <Select
              label="Experience level"
              options={EXPERIENCE_LEVELS}
              error={errors.experienceLevel?.message}
              {...register('experienceLevel')}
            />
            <Select
              label="Status"
              options={statusOptions}
              error={errors.status?.message}
              {...register('status')}
            />
            <Input
              label="City"
              placeholder="e.g. San Francisco"
              error={errors.city?.message}
              {...register('city')}
            />
            <Input
              label="Country"
              placeholder="e.g. United States"
              error={errors.country?.message}
              {...register('country')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-5 p-6">
          <SectionTitle title="Compensation" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Minimum salary"
              type="number"
              placeholder="60000"
              error={errors.salaryMin?.message}
              {...register('salaryMin')}
            />
            <Input
              label="Maximum salary"
              type="number"
              placeholder="120000"
              error={errors.salaryMax?.message}
              {...register('salaryMax')}
            />
            <Select
              label="Currency"
              options={currencyOptions}
              error={errors.currency?.message}
              {...register('currency')}
            />
            <Select
              label="Period"
              options={periodOptions}
              error={errors.period?.message}
              {...register('period')}
            />
            <Input
              label="Application deadline"
              type="date"
              error={errors.deadline?.message}
              {...register('deadline')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-5 p-6">
          <SectionTitle title="Description" hint="Paste each item on its own line for lists." />
          <Textarea
            label="Full description"
            rows={6}
            placeholder="Describe the role in detail…"
            error={errors.description?.message}
            {...register('description')}
          />
          <Textarea
            label="Requirements"
            rows={4}
            placeholder={'5+ years of experience\nStrong TypeScript skills'}
            error={errors.requirements?.message}
            {...register('requirements')}
          />
          <Textarea
            label="Responsibilities"
            rows={4}
            placeholder={'Build and ship features\nCollaborate with designers'}
            error={errors.responsibilities?.message}
            {...register('responsibilities')}
          />
          <Textarea
            label="Benefits"
            rows={3}
            placeholder={'Health insurance\nRemote friendly\nStock options'}
            error={errors.benefits?.message}
            {...register('benefits')}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Skills"
              placeholder="React, TypeScript, GraphQL"
              hint="Comma separated"
              error={errors.skills?.message}
              {...register('skills')}
            />
            <Input
              label="Tags"
              placeholder="startup, fintech"
              hint="Comma separated"
              error={errors.tags?.message}
              {...register('tags')}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
