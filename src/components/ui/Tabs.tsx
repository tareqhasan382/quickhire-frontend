import { useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export interface TabItem {
  value: string
  label: string
  icon?: ReactNode
  badge?: number
}

export interface TabsProps {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  className?: string
}

export function Tabs({ items, value, defaultValue, onChange, className }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.value ?? '')
  const activeValue = value ?? internal
  const selectTab = onChange ?? setInternal

  return (
    <div
      role="tablist"
      className={cn('inline-flex items-center gap-1 rounded-xl bg-muted p-1', className)}
    >
      {items.map((item) => {
        const isActive = activeValue === item.value
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => selectTab(item.value)}
            className={cn(
              'relative rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="tabs-active-pill"
                className="absolute inset-0 rounded-lg bg-card shadow-sm"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {item.icon}
              {item.label}
              {item.badge !== undefined && (
                <span className="rounded-full bg-primary-soft px-1.5 py-0.5 text-xs font-semibold text-primary">
                  {item.badge}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
