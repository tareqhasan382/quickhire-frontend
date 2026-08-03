import { apiFetch } from '../../../services/http'
import { getCompanies } from '../../../services/companyService'
import type { BackendJob, BackendUser } from '../../../services/mappers'
import { mapJob } from '../../../services/mappers'
import type { Job } from '../../../types'
import type {
  BackendApplication,
  CandidateApplication,
  CandidateProfile,
  ProfileUpdateInput,
} from '../types'

function mapProfile(raw: BackendUser): CandidateProfile {
  return {
    id: raw._id ?? raw.id ?? '',
    name: raw.name,
    email: raw.email,
    role: raw.role,
    avatar: raw.avatar,
    title: raw.title,
    phone: raw.phone,
    location: raw.location,
    verified: Boolean(raw.isVerified),
    bio: raw.bio ?? '',
    skills: raw.skills ?? [],
    languages: raw.languages ?? [],
    resumeLink: raw.resume_link ?? '',
    portfolioLink: raw.portfolio_link ?? '',
    workExperience: (raw.workExperience ?? []).map((item) => ({ ...item })),
    education: (raw.education ?? []).map((item) => ({ ...item })),
    certificates: (raw.certificates ?? []).map((item) => ({ ...item })),
  }
}

function mapApplication(raw: BackendApplication): CandidateApplication {
  const job = typeof raw.job_id === 'string' ? { _id: '', title: '', company: '' } : raw.job_id
  return {
    id: raw._id,
    jobId: job._id,
    job: job.title,
    company: job.company,
    appliedAt: raw.createdAt ?? '',
    status: raw.status,
    rating: raw.rating ?? 0,
    resumeLink: raw.resume_link,
    coverNote: raw.cover_note,
  }
}

export interface ApplyInput {
  name: string
  email: string
  resumeLink: string
  coverNote?: string
}

export const candidateService = {
  async getProfile(): Promise<CandidateProfile> {
    const { data } = await apiFetch<BackendUser>('/user/me')
    return mapProfile(data)
  },

  async updateProfile(payload: ProfileUpdateInput): Promise<CandidateProfile> {
    const { data } = await apiFetch<BackendUser>('/user/me', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
    return mapProfile(data)
  },

  async getApplications(): Promise<CandidateApplication[]> {
    const { data } = await apiFetch<BackendApplication[]>('/applications/me')
    return data.map(mapApplication)
  },

  async apply(jobId: string, input: ApplyInput): Promise<void> {
    await apiFetch<null>('/applications', {
      method: 'POST',
      body: JSON.stringify({
        job_id: jobId,
        name: input.name,
        email: input.email,
        resume_link: input.resumeLink,
        cover_note: input.coverNote?.trim() || undefined,
      }),
    })
  },

  async withdrawApplication(id: string): Promise<void> {
    await apiFetch<null>(`/applications/me/${id}`, { method: 'DELETE' })
  },

  async getSavedJobs(): Promise<Job[]> {
    const { data } = await apiFetch<BackendJob[]>('/user/me/saved-jobs')
    const companies = await getCompanies()
    return data.map((raw) => mapJob(raw, companies))
  },

  async saveJob(jobId: string): Promise<void> {
    await apiFetch<null>(`/user/me/saved-jobs/${jobId}`, { method: 'PUT' })
  },

  async unsaveJob(jobId: string): Promise<void> {
    await apiFetch<null>(`/user/me/saved-jobs/${jobId}`, { method: 'DELETE' })
  },
}
