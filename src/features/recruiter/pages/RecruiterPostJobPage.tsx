import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { JobForm } from '../components/JobForm'
import { recruiterService } from '../services/recruiterService'
import { PageHeader } from '../../admin/components/PageHeader'
import { ErrorState, Skeleton, buttonStyles } from '../../../components/ui'
import { showToast } from '../../../lib/toast'
import { dashboardPath } from '../../../constants/dashboardNav'
import type { BackendJob } from '../../../services/mappers'
import type { EmploymentType, ExperienceLevel } from '../../../types'
import type { JobFormValues } from '../schemas'
import type { JobPayload } from '../types'

function jobToFormValues(raw: BackendJob): JobFormValues {
  return {
    title: raw.title,
    company: raw.company,
    category: raw.category,
    locationType: (raw.location?.type as JobFormValues['locationType']) ?? 'Remote',
    city: raw.location?.city ?? '',
    country: raw.location?.country ?? '',
    employmentType: raw.employmentType,
    experienceLevel: raw.experienceLevel,
    salaryMin: String(raw.salary.min),
    salaryMax: String(raw.salary.max),
    currency: raw.salary.currency,
    period: raw.salary.period,
    deadline: raw.deadline ? raw.deadline.slice(0, 10) : '',
    status: raw.status,
    summary: raw.summary ?? '',
    description: raw.description,
    requirements: (raw.requirements ?? []).join('\n'),
    responsibilities: (raw.responsibilities ?? []).join('\n'),
    benefits: (raw.benefits ?? []).join('\n'),
    skills: (raw.skills ?? []).join(', '),
    tags: (raw.tags ?? []).join(', '),
  }
}

function formToPayload(values: JobFormValues): JobPayload {
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
    title: values.title.trim(),
    company: values.company.trim(),
    location: {
      type: values.locationType,
      city: values.city?.trim() || undefined,
      country: values.country?.trim() || undefined,
    },
    category: values.category,
    summary: values.summary?.trim() || undefined,
    description: values.description.trim(),
    requirements: list(values.requirements),
    responsibilities: list(values.responsibilities),
    benefits: list(values.benefits),
    employmentType: values.employmentType as EmploymentType,
    experienceLevel: values.experienceLevel as ExperienceLevel,
    salary: {
      min: Number(values.salaryMin),
      max: Number(values.salaryMax),
      currency: values.currency,
      period: values.period,
    },
    skills: csv(values.skills),
    tags: csv(values.tags),
    status: values.status,
    deadline: values.deadline || undefined,
  }
}

export function RecruiterPostJobPage() {
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: rawJob, isLoading, isError } = useQuery({
    queryKey: ['recruiter', 'job', editId],
    queryFn: () => recruiterService.getJob(editId!),
    enabled: Boolean(editId),
  })

  const saveMutation = useMutation({
    mutationFn: (values: JobFormValues) => {
      const payload = formToPayload(values)
      return editId
        ? recruiterService.updateJob(editId, payload)
        : recruiterService.createJob(payload)
    },
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'jobs'] })
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'overview'] })
      showToast.success(
        editId ? 'Job updated' : 'Job published',
        `“${job.title}” ${editId ? 'was updated' : 'is now live'}.`,
      )
      navigate(dashboardPath('recruiter', 'my-jobs'))
    },
    onError: (error) => {
      showToast.error(error instanceof Error ? error.message : 'Could not save the job.')
    },
  })

  return (
    <div className="space-y-6">
      <Link
        to={dashboardPath('recruiter', 'my-jobs')}
        className={buttonStyles({ variant: 'ghost', size: 'sm', className: 'w-fit' })}
      >
        <ArrowLeft className="size-4" />
        Back to my jobs
      </Link>

      <PageHeader
        eyebrow={editId ? 'Edit job' : 'New job'}
        title={editId ? 'Edit job' : 'Post a job'}
        description={
          editId
            ? 'Update the details of your job posting.'
            : 'Create a new job posting to start receiving applicants.'
        }
      />

      {editId && isLoading ? (
        <div className="space-y-5">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="rounded-2xl border border-border bg-card p-6">
              <Skeleton className="h-4 w-40" />
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : editId && (isError || !rawJob) ? (
        <ErrorState
          title="Job not found"
          description="This job posting could not be loaded."
          onRetry={() => window.location.reload()}
        />
      ) : (
        <JobForm
          key={editId ?? 'create'}
          initialValues={rawJob ? jobToFormValues(rawJob) : undefined}
          isSubmitting={saveMutation.isPending}
          submitLabel={editId ? 'Save changes' : 'Publish job'}
          onSubmit={(values) => saveMutation.mutate(values)}
        />
      )}
    </div>
  )
}
