import type { Company } from '../types'
import { apiFetch } from './http'
import type { BackendCompany } from './mappers'
import { mapCompany } from './mappers'

const ALL_COMPANIES_LIMIT = 200

let companiesPromise: Promise<Company[]> | null = null

export function getCompanies(): Promise<Company[]> {
  companiesPromise ??= fetchCompanies()
  return companiesPromise
}

async function fetchCompanies(): Promise<Company[]> {
  const { data } = await apiFetch<BackendCompany[]>(`/companies?limit=${ALL_COMPANIES_LIMIT}`)
  return data.map(mapCompany)
}

export const companyService = {
  async getAll(): Promise<Company[]> {
    const { data } = await apiFetch<BackendCompany[]>(`/companies?limit=${ALL_COMPANIES_LIMIT}`)
    return data.map(mapCompany)
  },

  async getFeatured(): Promise<Company[]> {
    const all = await getCompanies()
    return all.filter((company) => company.featured)
  },

  async getBySlug(slug: string): Promise<Company | undefined> {
    const all = await getCompanies()
    return all.find((company) => company.slug === slug)
  },

  async getById(id: string): Promise<Company | undefined> {
    const all = await getCompanies()
    return all.find((company) => company.id === id)
  },
}
