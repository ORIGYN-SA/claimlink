import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout'
import { NewTemplatePage } from '@/features/templates'

export const Route = createFileRoute('/templates/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DashboardLayout>
      <NewTemplatePage />
    </DashboardLayout>
  )
}
