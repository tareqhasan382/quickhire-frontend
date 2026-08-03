import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { MailCheck, Mail } from 'lucide-react'
import { forgotPasswordSchema } from '../features/auth/schemas'
import type { ForgotPasswordValues } from '../features/auth/schemas'
import { authService } from '../features/auth/services/authService'
import { AuthCard } from '../features/auth/components/AuthCard'
import { ROUTES } from '../constants'
import { showToast } from '../lib/toast'
import { Button, Input } from '../components/ui'

export function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await authService.forgotPassword(values.email)
      setSentTo(values.email)
    } catch {
      showToast.error('Something went wrong. Please try again.')
    }
  })

  if (sentTo) {
    return (
      <AuthCard
        title="Check your inbox"
        subtitle="If an account exists for that email, you will get a reset link shortly."
        footer={
          <p className="text-center text-sm text-muted-foreground">
            Remembered it?{' '}
            <Link to={ROUTES.login} className="font-semibold text-primary hover:underline">
              Back to login
            </Link>
          </p>
        }
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <MailCheck className="size-8" />
          </span>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We sent a password reset link to{' '}
            <span className="font-semibold text-foreground">{sentTo}</span>. It expires in 60 minutes.
          </p>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your email and we will send you a link to reset it."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Remembered it?{' '}
          <Link to={ROUTES.login} className="font-semibold text-primary hover:underline">
            Back to login
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
        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Send reset link
        </Button>
      </form>
    </AuthCard>
  )
}
