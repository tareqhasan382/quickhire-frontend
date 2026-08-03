import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { EmploymentType, ExperienceLevel, JobFilters, JobSort } from '../../../types'

function setParam(params: URLSearchParams, key: string, value?: string) {
  if (value) params.set(key, value)
  else params.delete(key)
}

export interface UseJobFiltersReturn {
  filters: JobFilters
  page: number
  activeFilterCount: number
  update: (patch: Partial<JobFilters>) => void
  toggleEmploymentType: (type: EmploymentType) => void
  toggleExperienceLevel: (level: ExperienceLevel) => void
  setRemote: (remote: boolean) => void
  setMinSalary: (salary?: number) => void
  setSort: (sort: JobSort) => void
  setPage: (page: number) => void
  reset: () => void
}

export function useJobFilters(): UseJobFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo<JobFilters>(() => {
    const types = searchParams.get('types')?.split(',').filter(Boolean)
    const levels = searchParams.get('levels')?.split(',').filter(Boolean)
    const salary = Number(searchParams.get('salary'))
    return {
      query: searchParams.get('q') ?? undefined,
      location: searchParams.get('location') ?? undefined,
      category: searchParams.get('category') ?? undefined,
      employmentTypes: types?.length ? (types as EmploymentType[]) : undefined,
      experienceLevels: levels?.length ? (levels as ExperienceLevel[]) : undefined,
      remote: searchParams.get('remote') === '1' ? true : undefined,
      minSalary: searchParams.get('salary') && !Number.isNaN(salary) ? salary : undefined,
      sort: (searchParams.get('sort') as JobSort) ?? 'newest',
    }
  }, [searchParams])

  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)

  const update = useCallback(
    (patch: Partial<JobFilters>) => {
      const next = new URLSearchParams(searchParams)
      setParam(next, 'q', patch.query)
      setParam(next, 'location', patch.location)
      setParam(next, 'category', patch.category)
      if (patch.employmentTypes !== undefined) {
        setParam(next, 'types', patch.employmentTypes.length ? patch.employmentTypes.join(',') : undefined)
      }
      if (patch.experienceLevels !== undefined) {
        setParam(next, 'levels', patch.experienceLevels.length ? patch.experienceLevels.join(',') : undefined)
      }
      if (patch.remote !== undefined) {
        setParam(next, 'remote', patch.remote ? '1' : undefined)
      }
      if (patch.minSalary !== undefined) {
        setParam(next, 'salary', patch.minSalary ? String(patch.minSalary) : undefined)
      }
      if (patch.sort !== undefined) {
        setParam(next, 'sort', patch.sort)
      }
      next.set('page', '1')
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const toggleEmploymentType = useCallback(
    (type: EmploymentType) => {
      const current = filters.employmentTypes ?? []
      const next = current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type]
      update({ employmentTypes: next })
    },
    [filters.employmentTypes, update],
  )

  const toggleExperienceLevel = useCallback(
    (level: ExperienceLevel) => {
      const current = filters.experienceLevels ?? []
      const next = current.includes(level)
        ? current.filter((item) => item !== level)
        : [...current, level]
      update({ experienceLevels: next })
    },
    [filters.experienceLevels, update],
  )

  const setRemote = useCallback(
    (remote: boolean) => update({ remote: remote ? true : undefined }),
    [update],
  )

  const setMinSalary = useCallback((salary?: number) => update({ minSalary: salary }), [update])

  const setSort = useCallback((sort: JobSort) => update({ sort }), [update])

  const setPage = useCallback(
    (nextPage: number) => {
      const next = new URLSearchParams(searchParams)
      next.set('page', String(nextPage))
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const reset = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [setSearchParams])

  const activeFilterCount =
    (filters.query ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.employmentTypes?.length ?? 0) +
    (filters.experienceLevels?.length ?? 0) +
    (filters.remote ? 1 : 0) +
    (filters.minSalary ? 1 : 0)

  return {
    filters,
    page,
    activeFilterCount,
    update,
    toggleEmploymentType,
    toggleExperienceLevel,
    setRemote,
    setMinSalary,
    setSort,
    setPage,
    reset,
  }
}
