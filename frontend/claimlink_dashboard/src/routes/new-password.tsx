import { createFileRoute } from '@tanstack/react-router'
import { NewPasswordPage } from '@/features/auth'

export const Route = createFileRoute('/new-password')({
  component: NewPasswordPage,
})