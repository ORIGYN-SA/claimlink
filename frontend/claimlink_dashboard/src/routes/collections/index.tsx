import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout'
import { CollectionsPage } from '@/features/collections/components/collections-page'

export const Route = createFileRoute('/collections/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DashboardLayout>
      <CollectionsPage />
    </DashboardLayout>
  )
}
