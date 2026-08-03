import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import { resetPasswordSchema } from '../features/auth/schemas'
import type { ResetPasswordValues } from '../features/auth/schemas'
import { authService } from '../features/auth/services/authService'
import { AuthCard } from '../features/auth/components/AuthCard'
import { PasswordInput } from '../features/auth/components/PasswordInput'
import { ROUTES } from '../constants'
import { showToast } from '../lib/toast'
import { Button } from '../components/ui'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const hasToken = searchParams.has('token')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await authService.resetPassword(values.password)
      showToast.success('Password updated', 'You can now log in with your new password.')
      navigate(ROUTES.login, { replace: true })
    } catch {
      showToast.error('Something went wrong. Please try again.')
    }
  })

  return (
    <AuthCard
      title="Set a new password"
      subtitle="Choose a strong password you have not used for this account before."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Remembered it?{' '}
          <Link to={ROUTES.login} className="font-semibold text-primary hover:underline">
            Back to login
          </Link>
        </p>
      }
    >
      {hasToken ? (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <PasswordInput
            label="New password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordInput
            label="Confirm new password"
            placeholder="Repeat your new password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting}
            leftIcon={<KeyRound className="size-4" />}
          >
            Reset password
          </Button>
        </form>
      ) : (
        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p>
            This link is missing a reset token. Use the link from your email, or request a new one.
          </p>
          <Link
            to={ROUTES.forgotPassword}
            className="font-semibold text-primary transition-colors hover:underline"
          >
            Request a new reset link
          </Link>
        </div>
      )}
    </AuthCard>
  )
}
