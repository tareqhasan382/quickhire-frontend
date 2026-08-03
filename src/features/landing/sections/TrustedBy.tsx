import { companies } from '../../../data/companies'
import { Container } from '../../../components/ui'
import { Reveal } from '../../../components/ui'

export function TrustedBy() {
  return (
    <section className="border-b border-border bg-card py-12">
      <Container>
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Trusted by hiring teams at
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {companies.slice(0, 6).map((company) => (
              <span
                key={company.id}
                className="text-lg font-bold tracking-tight text-muted-foreground/50 transition-colors duration-300 hover:text-foreground"
              >
                {company.name}
              </span>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
