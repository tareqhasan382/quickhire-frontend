import { Hero } from '../features/landing/sections/Hero'
import { TrustedBy } from '../features/landing/sections/TrustedBy'
import { Categories } from '../features/landing/sections/Categories'
import { FeaturedJobs } from '../features/landing/sections/FeaturedJobs'
import { HowItWorks } from '../features/landing/sections/HowItWorks'
import { FeaturedCompanies } from '../features/landing/sections/FeaturedCompanies'
import { Testimonials } from '../features/landing/sections/Testimonials'
import { BlogPreview } from '../features/landing/sections/BlogPreview'
import { CTA } from '../features/landing/sections/CTA'

export function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Categories />
      <FeaturedJobs />
      <HowItWorks />
      <FeaturedCompanies />
      <Testimonials />
      <BlogPreview />
      <CTA />
    </>
  )
}
