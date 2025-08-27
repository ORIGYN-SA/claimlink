import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout'
import { TemplatesPage } from '@/features/templates'

export const Route = createFileRoute('/templates')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DashboardLayout>
      <TemplatesPage />
    </DashboardLayout>
  )
}
