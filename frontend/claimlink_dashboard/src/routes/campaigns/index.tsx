import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/components/layout';
import { CampaignsPage } from '@/features/campaigns';

export const Route = createFileRoute('/campaigns/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <CampaignsPage />
    </DashboardLayout>
  );
}
