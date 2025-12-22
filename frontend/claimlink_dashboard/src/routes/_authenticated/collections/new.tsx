import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout";
import { NewCollectionPage } from "@/features/collections";

export const Route = createFileRoute("/_authenticated/collections/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <NewCollectionPage />
    </DashboardLayout>
  );
}
