import {
  Award,
  BarChart3,
  Bell,
  Bookmark,
  Briefcase,
  Building2,
  CalendarClock,
  CreditCard,
  FileCheck,
  FileText,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  PieChart,
  PlusCircle,
  Send,
  Settings,
  Sparkles,
  Tags,
  UserRound,
  Users,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Role } from '../types'

export interface DashboardNavItem {
  label: string
  path: string
  icon: LucideIcon
}

export interface DashboardNavGroup {
  title: string
  items: DashboardNavItem[]
}

export const dashboardNav: Record<Role, DashboardNavGroup[]> = {
  candidate: [
    {
      title: 'Overview',
      items: [{ label: 'Dashboard', path: '', icon: LayoutDashboard }],
    },
    {
      title: 'Career',
      items: [
        { label: 'My Profile', path: 'profile', icon: UserRound },
        { label: 'Resume', path: 'resume', icon: FileText },
        { label: 'Portfolio', path: 'portfolio', icon: FolderKanban },
        { label: 'Skills', path: 'skills', icon: Wrench },
        { label: 'Work Experience', path: 'experience', icon: Briefcase },
        { label: 'Education', path: 'education', icon: GraduationCap },
        { label: 'Certificates', path: 'certificates', icon: Award },
      ],
    },
    {
      title: 'Activity',
      items: [
        { label: 'Applied Jobs', path: 'applied', icon: Send },
        { label: 'Saved Jobs', path: 'saved', icon: Bookmark },
        { label: 'Messages', path: 'messages', icon: MessageSquare },
        { label: 'Notifications', path: 'notifications', icon: Bell },
        { label: 'Account Settings', path: 'settings', icon: Settings },
      ],
    },
  ],
  recruiter: [
    {
      title: 'Overview',
      items: [{ label: 'Dashboard', path: '', icon: LayoutDashboard }],
    },
    {
      title: 'Company',
      items: [{ label: 'Company Profile', path: 'company-profile', icon: Building2 }],
    },
    {
      title: 'Jobs',
      items: [
        { label: 'Post Job', path: 'post-job', icon: PlusCircle },
        { label: 'My Jobs', path: 'my-jobs', icon: Briefcase },
      ],
    },
    {
      title: 'Hiring',
      items: [
        { label: 'Applicants', path: 'applicants', icon: Users },
        { label: 'Schedule Interviews', path: 'interviews', icon: CalendarClock },
        { label: 'Messages', path: 'messages', icon: MessageSquare },
        { label: 'Notifications', path: 'notifications', icon: Bell },
        { label: 'Billing', path: 'billing', icon: CreditCard },
        { label: 'Settings', path: 'settings', icon: Settings },
      ],
    },
  ],
  admin: [
    {
      title: 'Overview',
      items: [{ label: 'Dashboard', path: '', icon: LayoutDashboard }],
    },
    {
      title: 'Manage',
      items: [
        { label: 'Users', path: 'users', icon: Users },
        { label: 'Companies', path: 'companies', icon: Building2 },
        { label: 'Jobs', path: 'jobs', icon: Briefcase },
        { label: 'Applications', path: 'applications', icon: FileCheck },
        { label: 'Categories', path: 'categories', icon: Tags },
        { label: 'Skills', path: 'skills', icon: Sparkles },
      ],
    },
    {
      title: 'Insights',
      items: [
        { label: 'Reports', path: 'reports', icon: BarChart3 },
        { label: 'Analytics', path: 'analytics', icon: PieChart },
      ],
    },
    {
      title: 'Platform',
      items: [
        { label: 'Payments', path: 'payments', icon: CreditCard },
        { label: 'Notifications', path: 'notifications', icon: Bell },
        { label: 'Site Settings', path: 'site-settings', icon: Settings },
      ],
    },
  ],
}

export const dashboardPath = (role: Role, path: string) => `/dashboard/${role}${path ? `/${path}` : ''}`

export const roleLabel: Record<Role, string> = {
  candidate: 'Candidate',
  recruiter: 'Recruiter',
  admin: 'Admin',
}
