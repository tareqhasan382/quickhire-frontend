import type { LucideIcon } from 'lucide-react'

export interface JobCategory {
  id: string
  name: string
  slug: string
  icon: LucideIcon
  openPositions: number
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  avatar?: string
  rating: number
  content: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  authorRole: string
  readTime: string
  publishedAt: string
  cover: string
  tags: string[]
}

export interface Stat {
  id: string
  label: string
  value: number
  suffix?: string
  icon: LucideIcon
}
