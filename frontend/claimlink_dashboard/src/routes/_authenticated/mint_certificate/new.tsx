import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout";
import { CreateCertificatePageV2 } from "@/features/certificates/components/create";

export const Route = createFileRoute("/_authenticated/mint_certificate/new")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    collectionId: search.collectionId as string | undefined,
  }),
});

function RouteComponent() {
  const { collectionId } = Route.useSearch();

  return (
    <DashboardLayout>
      <CreateCertificatePageV2 initialCollectionId={collectionId} />
    </DashboardLayout>
  );
}
