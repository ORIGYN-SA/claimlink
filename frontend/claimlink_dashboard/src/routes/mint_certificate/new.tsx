import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout'
// import { CreateCertificatePage } from '@/features/mint-certificate'
import { CreateCertificatePageV2 } from '@/features/mint-certificate'

export const Route = createFileRoute('/mint_certificate/new')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    collectionId: search.collectionId as string | undefined,
  }),
})

function RouteComponent() {
  const { collectionId } = Route.useSearch();

  return (
    <DashboardLayout>
      {/* <CreateCertificatePage /> */}
      <CreateCertificatePageV2 initialCollectionId={collectionId} />
    </DashboardLayout>
  )
}
