import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, Mail, Zap } from 'lucide-react'
import { loginSchema } from '../features/auth/schemas'
import type { LoginValues } from '../features/auth/schemas'
import { DEMO_ACCOUNTS, authService } from '../features/auth/services/authService'
import { AuthCard } from '../features/auth/components/AuthCard'
import { PasswordInput } from '../features/auth/components/PasswordInput'
import { useAuthStore } from '../store/authStore'
import { dashboardPath } from '../constants/dashboardNav'
import { ROUTES } from '../constants'
import { showToast } from '../lib/toast'
import { Button, Input } from '../components/ui'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const from = (location.state as { from?: string } | null)?.from

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { user, token } = await authService.login(values)
      login(user, token)
      showToast.success('Welcome back!', `Signed in as ${user.name}`)
      navigate(from ?? dashboardPath(user.role, ''), { replace: true })
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : 'Login failed. Please try again.')
    }
  })

  const fillDemo = (email: string, password: string) => {
    setValue('email', email, { shouldValidate: true })
    setValue('password', password, { shouldValidate: true })
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to your QuickHire account to keep going."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link to={ROUTES.signup} className="font-semibold text-primary hover:underline">
            Sign up free
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="size-4" />}
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          label="Password"
          placeholder="Your password"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-end">
          <Link
            to={ROUTES.forgotPassword}
            className="text-sm font-medium text-primary transition-colors hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isSubmitting} leftIcon={<LogIn className="size-4" />}>
          Log in
        </Button>
      </form>

      {DEMO_ACCOUNTS.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Zap className="size-3.5" />
              Try a demo account
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.role}
                type="button"
                onClick={() => fillDemo(account.email, account.password)}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-muted"
              >
                <span className="block text-sm font-semibold">{account.label}</span>
                <span className="block truncate text-xs text-muted-foreground">{account.email}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </AuthCard>
  )
}
