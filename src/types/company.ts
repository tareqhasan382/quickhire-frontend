export interface Company {
  id: string
  slug: string
  name: string
  logo?: string
  industry: string
  location: string
  website: string
  size: string
  founded: number
  description: string
  benefits: string[]
  openPositions: number
  rating: number
  reviewCount: number
  verified: boolean
  featured: boolean
  tags: string[]
}
