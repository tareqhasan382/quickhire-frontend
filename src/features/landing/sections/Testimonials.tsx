import { Quote } from 'lucide-react'
import { testimonials } from '../../../data/testimonials'
import { Avatar, Card, Container, Rating, SectionHeading } from '../../../components/ui'
import { Reveal } from '../../../components/ui'

export function Testimonials() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by candidates and recruiters"
          description="Don’t just take our word for it — here’s what the QuickHire community says."
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.id} delay={index * 0.07}>
              <Card className="flex h-full flex-col gap-4 p-6">
                <Quote className="size-8 text-primary/30" />
                <Rating value={testimonial.rating} />
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  “{testimonial.content}”
                </p>
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <Avatar name={testimonial.name} size="md" />
                  <div>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role} · {testimonial.company}
                    </p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
