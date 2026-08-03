import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2 } from 'lucide-react'
import { recruiterService } from '../services/recruiterService'
import { PageHeader } from '../../admin/components/PageHeader'
import {
  Button,
  Card,
  CardContent,
  Input,
  Select,
  Skeleton,
  Textarea,
} from '../../../components/ui'
import { showToast } from '../../../lib/toast'
import {
  COMPANY_INDUSTRIES,
  COMPANY_SIZES,
  DEFAULT_COMPANY_FORM,
  companyFormSchema,
} from '../schemas'
import type { CompanyFormValues } from '../schemas'
import type { BackendCompany } from '../../../services/mappers'
import type { CompanyPayload } from '../types'

const industryOptions = COMPANY_INDUSTRIES.map((value) => ({ value, label: value }))
const sizeOptions = COMPANY_SIZES.map((value) => ({ value, label: value }))

function companyToFormValues(raw: BackendCompany): CompanyFormValues {
  return {
    name: raw.name,
    industry: raw.industry,
    size: raw.size,
    location: raw.location,
    website: raw.website ?? '',
    founded: raw.founded ? String(raw.founded) : '',
    description: raw.description,
    benefits: (raw.benefits ?? []).join('\n'),
    tags: (raw.tags ?? []).join(', '),
  }
}

function formToCompanyPayload(values: CompanyFormValues): CompanyPayload {
  const list = (value?: string) =>
    value
      ? value
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean)
      : undefined
  const csv = (value?: string) =>
    value
      ? value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : undefined

  return {
    name: values.name.trim(),
    industry: values.industry,
    size: values.size,
    location: values.location.trim(),
    website: values.website?.trim() || undefined,
    founded: values.founded ? Number(values.founded) : undefined,
    description: values.description.trim(),
    benefits: list(values.benefits),
    tags: csv(values.tags),
  }
}

export function RecruiterCompanyPage() {
  const queryClient = useQueryClient()

  const { data: company, isLoading, isError } = useQuery({
    queryKey: ['recruiter', 'company'],
    queryFn: recruiterService.getMyCompany,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: DEFAULT_COMPANY_FORM,
  })

  useEffect(() => {
    if (company) reset(companyToFormValues(company))
  }, [company, reset])

  const saveMutation = useMutation({
    mutationFn: (values: CompanyFormValues) => {
      const payload = formToCompanyPayload(values)
      return company
        ? recruiterService.updateMyCompany(payload)
        : recruiterService.createCompany(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'company'] })
      showToast.success(
        company ? 'Company updated' : 'Company created',
        'Your company profile is now live.',
      )
    },
    onError: (error) => {
      showToast.error(error instanceof Error ? error.message : 'Could not save the company.')
    },
  })

  const submit = handleSubmit((values) => saveMutation.mutate(values))

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Company"
        title="Company profile"
        description="Keep your company profile up to date so candidates know who they'd be joining."
      />

      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-6">
          <Skeleton className="h-4 w-40" />
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">
          We could not load your company profile. Please refresh the page.
        </div>
      ) : (
        <>
          {!company && (
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-5 py-4 text-sm text-muted-foreground">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Building2 className="size-5" />
              </span>
              You don&apos;t have a company profile yet. Create one below to attach it to your job
              postings.
            </div>
          )}

          <Card>
            <CardContent className="space-y-5 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Company name"
                  placeholder="Acme Inc."
                  error={errors.name?.message}
                  {...register('name')}
                />
                <Input
                  label="Location"
                  placeholder="City, Country"
                  error={errors.location?.message}
                  {...register('location')}
                />
                <Select
                  label="Industry"
                  placeholder="Select an industry"
                  options={industryOptions}
                  error={errors.industry?.message}
                  {...register('industry')}
                />
                <Select
                  label="Company size"
                  placeholder="Select a size"
                  options={sizeOptions}
                  error={errors.size?.message}
                  {...register('size')}
                />
                <Input
                  label="Website"
                  type="url"
                  placeholder="https://acme.com"
                  error={errors.website?.message}
                  {...register('website')}
                />
                <Input
                  label="Founded"
                  type="number"
                  placeholder="2018"
                  error={errors.founded?.message}
                  {...register('founded')}
                />
              </div>
              <Textarea
                label="About the company"
                rows={5}
                placeholder="Describe your company, culture and mission…"
                error={errors.description?.message}
                {...register('description')}
              />
              <Textarea
                label="Benefits"
                rows={3}
                placeholder={'Health insurance\nRemote friendly\nStock options'}
                error={errors.benefits?.message}
                {...register('benefits')}
              />
              <Input
                label="Tags"
                placeholder="startup, fintech, series-b"
                hint="Comma separated"
                error={errors.tags?.message}
                {...register('tags')}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="button"
              isLoading={saveMutation.isPending}
              onClick={submit}
            >
              {company ? 'Save changes' : 'Create company'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
