import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout";
import { EditUserPage } from "@/features/account";

export const Route = createFileRoute("/_authenticated/account/users/$userId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useParams();

  return (
    <DashboardLayout>
      <EditUserPage userId={userId} />
    </DashboardLayout>
  );
}
