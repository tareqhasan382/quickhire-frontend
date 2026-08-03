import type { ReactNode } from 'react'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import { Checkbox } from '../../../components/ui'
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS, SALARY_BANDS } from '../constants'
import type { UseJobFiltersReturn } from '../hooks/useJobFilters'

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="space-y-2.5">{children}</div>
    </div>
  )
}

export function JobFilters({ store }: { store: UseJobFiltersReturn }) {
  const {
    filters,
    activeFilterCount,
    toggleEmploymentType,
    toggleExperienceLevel,
    setRemote,
    setMinSalary,
    reset,
  } = store

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          Filters
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={reset}
          disabled={activeFilterCount === 0}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary disabled:pointer-events-none disabled:opacity-50"
        >
          <RotateCcw className="size-3" />
          Reset
        </button>
      </div>

      <FilterGroup title="Employment type">
        {EMPLOYMENT_TYPES.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={filters.employmentTypes?.includes(option.value) ?? false}
            onChange={() => toggleEmploymentType(option.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Experience level">
        {EXPERIENCE_LEVELS.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={filters.experienceLevels?.includes(option.value) ?? false}
            onChange={() => toggleExperienceLevel(option.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Work mode">
        <Checkbox
          label="Remote jobs only"
          checked={filters.remote === true}
          onChange={(event) => setRemote(event.target.checked)}
        />
      </FilterGroup>

      <FilterGroup title="Minimum salary">
        {SALARY_BANDS.map((band) => (
          <Checkbox
            key={band.value}
            label={band.label}
            checked={filters.minSalary === band.value}
            onChange={() => setMinSalary(filters.minSalary === band.value ? undefined : band.value)}
          />
        ))}
      </FilterGroup>
    </div>
  )
}
