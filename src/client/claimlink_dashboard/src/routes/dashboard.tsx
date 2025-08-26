import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout";
import { DashboardPage } from "@/features/dashboard";

export const Route = createFileRoute("/dashboard")({
  component: DashboardRoute,
});

function DashboardRoute() {
  return (
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  );
}
