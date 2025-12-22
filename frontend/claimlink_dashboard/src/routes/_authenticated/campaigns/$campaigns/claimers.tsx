import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout";
import { CampaignClaimersPage } from "@/features/campaigns/components/campaign-claimers-page";

export const Route = createFileRoute(
  "/_authenticated/campaigns/$campaigns/claimers"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { campaigns: campaignId } = Route.useParams();

  return (
    <DashboardLayout>
      <CampaignClaimersPage campaignId={campaignId} />
    </DashboardLayout>
  );
}
