import { createFileRoute } from '@tanstack/react-router'
import { ForgotPasswordPage } from '@/features/auth'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})
