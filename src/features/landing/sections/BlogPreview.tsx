import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import { blogService } from '../../../services/blogService'
import { timeAgo } from '../../../utils/format'
import { Badge, Container, SectionHeading, Skeleton, buttonStyles } from '../../../components/ui'
import { Reveal } from '../../../components/ui'

const coverGradients: Record<string, string> = {
  indigo: 'from-indigo-500 to-violet-500',
  violet: 'from-violet-500 to-fuchsia-500',
  fuchsia: 'from-fuchsia-500 to-pink-500',
  sky: 'from-sky-500 to-indigo-500',
  emerald: 'from-emerald-500 to-teal-500',
}

function BlogCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}

export function BlogPreview() {
  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ['blog', 'latest'],
    queryFn: blogService.getAll,
  })

  const latest = posts?.slice(0, 3) ?? []

  return (
    <section className="border-y border-border bg-card py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="From the blog"
          title="Career advice & hiring insights"
          description="Practical guides to help you get hired — and hire better."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {isLoading && Array.from({ length: 3 }, (_, index) => <BlogCardSkeleton key={index} />)}

          {isError && (
            <div className="md:col-span-3">
              <p className="text-center text-sm text-muted-foreground">
                We could not load the latest posts right now. Please refresh the page.
              </p>
            </div>
          )}

          {latest.map((post, index) => (
            <Reveal key={post.id} delay={index * 0.08}>
              <Link
                to={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lifted"
              >
                <div
                  className={`flex h-40 items-center justify-center bg-brand-gradient bg-gradient-to-br ${coverGradients[post.cover] ?? coverGradients.indigo}`}
                >
                  <span className="text-4xl font-black text-white/25 transition-transform duration-300 group-hover:scale-110">
                    {post.category.slice(0, 1)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2.5 p-5">
                  <div className="flex items-center justify-between">
                    <Badge variant="default" size="sm">
                      {post.category}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold leading-snug transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span>{timeAgo(post.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex justify-center">
          <Link to="/blog" className={buttonStyles({ variant: 'outline', size: 'lg' })}>
            Read the blog
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </Container>
    </section>
  )
}
