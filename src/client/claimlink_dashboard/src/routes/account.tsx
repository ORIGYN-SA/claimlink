import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout'
import { AccountPage } from '@/features/account'

export const Route = createFileRoute('/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DashboardLayout>
      <AccountPage />
    </DashboardLayout>
  )
}
