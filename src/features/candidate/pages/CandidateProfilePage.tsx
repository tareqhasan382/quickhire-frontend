import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BadgeCheck } from 'lucide-react'
import { candidateService } from '../services/candidateService'
import { PageHeader } from '../../admin/components/PageHeader'
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Input,
  Skeleton,
  Textarea,
} from '../../../components/ui'
import { showToast } from '../../../lib/toast'
import { useAuthStore } from '../../../store/authStore'
import { PROFILE_FORM_DEFAULTS, profileFormSchema } from '../schemas'
import type { ProfileFormValues } from '../schemas'
import type { CandidateProfile } from '../types'

function profileToFormValues(profile: CandidateProfile): ProfileFormValues {
  return {
    name: profile.name,
    avatar: profile.avatar ?? '',
    title: profile.title ?? '',
    phone: profile.phone ?? '',
    location: profile.location ?? '',
    bio: profile.bio ?? '',
  }
}

export function CandidateProfilePage() {
  const queryClient = useQueryClient()

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['candidate', 'profile'],
    queryFn: candidateService.getProfile,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: PROFILE_FORM_DEFAULTS,
  })

  useEffect(() => {
    if (profile) reset(profileToFormValues(profile))
  }, [profile, reset])

  const saveMutation = useMutation({
    mutationFn: (values: ProfileFormValues) =>
      candidateService.updateProfile({
        name: values.name,
        avatar: values.avatar,
        title: values.title,
        phone: values.phone,
        location: values.location,
        bio: values.bio,
      }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'profile'] })
      useAuthStore.getState().updateUser({
        name: updated.name,
        avatar: updated.avatar,
        title: updated.title,
        phone: updated.phone,
        location: updated.location,
      })
      showToast.success('Profile saved', 'Your profile has been updated.')
    },
    onError: (error) => {
      showToast.error(error instanceof Error ? error.message : 'Could not save your profile.')
    },
  })

  const submit = handleSubmit((values) => saveMutation.mutate(values))

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Career"
        title="My Profile"
        description="Your personal details and contact information."
      />

      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-32 w-full sm:col-span-2" />
          </div>
        </div>
      ) : isError || !profile ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">
          We could not load your profile. Please refresh the page.
        </div>
      ) : (
        <>
          <Card>
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center gap-4">
                <Avatar name={profile.name} src={profile.avatar} size="xl" />
                <div>
                  <p className="flex items-center gap-1.5 text-base font-semibold">
                    {profile.name}
                    {profile.verified && <BadgeCheck className="size-4 text-primary" />}
                  </p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Full name"
                  placeholder="Alex Morgan"
                  error={errors.name?.message}
                  {...register('name')}
                />
                <Input
                  label="Professional title"
                  placeholder="Frontend Developer"
                  error={errors.title?.message}
                  {...register('title')}
                />
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="+1 555 000 1234"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
                <Input
                  label="Location"
                  placeholder="City, Country"
                  error={errors.location?.message}
                  {...register('location')}
                />
                <Input
                  label="Avatar URL"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  hint="Leave empty to keep your initials."
                  error={errors.avatar?.message}
                  {...register('avatar')}
                />
              </div>
              <Textarea
                label="Bio"
                rows={4}
                placeholder="Tell recruiters a little about yourself…"
                error={errors.bio?.message}
                {...register('bio')}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="button" isLoading={saveMutation.isPending} onClick={submit}>
              Save changes
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
