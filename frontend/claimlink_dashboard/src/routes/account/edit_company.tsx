import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout'
import { EditCompanyPage } from '@/features/account'

export const Route = createFileRoute('/account/edit_company')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DashboardLayout>
      <EditCompanyPage />
    </DashboardLayout>
  )
}
