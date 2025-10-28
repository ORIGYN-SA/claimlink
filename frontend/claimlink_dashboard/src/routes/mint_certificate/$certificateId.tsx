import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/components/layout';
import { CertificateDetailPage } from '@/features/certificates';
import { getCertificateById } from '@/shared/data';

export const Route = createFileRoute('/mint_certificate/$certificateId')({
  component: CertificateDetailRoute,
});

function CertificateDetailRoute() {
  const { certificateId } = Route.useParams();
  
  // Get certificate data (using mock data for now)
  const certificate = getCertificateById(certificateId);

  // Handle certificate not found
  if (!certificate) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#222526] mb-2">
              Certificate not found
            </h2>
            <p className="text-[#69737c]">
              The certificate with ID "{certificateId}" could not be found.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <CertificateDetailPage certificate={certificate} />
    </DashboardLayout>
  );
}
