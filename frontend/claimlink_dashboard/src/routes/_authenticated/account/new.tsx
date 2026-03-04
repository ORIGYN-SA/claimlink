import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout";
import { CreateUserPage } from "@/features/account";

export const Route = createFileRoute("/_authenticated/account/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <CreateUserPage />
    </DashboardLayout>
  );
}
