import { UserPlus, Zap, Handshake } from 'lucide-react'
import { Container, SectionHeading } from '../../../components/ui'
import { Reveal } from '../../../components/ui'

const steps = [
  {
    id: 1,
    title: 'Create your profile',
    description:
      'Build a standout profile in minutes — add your experience, skills, and portfolio. No more repetitive forms.',
    icon: UserPlus,
  },
  {
    id: 2,
    title: 'Get matched',
    description:
      'Our smart matching surfaces roles that fit your skills and goals, so you spend less time scrolling.',
    icon: Zap,
  },
  {
    id: 3,
    title: 'Get hired',
    description:
      'Apply with one click, track every application, and ace your interviews with built-in scheduling tools.',
    icon: Handshake,
  },
]

export function HowItWorks() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="From profile to offer in three steps"
          description="A hiring experience designed to respect your time — whether you are looking for a job or a teammate."
        />

        <div className="relative grid gap-6 md:grid-cols-3">
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-8 hidden border-t-2 border-dashed border-border md:block" />
          {steps.map((step, index) => (
            <Reveal key={step.id} delay={index * 0.12}>
              <div className="relative flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lifted">
                <span className="relative flex size-16 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg">
                  <step.icon className="size-7" />
                  <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-card text-xs font-bold text-primary shadow-sm">
                    {step.id}
                  </span>
                </span>
                <h3 className="mt-5 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
