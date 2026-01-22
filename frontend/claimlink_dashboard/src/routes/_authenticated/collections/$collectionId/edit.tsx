import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout";
import { EditCollectionPage } from "@/features/collections";

export const Route = createFileRoute(
  "/_authenticated/collections/$collectionId/edit"
)({
  component: EditCollectionRoute,
});

function EditCollectionRoute() {
  const { collectionId } = Route.useParams();

  return (
    <DashboardLayout>
      <EditCollectionPage collectionId={collectionId} />
    </DashboardLayout>
  );
}
