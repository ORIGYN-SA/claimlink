import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout'
import { EditUserPage } from '@/features/account'

export const Route = createFileRoute('/account/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DashboardLayout>
      <EditUserPage />
    </DashboardLayout>
  )
}
