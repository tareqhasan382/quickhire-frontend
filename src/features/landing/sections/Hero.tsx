import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, MapPin, Search, Sparkles } from 'lucide-react'
import { stats } from '../../../data/stats'
import { formatNumber } from '../../../utils/format'
import { Container, Avatar, Badge, CategorySelect, Rating } from '../../../components/ui'
import { ROUTES } from '../../../constants'

const POPULAR = ['Remote', 'React', 'Fintech', 'Design', 'Marketing']

const floatingJobs = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    company: 'Luminary',
    tag: 'Full-time',
    salary: '$140k – $175k',
    delay: 0,
    float: 0,
    y: 0,
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'Pixelworks',
    tag: 'Remote',
    salary: '€65k – €85k',
    delay: 0.8,
    float: 1.2,
    y: 60,
  },
  {
    id: 3,
    title: 'Backend Engineer — Payments',
    company: 'Nimbus Pay',
    tag: 'Fintech',
    salary: '$135k – $165k',
    delay: 1.6,
    float: 0.6,
    y: 120,
  },
]

export function Hero() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (keyword.trim()) params.set('q', keyword.trim())
    if (location.trim()) params.set('location', location.trim())
    if (category) params.set('category', category)
    navigate(`${ROUTES.jobs}?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-brand-gradient opacity-[0.06]" />
      <div className="pointer-events-none absolute -top-40 right-0 size-[500px] rounded-full bg-primary/10 blur-3xl" />

      <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="primary" size="md" icon={<Sparkles className="size-3.5" />}>
              The hiring platform teams trust
            </Badge>
          </motion.div>

          <motion.h1
            className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Find the job that fits <span className="text-gradient">your future</span>
          </motion.h1>

          <motion.p
            className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Search thousands of curated roles at companies that care about great work. Apply in minutes,
            track everything, and land the role you deserve.
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-border bg-card p-2 shadow-soft"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="grid gap-2 md:grid-cols-[1fr_1fr_1.1fr_auto]">
              <div className="flex items-center gap-2 rounded-xl px-3">
                <Briefcase className="size-4 shrink-0 text-muted-foreground" />
                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Job title or keyword"
                  aria-label="Job title or keyword"
                  className="h-11 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 rounded-xl px-3">
                <MapPin className="size-4 shrink-0 text-muted-foreground" />
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="City or Remote"
                  aria-label="Location"
                  className="h-11 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <div className="rounded-xl bg-muted/60 px-3 md:bg-transparent">
                <CategorySelect
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  aria-label="Category"
                  variant="ghost"
                  valueMode="slug"
                  placeholder="All categories"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              >
                <Search className="size-4" />
                Search
              </button>
            </div>
          </motion.form>

          <motion.div
            className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span>Popular:</span>
            {POPULAR.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setKeyword(term)
                  setLocation('')
                  setCategory('')
                }}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs transition-colors hover:border-primary/40 hover:text-primary"
              >
                {term}
              </button>
            ))}
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex -space-x-2.5">
              {['Sarah Chen', 'Marcus Johnson', 'Amira Haddad', 'Daniel Kim'].map((name) => (
                <Avatar key={name} name={name} size="sm" ring />
              ))}
            </div>
            <div>
              <Rating value={4.9} />
              <p className="mt-0.5 text-xs text-muted-foreground">
                Loved by <span className="font-semibold text-foreground">15,000+</span> job seekers &amp; recruiters
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="relative hidden lg:block"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative h-[440px]">
            {floatingJobs.map((job) => (
              <motion.div
                key={job.id}
                className="absolute left-0 right-16"
                style={{ top: job.y }}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: job.float,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: job.delay + 0.4, duration: 0.5 }}
                  className="rounded-2xl border border-border bg-card p-4 shadow-lifted"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={job.company} size="md" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{job.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{job.company}</p>
                    </div>
                    <Badge variant="success" size="sm" className="ml-auto shrink-0">
                      {job.tag}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-primary">{job.salary}</p>
                </motion.div>
              </motion.div>
            ))}
            <div className="absolute -right-2 top-40 rounded-2xl border border-border bg-card px-4 py-3 shadow-lifted">
              <p className="text-2xl font-bold text-gradient">{formatNumber(8600)}+</p>
              <p className="text-xs text-muted-foreground">hires this year</p>
            </div>
          </div>
        </motion.div>
      </Container>

      <Container className="border-t border-border py-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <stat.icon className="size-5" />
              </span>
              <div>
                <p className="text-xl font-bold sm:text-2xl">
                  {formatNumber(stat.value)}
                  {stat.suffix}
                </p>
                <p className="text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
