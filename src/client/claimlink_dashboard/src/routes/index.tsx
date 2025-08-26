import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout";
import { DashboardPage } from "@/features/dashboard";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  );
}
