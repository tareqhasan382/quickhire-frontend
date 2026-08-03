import { apiFetch } from '../../../services/http'
import type { BackendCompany, BackendJob } from '../../../services/mappers'
import type {
  ApplicationStatus,
  BackendApplication,
  CompanyPayload,
  JobPayload,
  RecruiterApplication,
  RecruiterJob,
} from '../types'

function mapMyJob(raw: BackendJob): RecruiterJob {
  return {
    id: raw._id,
    title: raw.title,
    company: raw.company,
    category: raw.category,
    employmentType: raw.employmentType,
    experienceLevel: raw.experienceLevel,
    status: raw.status,
    featured: raw.featured ?? false,
    applicants: raw.applicantsCount ?? 0,
    views: raw.views ?? 0,
    postedAt: raw.createdAt ?? '',
  }
}

function mapApplication(raw: BackendApplication): RecruiterApplication {
  const job = typeof raw.job_id === 'string' ? { title: '', company: '' } : raw.job_id
  const user = typeof raw.user_id === 'string' ? { name: raw.name, email: raw.email } : raw.user_id
  return {
    id: raw._id,
    applicant: user.name || raw.name,
    email: user.email || raw.email,
    job: job.title,
    company: job.company,
    appliedAt: raw.createdAt ?? '',
    status: raw.status,
    rating: raw.rating ?? 0,
    resumeLink: raw.resume_link,
    coverNote: raw.cover_note,
  }
}

export const recruiterService = {
  async getOverview(): Promise<{ jobs: RecruiterJob[]; applications: RecruiterApplication[] }> {
    const [jobs, applications] = await Promise.all([
      recruiterService.getMyJobs(),
      recruiterService.getApplications(),
    ])
    return { jobs, applications }
  },

  async getMyJobs(): Promise<RecruiterJob[]> {
    const { data } = await apiFetch<BackendJob[]>('/jobs/mine')
    return data.map(mapMyJob)
  },

  async getJob(id: string): Promise<BackendJob | undefined> {
    const { data } = await apiFetch<BackendJob>(`/jobs/${id}`)
    return data
  },

  async createJob(payload: JobPayload): Promise<BackendJob> {
    const { data } = await apiFetch<BackendJob>('/jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return data
  },

  async updateJob(id: string, payload: JobPayload): Promise<BackendJob> {
    const { data } = await apiFetch<BackendJob>(`/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
    return data
  },

  async deleteJob(id: string): Promise<void> {
    await apiFetch<null>(`/jobs/${id}`, { method: 'DELETE' })
  },

  async getApplications(): Promise<RecruiterApplication[]> {
    const { data } = await apiFetch<BackendApplication[]>('/applications/recruiter')
    return data.map(mapApplication)
  },

  async updateApplicationStatus(id: string, status: ApplicationStatus): Promise<void> {
    await apiFetch<null>(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },

  async getMyCompany(): Promise<BackendCompany | undefined> {
    const { data } = await apiFetch<BackendCompany[]>('/companies/mine')
    return data[0]
  },

  async createCompany(payload: CompanyPayload): Promise<BackendCompany> {
    const { data } = await apiFetch<BackendCompany>('/companies', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return data
  },

  async updateMyCompany(payload: CompanyPayload): Promise<BackendCompany> {
    const { data } = await apiFetch<BackendCompany>('/companies/mine', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
    return data
  },
}
