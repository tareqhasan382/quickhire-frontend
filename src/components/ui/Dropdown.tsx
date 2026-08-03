import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

export interface DropdownItem {
  label: string
  icon?: ReactNode
  danger?: boolean
  disabled?: boolean
  to?: string
  onClick?: () => void
}

export interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  className?: string
}

export function Dropdown({ trigger, items, align = 'right', className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="cursor-pointer"
      >
        {trigger}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            className={cn(
              'absolute z-50 mt-2 min-w-52 overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-lifted',
              align === 'right' ? 'right-0' : 'left-0',
            )}
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {items.map((item, index) => {
              const className = cn(
                'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                item.disabled
                  ? 'cursor-not-allowed opacity-50'
                  : item.danger
                    ? 'text-destructive hover:bg-destructive/10'
                    : 'text-foreground hover:bg-muted',
              )
              const shared = { className, role: 'menuitem' as const }
              if (item.to) {
                return (
                  <Link key={index} to={item.to} {...shared} onClick={() => setOpen(false)}>
                    {item.icon}
                    {item.label}
                  </Link>
                )
              }
              return (
                <button
                  key={index}
                  type="button"
                  disabled={item.disabled}
                  {...shared}
                  onClick={() => {
                    item.onClick?.()
                    setOpen(false)
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
