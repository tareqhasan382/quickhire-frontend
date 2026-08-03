import { Link } from 'react-router-dom'
import { ArrowRight, Building2, Sparkles } from 'lucide-react'
import { Container, buttonStyles } from '../../../components/ui'
import { Reveal } from '../../../components/ui'
import { ROUTES } from '../../../constants'

export function CTA() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-brand-gradient px-6 py-14 text-center shadow-lifted sm:px-12 lg:py-20">
            <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full bg-white/10 blur-3xl" />

            <span className="relative inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              <Sparkles className="size-3.5" />
              Join 15,000+ hiring heroes
            </span>
            <h2 className="relative mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to find your next great hire — or your dream job?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              Whether you are a candidate looking to level up or a company building your team, QuickHire
              makes the journey faster and more human.
            </p>

            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to={ROUTES.signup}
                className={buttonStyles({
                  variant: 'primary',
                  size: 'lg',
                  className: 'bg-white text-foreground hover:bg-white/90',
                })}
              >
                Find a job
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to={ROUTES.signup}
                className={buttonStyles({
                  variant: 'outline',
                  size: 'lg',
                  className: 'border-white/40 bg-white/10 text-white hover:bg-white/20',
                })}
              >
                <Building2 className="size-4" />
                Post a job
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
