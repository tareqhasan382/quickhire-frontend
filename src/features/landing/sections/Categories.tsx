import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { categories } from '../../../data/categories'
import { formatNumber } from '../../../utils/format'
import { Container, SectionHeading } from '../../../components/ui'
import { Reveal } from '../../../components/ui'

export function Categories() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Browse by category"
          title="Explore jobs by category"
          description="From engineering to design, find your niche and discover roles matched to your skills."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index * 0.05}>
              <Link
                to={`/jobs?category=${category.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lifted"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary transition-transform duration-200 group-hover:scale-110">
                  <category.icon className="size-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatNumber(category.openPositions)} open positions
                  </p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary group-hover:opacity-100" />
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
