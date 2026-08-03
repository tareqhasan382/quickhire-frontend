import { Briefcase, Building2, Rocket, Users } from 'lucide-react'
import type { Stat } from '../types'

export const stats: Stat[] = [
  { id: 's1', label: 'Active jobs', value: 12480, icon: Briefcase },
  { id: 's2', label: 'Companies hiring', value: 2430, icon: Building2 },
  { id: 's3', label: 'Successful hires', value: 8600, suffix: '+', icon: Rocket },
  { id: 's4', label: 'Professionals', value: 125000, suffix: '+', icon: Users },
]
