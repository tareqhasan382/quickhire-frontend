import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ChangeEvent, KeyboardEvent, MouseEvent, SelectHTMLAttributes } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options?: SelectOption[]
  placeholder?: string
  containerClassName?: string
  variant?: 'default' | 'ghost'
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    className,
    label,
    error,
    options = [],
    placeholder,
    containerClassName,
    variant = 'default',
    id,
    value: controlledValue,
    defaultValue,
    onChange,
    onBlur,
    disabled,
    ...props
  },
  forwardedRef,
) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const isControlled = controlledValue !== undefined

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const [pos, setPos] = useState<{ top?: number; bottom?: number; left: number; minWidth: number } | null>(null)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const selectRef = useRef<HTMLSelectElement>(null)

  const value = isControlled ? (controlledValue ?? '') : internalValue
  const selectedLabel = options.find((option) => option.value === value)?.label ?? ''
  const showPlaceholder = value === '' && !!placeholder

  const setSelectRefs = (element: HTMLSelectElement | null) => {
    selectRef.current = element
    if (typeof forwardedRef === 'function') forwardedRef(element)
    else if (forwardedRef) forwardedRef.current = element
  }

  useLayoutEffect(() => {
    if (isControlled) return
    const element = selectRef.current
    if (element?.value) setInternalValue(element.value)
  }, [isControlled])

  useEffect(() => {
    if (!open) return
    const optionCount = options.length
    const compute = () => {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      const minWidth = Math.max(rect.width, 208)
      const estimatedHeight = Math.min(optionCount, 8) * 36 + 16
      const spaceBelow = window.innerHeight - rect.bottom - 8
      const placeAbove = spaceBelow < estimatedHeight && rect.top > spaceBelow
      const left = Math.min(Math.max(rect.left, 8), window.innerWidth - minWidth - 8)
      setPos(
        placeAbove
          ? { bottom: window.innerHeight - rect.top + 6, left, minWidth }
          : { top: rect.bottom + 6, left, minWidth },
      )
    }
    compute()
    const close = (event?: Event) => {
      if (event && event.type === 'scroll') {
        const target = event.target as Node
        if (menuRef.current?.contains(target)) return
      }
      setOpen(false)
    }
    const onPointerDown = (event: globalThis.MouseEvent) => {
      const target = event.target as Node
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [open, options.length])

  const commit = (next: string) => {
    setOpen(false)
    if (next === value) return
    const element = selectRef.current
    if (element) {
      element.value = next
      element.dispatchEvent(new Event('change', { bubbles: true }))
    } else if (onChange) {
      onChange({ target: { value: next } } as ChangeEvent<HTMLSelectElement>)
    }
    if (!isControlled) setInternalValue(next)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }
    if (!['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) return
    event.preventDefault()
    if (!open) {
      const current = Math.max(0, options.findIndex((option) => option.value === value))
      setActiveIndex(event.key === 'ArrowUp' ? options.length - 1 : current)
      setOpen(true)
      return
    }
    if (event.key === 'ArrowDown') setActiveIndex((index) => (index + 1) % options.length)
    else if (event.key === 'ArrowUp') setActiveIndex((index) => (index - 1 + options.length) % options.length)
    else if (options[activeIndex]) commit(options[activeIndex].value)
  }

  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) event.preventDefault()
  }

  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <button
        type="button"
        ref={triggerRef}
        id={selectId}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${selectId}-listbox` : undefined}
        aria-invalid={error ? true : undefined}
        aria-label={props['aria-label']}
        onClick={() => setOpen((isOpen) => !isOpen)}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        className={cn(
          'group flex h-11 w-full items-center justify-between gap-2 text-sm text-foreground transition-colors duration-200',
          'disabled:cursor-not-allowed disabled:opacity-60',
          variant === 'default' &&
            'rounded-xl border bg-card pl-4 pr-3.5 shadow-sm hover:border-primary/40 focus:border-primary/60 focus:outline-none focus:ring-4 focus:ring-primary/10',
          variant === 'ghost' && 'bg-transparent pl-3 pr-2 hover:text-primary focus:outline-none',
          error && variant === 'default' ? 'border-destructive/60' : variant === 'default' && 'border-input',
          className,
        )}
      >
        <span className={cn('truncate text-left', showPlaceholder && 'text-muted-foreground')}>
          {selectedLabel || placeholder || 'Select…'}
        </span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180',
            !disabled && 'group-hover:text-primary',
          )}
        />
      </button>
      <select
        ref={setSelectRefs}
        id={`${selectId}-value`}
        name={props.name}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        onBlur={onBlur}
        className="sr-only"
      />
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && pos && (
              <motion.div
                ref={menuRef}
                role="listbox"
                id={`${selectId}-listbox`}
                aria-label={label}
                className="fixed z-[90] max-h-64 overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-lifted"
                style={pos}
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                {options.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-muted-foreground">No options available</p>
                ) : (
                  options.map((option, index) => {
                    const isSelected = option.value === value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => commit(option.value)}
                        className={cn(
                          'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                          isSelected
                            ? 'bg-primary-soft font-medium text-primary'
                            : activeIndex === index
                              ? 'bg-muted text-foreground'
                              : 'text-foreground hover:bg-muted',
                        )}
                      >
                        <span className="truncate">{option.label}</span>
                        {isSelected && <Check className="size-4 shrink-0 text-primary" />}
                      </button>
                    )
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  )
})
