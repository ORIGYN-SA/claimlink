// src/routes/templates/$templateId.tsx
import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout'
import { EditTemplatePage } from '@/features/templates'

export const Route = createFileRoute('/templates/$templateId')({
  component: TemplateDetailRoute,
  // Optional: Add a loader for data fetching
  loader: async ({ params }) => {
    // You can prefetch template data here
    return { templateId: params.templateId }
  },
  // Optional: Add error boundary
  errorComponent: ({ error }) => <div>Error loading template: {error.message}</div>,
})

function TemplateDetailRoute() {
  const { templateId } = Route.useParams()
  
  return (
    <DashboardLayout>
      <EditTemplatePage templateId={templateId} />
    </DashboardLayout>
  )
}