import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { verifyEmailSchema } from '../features/auth/schemas'
import type { VerifyEmailValues } from '../features/auth/schemas'
import { VERIFICATION_CODE, authService } from '../features/auth/services/authService'
import { AuthCard } from '../features/auth/components/AuthCard'
import { ROUTES } from '../constants'
import { showToast } from '../lib/toast'
import { Button, Input } from '../components/ui'

export function VerifyEmailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const [resending, setResending] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { code: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await authService.verifyEmail(values.code)
      showToast.success('Email verified!', 'Your account is ready to go.')
      navigate(ROUTES.login, { replace: true })
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : 'Verification failed. Try again.')
    }
  })

  const handleResend = async () => {
    setResending(true)
    await authService.forgotPassword(email)
    setResending(false)
    showToast.info('Code resent', 'Check your inbox for a new verification code.')
  }

  return (
    <AuthCard
      title="Verify your email"
      subtitle={
        email
          ? `Enter the 6-digit code we sent to ${email}.`
          : 'Enter the 6-digit code we sent to your email.'
      }
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Changed your mind?{' '}
          <Link to={ROUTES.signup} className="font-semibold text-primary hover:underline">
            Create a different account
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input
          label="Verification code"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="000000"
          maxLength={6}
          className="text-center text-lg font-semibold tracking-[0.5em]"
          error={errors.code?.message}
          {...register('code')}
        />

        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          leftIcon={<ShieldCheck className="size-4" />}
        >
          Verify email
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          For this demo, the code is{' '}
          <span className="font-mono font-semibold text-foreground">{VERIFICATION_CODE}</span>
        </p>

        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
          <span>Didn&apos;t get it?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-semibold text-primary transition-colors hover:underline disabled:opacity-60"
          >
            {resending ? 'Resending…' : 'Resend code'}
          </button>
        </div>
      </form>
    </AuthCard>
  )
}
