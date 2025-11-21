import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout'
import { NewCampaignPage } from '@/features/campaigns'

export const Route = createFileRoute('/campaigns/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DashboardLayout>
      <NewCampaignPage />
    </DashboardLayout>
  )
}
