import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { CreateCertificatePageV2 } from '@/features/certificates/components/create/create-certificate-page-v2';

export const Route = createFileRoute(
  '/_authenticated/mint_certificate/$certificateId/edit'
)({
  component: EditCertificateRoute,
});

function EditCertificateRoute() {
  const { certificateId } = Route.useParams();

  return (
    <DashboardLayout>
      <CreateCertificatePageV2
        mode="edit"
        certificateId={certificateId}
      />
    </DashboardLayout>
  );
}
