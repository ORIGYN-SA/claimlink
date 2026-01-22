import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout";
import { CollectionDetailPage } from "@/features/collections";

export const Route = createFileRoute(
  "/_authenticated/collections/$collectionId/"
)({
  component: CollectionDetailRoute,
  loader: async ({ params }) => {
    return { collectionId: params.collectionId };
  },
  errorComponent: ({ error }) => (
    <div>Error loading collection: {error.message}</div>
  ),
});

function CollectionDetailRoute() {
  const { collectionId } = Route.useParams();

  return (
    <DashboardLayout>
      <CollectionDetailPage collectionId={collectionId} />
    </DashboardLayout>
  );
}
