import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  label?: string
  description?: string
  className?: string
}

export function Checkbox({ label, description, className, id, ...props }: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId
  return (
    <label
      htmlFor={checkboxId}
      className={cn('flex cursor-pointer select-none items-start gap-3', className)}
    >
      <span className="relative mt-0.5 flex size-5 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          id={checkboxId}
          className="peer size-5 cursor-pointer appearance-none rounded-md border border-input bg-card transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 checked:border-primary checked:bg-primary"
          {...props}
        />
        <Check className="pointer-events-none absolute size-3.5 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100" />
      </span>
      {(label || description) && (
        <span className="flex flex-col">
          {label && <span className="text-sm font-medium text-foreground">{label}</span>}
          {description && <span className="text-xs text-muted-foreground">{description}</span>}
        </span>
      )}
    </label>
  )
}
