import { useNavigate } from 'react-router-dom'
import { BadgeCheck, LogOut, ShieldCheck } from 'lucide-react'
import { candidateService } from '../services/candidateService'
import { PageHeader } from '../../admin/components/PageHeader'
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '../../../components/ui'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../../store/authStore'
import { dashboardPath, roleLabel } from '../../../constants/dashboardNav'

export function CandidateSettingsPage() {
  const navigate = useNavigate()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['candidate', 'profile'],
    queryFn: candidateService.getProfile,
  })

  const signOut = () => {
    navigate('/')
    useAuthStore.getState().logout()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Activity"
        title="Account Settings"
        description="Manage your account information and sign out."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your QuickHire account details.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || !profile ? (
              <div className="flex items-center gap-4">
                <Skeleton className="size-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Avatar name={profile.name} src={profile.avatar} size="xl" />
                <div>
                  <p className="flex items-center gap-1.5 text-base font-semibold">
                    {profile.name}
                    {profile.verified && <BadgeCheck className="size-4 text-primary" />}
                  </p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                  <Badge variant="secondary" size="sm" className="mt-1">
                    <ShieldCheck className="size-3" />
                    {roleLabel[profile.role]}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sign out</CardTitle>
            <CardDescription>You can sign back in any time with your credentials.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button type="button" variant="outline" onClick={() => navigate(dashboardPath('candidate', 'profile'))}>
              Edit profile
            </Button>
            <Button type="button" variant="destructive" onClick={signOut}>
              <LogOut className="size-4" />
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
