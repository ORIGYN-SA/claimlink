import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout";
import { CampaignDetailPage } from "@/features/campaigns/components/campaign-detail-page";

export const Route = createFileRoute("/_authenticated/campaigns/$campaigns/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <CampaignDetailPage />
    </DashboardLayout>
  );
}
