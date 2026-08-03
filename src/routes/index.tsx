/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, useRouteError } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { PublicLayout } from '../layouts/PublicLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { ComingSoon } from '../pages/ComingSoon'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ErrorState, Spinner } from '../components/ui'
import { dashboardNav, dashboardPath } from '../constants/dashboardNav'
import { useAuthStore } from '../store/authStore'
import { ROUTES } from '../constants'

const HomePage = lazy(() =>
  import('../pages/HomePage').then((module) => ({ default: module.HomePage })),
)

const JobSearchPage = lazy(() =>
  import('../pages/JobSearchPage').then((module) => ({ default: module.JobSearchPage })),
)

const JobDetailsPage = lazy(() =>
  import('../pages/JobDetailsPage').then((module) => ({ default: module.JobDetailsPage })),
)

const LoginPage = lazy(() =>
  import('../pages/LoginPage').then((module) => ({ default: module.LoginPage })),
)

const SignupPage = lazy(() =>
  import('../pages/SignupPage').then((module) => ({ default: module.SignupPage })),
)

const ForgotPasswordPage = lazy(() =>
  import('../pages/ForgotPasswordPage').then((module) => ({ default: module.ForgotPasswordPage })),
)

const ResetPasswordPage = lazy(() =>
  import('../pages/ResetPasswordPage').then((module) => ({ default: module.ResetPasswordPage })),
)

const VerifyEmailPage = lazy(() =>
  import('../pages/VerifyEmailPage').then((module) => ({ default: module.VerifyEmailPage })),
)

const CompaniesPage = lazy(() =>
  import('../pages/CompaniesPage').then((module) => ({ default: module.CompaniesPage })),
)

const CompanyProfilePage = lazy(() =>
  import('../pages/CompanyProfilePage').then((module) => ({ default: module.CompanyProfilePage })),
)

const AdminOverviewPage = lazy(() =>
  import('../features/admin/pages/AdminOverviewPage').then((module) => ({ default: module.AdminOverviewPage })),
)

const AdminUsersPage = lazy(() =>
  import('../features/admin/pages/AdminUsersPage').then((module) => ({ default: module.AdminUsersPage })),
)

const AdminCompaniesPage = lazy(() =>
  import('../features/admin/pages/AdminCompaniesPage').then((module) => ({ default: module.AdminCompaniesPage })),
)

const AdminJobsPage = lazy(() =>
  import('../features/admin/pages/AdminJobsPage').then((module) => ({ default: module.AdminJobsPage })),
)

const AdminApplicationsPage = lazy(() =>
  import('../features/admin/pages/AdminApplicationsPage').then((module) => ({ default: module.AdminApplicationsPage })),
)

const AdminAnalyticsPage = lazy(() =>
  import('../features/admin/pages/AdminAnalyticsPage').then((module) => ({ default: module.AdminAnalyticsPage })),
)

const RecruiterOverviewPage = lazy(() =>
  import('../features/recruiter/pages/RecruiterOverviewPage').then((module) => ({ default: module.RecruiterOverviewPage })),
)

const RecruiterJobsPage = lazy(() =>
  import('../features/recruiter/pages/RecruiterJobsPage').then((module) => ({ default: module.RecruiterJobsPage })),
)

const RecruiterPostJobPage = lazy(() =>
  import('../features/recruiter/pages/RecruiterPostJobPage').then((module) => ({ default: module.RecruiterPostJobPage })),
)

const RecruiterApplicantsPage = lazy(() =>
  import('../features/recruiter/pages/RecruiterApplicantsPage').then((module) => ({ default: module.RecruiterApplicantsPage })),
)

const RecruiterCompanyPage = lazy(() =>
  import('../features/recruiter/pages/RecruiterCompanyPage').then((module) => ({ default: module.RecruiterCompanyPage })),
)

const CandidateOverviewPage = lazy(() =>
  import('../features/candidate/pages/CandidateOverviewPage').then((module) => ({ default: module.CandidateOverviewPage })),
)

const CandidateProfilePage = lazy(() =>
  import('../features/candidate/pages/CandidateProfilePage').then((module) => ({ default: module.CandidateProfilePage })),
)

const CandidateResumePage = lazy(() =>
  import('../features/candidate/pages/CandidateResumePage').then((module) => ({ default: module.CandidateResumePage })),
)

const CandidatePortfolioPage = lazy(() =>
  import('../features/candidate/pages/CandidatePortfolioPage').then((module) => ({ default: module.CandidatePortfolioPage })),
)

const CandidateSkillsPage = lazy(() =>
  import('../features/candidate/pages/CandidateSkillsPage').then((module) => ({ default: module.CandidateSkillsPage })),
)

const CandidateExperiencePage = lazy(() =>
  import('../features/candidate/pages/CandidateExperiencePage').then((module) => ({ default: module.CandidateExperiencePage })),
)

const CandidateEducationPage = lazy(() =>
  import('../features/candidate/pages/CandidateEducationPage').then((module) => ({ default: module.CandidateEducationPage })),
)

const CandidateCertificatesPage = lazy(() =>
  import('../features/candidate/pages/CandidateCertificatesPage').then((module) => ({ default: module.CandidateCertificatesPage })),
)

const CandidateAppliedPage = lazy(() =>
  import('../features/candidate/pages/CandidateAppliedPage').then((module) => ({ default: module.CandidateAppliedPage })),
)

const CandidateSavedPage = lazy(() =>
  import('../features/candidate/pages/CandidateSavedPage').then((module) => ({ default: module.CandidateSavedPage })),
)

const CandidateSettingsPage = lazy(() =>
  import('../features/candidate/pages/CandidateSettingsPage').then((module) => ({ default: module.CandidateSettingsPage })),
)

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner className="size-8 text-primary" />
    </div>
  )
}

function RootErrorBoundary() {
  const error = useRouteError()
  const message = error instanceof Error ? error.message : undefined
  return (
    <div className="grid min-h-screen place-items-center bg-background p-4">
      <ErrorState
        title="Something went wrong"
        description={message ?? 'An unexpected error occurred.'}
        onRetry={() => window.location.reload()}
      />
    </div>
  )
}

function DashboardIndexRedirect() {
  const role = useAuthStore((state) => state.user?.role)
  if (!role) return <Navigate to={ROUTES.login} replace />
  return <Navigate to={dashboardPath(role, '')} replace />
}

const publicPlaceholderPages: { path: string; title: string }[] = [
  { path: 'about', title: 'About QuickHire' },
  { path: 'features', title: 'Features' },
  { path: 'pricing', title: 'Pricing' },
  { path: 'faq', title: 'FAQ' },
  { path: 'contact', title: 'Contact' },
  { path: 'privacy', title: 'Privacy Policy' },
  { path: 'terms', title: 'Terms & Conditions' },
]

function buildCandidateRoutes(): RouteObject[] {
  const handled = new Set([
    'profile',
    'resume',
    'portfolio',
    'skills',
    'experience',
    'education',
    'certificates',
    'applied',
    'saved',
    'settings',
  ])
  const children: RouteObject[] = [
    {
      index: true,
      element: (
        <Suspense fallback={<PageLoader />}>
          <CandidateOverviewPage />
        </Suspense>
      ),
    },
    {
      path: 'profile',
      element: (
        <Suspense fallback={<PageLoader />}>
          <CandidateProfilePage />
        </Suspense>
      ),
    },
    {
      path: 'resume',
      element: (
        <Suspense fallback={<PageLoader />}>
          <CandidateResumePage />
        </Suspense>
      ),
    },
    {
      path: 'portfolio',
      element: (
        <Suspense fallback={<PageLoader />}>
          <CandidatePortfolioPage />
        </Suspense>
      ),
    },
    {
      path: 'skills',
      element: (
        <Suspense fallback={<PageLoader />}>
          <CandidateSkillsPage />
        </Suspense>
      ),
    },
    {
      path: 'experience',
      element: (
        <Suspense fallback={<PageLoader />}>
          <CandidateExperiencePage />
        </Suspense>
      ),
    },
    {
      path: 'education',
      element: (
        <Suspense fallback={<PageLoader />}>
          <CandidateEducationPage />
        </Suspense>
      ),
    },
    {
      path: 'certificates',
      element: (
        <Suspense fallback={<PageLoader />}>
          <CandidateCertificatesPage />
        </Suspense>
      ),
    },
    {
      path: 'applied',
      element: (
        <Suspense fallback={<PageLoader />}>
          <CandidateAppliedPage />
        </Suspense>
      ),
    },
    {
      path: 'saved',
      element: (
        <Suspense fallback={<PageLoader />}>
          <CandidateSavedPage />
        </Suspense>
      ),
    },
    {
      path: 'settings',
      element: (
        <Suspense fallback={<PageLoader />}>
          <CandidateSettingsPage />
        </Suspense>
      ),
    },
  ]
  for (const group of dashboardNav.candidate) {
    for (const item of group.items) {
      if (!item.path || handled.has(item.path)) continue
      children.push({ path: item.path, element: <ComingSoon title={item.label} /> })
    }
  }
  return children
}

function buildRecruiterRoutes(): RouteObject[] {
  const handled = new Set(['company-profile', 'post-job', 'my-jobs', 'applicants'])
  const children: RouteObject[] = [
    {
      index: true,
      element: (
        <Suspense fallback={<PageLoader />}>
          <RecruiterOverviewPage />
        </Suspense>
      ),
    },
    {
      path: 'company-profile',
      element: (
        <Suspense fallback={<PageLoader />}>
          <RecruiterCompanyPage />
        </Suspense>
      ),
    },
    {
      path: 'post-job',
      element: (
        <Suspense fallback={<PageLoader />}>
          <RecruiterPostJobPage />
        </Suspense>
      ),
    },
    {
      path: 'my-jobs',
      element: (
        <Suspense fallback={<PageLoader />}>
          <RecruiterJobsPage />
        </Suspense>
      ),
    },
    {
      path: 'applicants',
      element: (
        <Suspense fallback={<PageLoader />}>
          <RecruiterApplicantsPage />
        </Suspense>
      ),
    },
  ]
  for (const group of dashboardNav.recruiter) {
    for (const item of group.items) {
      if (!item.path || handled.has(item.path)) continue
      children.push({ path: item.path, element: <ComingSoon title={item.label} /> })
    }
  }
  return children
}

function buildAdminRoutes(): RouteObject[] {
  const handled = new Set(['users', 'companies', 'jobs', 'applications', 'analytics'])
  const children: RouteObject[] = [
    {
      index: true,
      element: (
        <Suspense fallback={<PageLoader />}>
          <AdminOverviewPage />
        </Suspense>
      ),
    },
    {
      path: 'users',
      element: (
        <Suspense fallback={<PageLoader />}>
          <AdminUsersPage />
        </Suspense>
      ),
    },
    {
      path: 'companies',
      element: (
        <Suspense fallback={<PageLoader />}>
          <AdminCompaniesPage />
        </Suspense>
      ),
    },
    {
      path: 'jobs',
      element: (
        <Suspense fallback={<PageLoader />}>
          <AdminJobsPage />
        </Suspense>
      ),
    },
    {
      path: 'applications',
      element: (
        <Suspense fallback={<PageLoader />}>
          <AdminApplicationsPage />
        </Suspense>
      ),
    },
    {
      path: 'analytics',
      element: (
        <Suspense fallback={<PageLoader />}>
          <AdminAnalyticsPage />
        </Suspense>
      ),
    },
  ]
  for (const group of dashboardNav.admin) {
    for (const item of group.items) {
      if (!item.path || handled.has(item.path)) continue
      children.push({ path: item.path, element: <ComingSoon title={item.label} /> })
    }
  }
  return children
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      { path: 'jobs', element: (
          <Suspense fallback={<PageLoader />}>
            <JobSearchPage />
          </Suspense>
        ) },
      { path: 'jobs/:id', element: (
          <Suspense fallback={<PageLoader />}>
            <JobDetailsPage />
          </Suspense>
        ) },
      { path: 'companies', element: (
          <Suspense fallback={<PageLoader />}>
            <CompaniesPage />
          </Suspense>
        ) },
      { path: 'companies/:id', element: (
          <Suspense fallback={<PageLoader />}>
            <CompanyProfilePage />
          </Suspense>
        ) },
      { path: 'blog', element: <ComingSoon title="Blog" /> },
      { path: 'blog/:id', element: <ComingSoon title="Blog Post" /> },
      ...publicPlaceholderPages.map((page) => ({
        path: page.path,
        element: <ComingSoon title={page.title} />,
      })),
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      { path: 'login', element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
      { path: 'signup', element: <Suspense fallback={<PageLoader />}><SignupPage /></Suspense> },
      { path: 'forgot-password', element: <Suspense fallback={<PageLoader />}><ForgotPasswordPage /></Suspense> },
      { path: 'reset-password', element: <Suspense fallback={<PageLoader />}><ResetPasswordPage /></Suspense> },
      { path: 'verify-email', element: <Suspense fallback={<PageLoader />}><VerifyEmailPage /></Suspense> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <RootErrorBoundary />,
    children: [{ index: true, element: <DashboardIndexRedirect /> }],
  },
  {
    path: '/dashboard/candidate',
    element: (
      <ProtectedRoute allowedRoles={['candidate']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: buildCandidateRoutes(),
  },
  {
    path: '/dashboard/recruiter',
    element: (
      <ProtectedRoute allowedRoles={['recruiter']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: buildRecruiterRoutes(),
  },
  {
    path: '/dashboard/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: buildAdminRoutes(),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
