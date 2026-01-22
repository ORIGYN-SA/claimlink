import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout";
import { EditUserPage } from "@/features/account";

export const Route = createFileRoute("/_authenticated/account/edit_user")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    userId: search.userId as string,
  }),
});

function RouteComponent() {
  const { userId } = Route.useSearch();

  return (
    <DashboardLayout>
      <EditUserPage userId={userId} />
    </DashboardLayout>
  );
}
