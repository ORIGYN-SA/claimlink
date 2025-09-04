// src/routes/collections/$collectionId.tsx
import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout'
import { CollectionDetailPage } from '@/features/collections'

export const Route = createFileRoute('/collections/$collectionId')({
  component: CollectionDetailRoute,
  // Optional: Add a loader for data fetching
  loader: async ({ params }) => {
    // You can prefetch collection data here
    return { collectionId: params.collectionId }
  },
  // Optional: Add error boundary
  errorComponent: ({ error }) => <div>Error loading collection: {error.message}</div>,
})

function CollectionDetailRoute() {
  const { collectionId } = Route.useParams()
  
  return (
    <DashboardLayout>
      <CollectionDetailPage collectionId={collectionId} />
    </DashboardLayout>
  )
}