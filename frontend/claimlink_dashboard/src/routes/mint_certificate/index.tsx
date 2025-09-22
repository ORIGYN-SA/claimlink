import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout'
import { MintCertificatePage } from '@/features/mint-certificate'

export const Route = createFileRoute('/mint_certificate/')({
  component: MintCertificateRoute,
})

function MintCertificateRoute() {
  return (
    <DashboardLayout>
      <MintCertificatePage />
    </DashboardLayout>
  )
}
