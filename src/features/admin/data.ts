import { companies } from '../../data/companies'
import { jobs } from '../../data/jobs'
import type {
  ActivityItem,
  AdminApplication,
  AdminCompany,
  AdminJob,
  AdminStats,
  AdminUser,
  CategoryMetric,
  MonthlyMetric,
  MonthlyRegistrations,
} from './types'

export const adminStats: AdminStats = {
  totalUsers: 125430,
  activeJobs: 12480,
  companies: 2430,
  applications: 48210,
  totalUsersDelta: 12.4,
  activeJobsDelta: 8.1,
  companiesDelta: 5.7,
  applicationsDelta: -3.2,
}

export const adminUsers: AdminUser[] = [
  { id: 'u-1', name: 'Alex Morgan', email: 'alex.morgan@example.com', role: 'candidate', status: 'Active', location: 'San Francisco, CA', joinedAt: '2026-01-14T09:20:00.000Z', lastActive: '2026-08-02T14:05:00.000Z', applications: 12 },
  { id: 'u-2', name: 'Jordan Rivera', email: 'jordan.rivera@example.com', role: 'recruiter', status: 'Active', location: 'Austin, TX', joinedAt: '2025-11-02T10:00:00.000Z', lastActive: '2026-08-02T09:41:00.000Z', applications: 0 },
  { id: 'u-3', name: 'Priya Sharma', email: 'priya.sharma@example.com', role: 'candidate', status: 'Active', location: 'London, UK', joinedAt: '2026-02-20T08:15:00.000Z', lastActive: '2026-08-01T18:22:00.000Z', applications: 8 },
  { id: 'u-4', name: 'Marcus Johnson', email: 'marcus.johnson@example.com', role: 'candidate', status: 'Suspended', location: 'Chicago, IL', joinedAt: '2025-09-12T12:30:00.000Z', lastActive: '2026-05-30T16:10:00.000Z', applications: 4 },
  { id: 'u-5', name: 'Sarah Chen', email: 'sarah.chen@example.com', role: 'recruiter', status: 'Active', location: 'Seattle, WA', joinedAt: '2026-03-05T07:45:00.000Z', lastActive: '2026-08-02T11:03:00.000Z', applications: 0 },
  { id: 'u-6', name: 'Tomás Silva', email: 'tomas.silva@example.com', role: 'candidate', status: 'Pending', location: 'Lisbon, PT', joinedAt: '2026-08-01T15:50:00.000Z', lastActive: '2026-08-01T15:50:00.000Z', applications: 0 },
  { id: 'u-7', name: 'Amira Haddad', email: 'amira.haddad@example.com', role: 'candidate', status: 'Active', location: 'Berlin, DE', joinedAt: '2026-04-18T13:25:00.000Z', lastActive: '2026-08-02T10:12:00.000Z', applications: 21 },
  { id: 'u-8', name: 'Daniel Kim', email: 'daniel.kim@example.com', role: 'admin', status: 'Active', location: 'New York, NY', joinedAt: '2025-08-30T09:00:00.000Z', lastActive: '2026-08-02T08:55:00.000Z', applications: 0 },
  { id: 'u-9', name: 'Elena Petrova', email: 'elena.petrova@example.com', role: 'recruiter', status: 'Active', location: 'Amsterdam, NL', joinedAt: '2026-01-27T10:40:00.000Z', lastActive: '2026-08-01T20:31:00.000Z', applications: 0 },
  { id: 'u-10', name: 'Liam O’Brien', email: 'liam.obrien@example.com', role: 'candidate', status: 'Active', location: 'Dublin, IE', joinedAt: '2026-05-09T11:05:00.000Z', lastActive: '2026-08-02T13:47:00.000Z', applications: 6 },
  { id: 'u-11', name: 'Grace Nwosu', email: 'grace.nwosu@example.com', role: 'candidate', status: 'Suspended', location: 'Lagos, NG', joinedAt: '2025-12-03T08:20:00.000Z', lastActive: '2026-06-11T09:33:00.000Z', applications: 9 },
  { id: 'u-12', name: 'Hiro Tanaka', email: 'hiro.tanaka@example.com', role: 'recruiter', status: 'Active', location: 'Tokyo, JP', joinedAt: '2026-02-11T03:55:00.000Z', lastActive: '2026-08-02T07:18:00.000Z', applications: 0 },
  { id: 'u-13', name: 'Fatima Zahra', email: 'fatima.zahra@example.com', role: 'candidate', status: 'Pending', location: 'Dubai, AE', joinedAt: '2026-08-02T06:40:00.000Z', lastActive: '2026-08-02T06:40:00.000Z', applications: 0 },
  { id: 'u-14', name: 'Noah Fischer', email: 'noah.fischer@example.com', role: 'candidate', status: 'Active', location: 'Zurich, CH', joinedAt: '2026-03-23T09:30:00.000Z', lastActive: '2026-08-01T22:09:00.000Z', applications: 14 },
  { id: 'u-15', name: 'Olivia Bennett', email: 'olivia.bennett@example.com', role: 'recruiter', status: 'Pending', location: 'Toronto, CA', joinedAt: '2026-07-28T14:12:00.000Z', lastActive: '2026-08-01T17:45:00.000Z', applications: 0 },
  { id: 'u-16', name: 'Mateo García', email: 'mateo.garcia@example.com', role: 'candidate', status: 'Active', location: 'Madrid, ES', joinedAt: '2026-06-15T12:10:00.000Z', lastActive: '2026-08-02T12:26:00.000Z', applications: 3 },
]

export const adminCompanies: AdminCompany[] = companies.map((company, index) => ({
  id: company.id,
  slug: company.slug,
  name: company.name,
  industry: company.industry,
  location: company.location,
  size: company.size,
  status: company.verified ? 'Active' : 'Pending',
  verified: company.verified,
  plan: index % 3 === 0 ? 'Enterprise' : index % 2 === 0 ? 'Pro' : 'Free',
  openPositions: company.openPositions,
  rating: company.rating,
}))

export const adminJobs: AdminJob[] = jobs.map((job) => ({
  id: job.id,
  title: job.title,
  company: job.company.name,
  category: job.category,
  employmentType: job.employmentType,
  experienceLevel: job.experienceLevel,
  status: job.status,
  featured: job.featured,
  applicants: job.applicantsCount,
  views: job.views,
  postedAt: job.postedAt,
}))

export const adminApplications: AdminApplication[] = [
  { id: 'a-1', applicant: 'Alex Morgan', email: 'alex.morgan@example.com', job: 'Senior Frontend Engineer', company: 'Luminary', appliedAt: '2026-08-01T09:14:00.000Z', status: 'Interview', rating: 4.5 },
  { id: 'a-2', applicant: 'Priya Sharma', email: 'priya.sharma@example.com', job: 'Product Designer', company: 'Pixelworks Studio', appliedAt: '2026-07-31T16:42:00.000Z', status: 'Reviewed', rating: 4 },
  { id: 'a-3', applicant: 'Amira Haddad', email: 'amira.haddad@example.com', job: 'Backend Engineer — Payments', company: 'Nimbus Pay', appliedAt: '2026-07-31T11:20:00.000Z', status: 'Hired', rating: 5 },
  { id: 'a-4', applicant: 'Liam O’Brien', email: 'liam.obrien@example.com', job: 'Data Scientist — Growth', company: 'Atlas Commerce', appliedAt: '2026-07-30T13:05:00.000Z', status: 'Pending', rating: 3.5 },
  { id: 'a-5', applicant: 'Noah Fischer', email: 'noah.fischer@example.com', job: 'ML Engineer', company: 'Quantum Labs', appliedAt: '2026-07-30T08:55:00.000Z', status: 'Interview', rating: 4.5 },
  { id: 'a-6', applicant: 'Mateo García', email: 'mateo.garcia@example.com', job: 'Customer Success Manager', company: 'Verdant Health', appliedAt: '2026-07-29T17:30:00.000Z', status: 'Rejected', rating: 2.5 },
  { id: 'a-7', applicant: 'Grace Nwosu', email: 'grace.nwosu@example.com', job: 'Brand Designer', company: 'Pixelworks Studio', appliedAt: '2026-07-29T10:12:00.000Z', status: 'Reviewed', rating: 4 },
  { id: 'a-8', applicant: 'Daniel Kim', email: 'daniel.kim@example.com', job: 'Platform Engineer', company: 'Luminary', appliedAt: '2026-07-28T14:48:00.000Z', status: 'Hired', rating: 5 },
  { id: 'a-9', applicant: 'Elena Petrova', email: 'elena.petrova@example.com', job: 'Product Manager', company: 'Steelbridge Logistics', appliedAt: '2026-07-28T09:33:00.000Z', status: 'Pending', rating: 3.5 },
  { id: 'a-10', applicant: 'Marcus Johnson', email: 'marcus.johnson@example.com', job: 'DevOps Engineer', company: 'Nimbus Pay', appliedAt: '2026-07-27T12:26:00.000Z', status: 'Rejected', rating: 3 },
  { id: 'a-11', applicant: 'Sarah Chen', email: 'sarah.chen@example.com', job: 'UX Researcher', company: 'Brightpath Education', appliedAt: '2026-07-26T15:04:00.000Z', status: 'Interview', rating: 4 },
  { id: 'a-12', applicant: 'Hiro Tanaka', email: 'hiro.tanaka@example.com', job: 'Content Strategist', company: 'Atlas Commerce', appliedAt: '2026-07-25T10:50:00.000Z', status: 'Pending', rating: 3 },
]

export const activity: ActivityItem[] = [
  { id: 'ac-1', type: 'user', title: 'New recruiter joined', description: 'Olivia Bennett signed up as a recruiter at Brightpath Education.', time: '2026-08-02T08:40:00.000Z' },
  { id: 'ac-2', type: 'application', title: 'Hire confirmed', description: 'Amira Haddad was hired for Backend Engineer — Payments at Nimbus Pay.', time: '2026-08-02T07:15:00.000Z' },
  { id: 'ac-3', type: 'report', title: 'Job reported', description: '“Senior Frontend Engineer” at Luminary was flagged for review.', time: '2026-08-01T22:04:00.000Z' },
  { id: 'ac-4', type: 'job', title: 'New job published', description: 'Data Scientist — Growth published by Atlas Commerce.', time: '2026-08-01T18:32:00.000Z' },
  { id: 'ac-5', type: 'company', title: 'Company verification requested', description: 'Steelbridge Logistics requested a verified badge.', time: '2026-08-01T14:10:00.000Z' },
  { id: 'ac-6', type: 'user', title: 'Account suspended', description: 'Grace Nwosu was suspended after a content policy violation.', time: '2026-07-31T16:55:00.000Z' },
  { id: 'ac-7', type: 'application', title: 'High volume application day', description: '1,240 applications received in a single day — record high.', time: '2026-07-31T09:00:00.000Z' },
  { id: 'ac-8', type: 'user', title: 'New candidate joined', description: 'Fatima Zahra created a candidate account.', time: '2026-07-30T11:28:00.000Z' },
]

export const applicationsByMonth: MonthlyMetric[] = [
  { month: 'Sep', applications: 2980, hires: 512 },
  { month: 'Oct', applications: 3350, hires: 548 },
  { month: 'Nov', applications: 3120, hires: 470 },
  { month: 'Dec', applications: 2840, hires: 405 },
  { month: 'Jan', applications: 3640, hires: 601 },
  { month: 'Feb', applications: 3890, hires: 628 },
  { month: 'Mar', applications: 4210, hires: 690 },
  { month: 'Apr', applications: 3980, hires: 641 },
  { month: 'May', applications: 4430, hires: 732 },
  { month: 'Jun', applications: 4680, hires: 764 },
  { month: 'Jul', applications: 4520, hires: 701 },
  { month: 'Aug', applications: 5100, hires: 842 },
]

export const registrationsByMonth: MonthlyRegistrations[] = [
  { month: 'Sep', candidates: 8200, recruiters: 1500 },
  { month: 'Oct', candidates: 9100, recruiters: 1720 },
  { month: 'Nov', candidates: 8800, recruiters: 1640 },
  { month: 'Dec', candidates: 6400, recruiters: 1210 },
  { month: 'Jan', candidates: 11200, recruiters: 2130 },
  { month: 'Feb', candidates: 12400, recruiters: 2310 },
  { month: 'Mar', candidates: 13800, recruiters: 2540 },
  { month: 'Apr', candidates: 12100, recruiters: 2280 },
  { month: 'May', candidates: 14700, recruiters: 2760 },
  { month: 'Jun', candidates: 15600, recruiters: 2980 },
  { month: 'Jul', candidates: 14900, recruiters: 2890 },
  { month: 'Aug', candidates: 16800, recruiters: 3240 },
]

export const jobsByCategory: CategoryMetric[] = [
  { name: 'Software Engineering', value: 1240 },
  { name: 'Data & Analytics', value: 318 },
  { name: 'Design & Creative', value: 386 },
  { name: 'Marketing', value: 274 },
  { name: 'Product Management', value: 197 },
  { name: 'Other', value: 566 },
]
