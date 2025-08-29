import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout'
import { CreateCertificatePage } from '@/features/create-certificate'

export const Route = createFileRoute('/create_certificate')({
  component: CreateCertificateRoute,
})

function CreateCertificateRoute() {
  return (
    <DashboardLayout>
      <CreateCertificatePage />
    </DashboardLayout>
  )
}
