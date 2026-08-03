import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Briefcase, UserRound } from 'lucide-react'
import { signupSchema } from '../features/auth/schemas'
import type { SignupValues } from '../features/auth/schemas'
import { authService } from '../features/auth/services/authService'
import { AuthCard } from '../features/auth/components/AuthCard'
import { PasswordInput } from '../features/auth/components/PasswordInput'
import { ROUTES } from '../constants'
import { showToast } from '../lib/toast'
import { cn } from '../lib/utils'
import { Button, Input } from '../components/ui'

const ROLE_OPTIONS = [
  {
    value: 'candidate',
    title: "I'm a candidate",
    description: 'Looking for my next role',
    icon: UserRound,
  },
  {
    value: 'recruiter',
    title: "I'm a recruiter",
    description: 'Hiring for my company',
    icon: Briefcase,
  },
] as const

export function SignupPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', role: 'candidate', acceptTerms: false },
  })

  const role = useWatch({ control, name: 'role' })

  const onSubmit = handleSubmit(async (values) => {
    try {
      const user = await authService.signup(values)
      showToast.success('Account created!', 'We sent a verification code to your email.')
      navigate(`${ROUTES.verifyEmail}?email=${encodeURIComponent(user.email)}`, { replace: true })
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : 'Signup failed. Please try again.')
    }
  })

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join thousands of people finding and filling great jobs."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to={ROUTES.login} className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input
          label="Full name"
          placeholder="Alex Morgan"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          label="Password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <PasswordInput
          label="Confirm password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div>
          <span className="mb-2 block text-sm font-medium text-foreground">Account type</span>
          <div className="grid gap-3 sm:grid-cols-2">
            {ROLE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors',
                  role === option.value
                    ? 'border-primary bg-primary-soft'
                    : 'border-border hover:border-primary/40',
                )}
              >
                <input type="radio" value={option.value} className="sr-only" {...register('role')} />
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg',
                    role === option.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  <option.icon className="size-4.5" />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold">{option.title}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </span>
              </label>
            ))}
          </div>
          {errors.role && <p className="mt-1.5 text-xs font-medium text-destructive">{errors.role.message}</p>}
        </div>

        <div>
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
              {...register('acceptTerms')}
            />
            <span>
              I agree to the{' '}
              <Link to="/terms" className="font-medium text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="font-medium text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="mt-1.5 text-xs font-medium text-destructive">{errors.acceptTerms.message}</p>
          )}
        </div>

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthCard>
  )
}
