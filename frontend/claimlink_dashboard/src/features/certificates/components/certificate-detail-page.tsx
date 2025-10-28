import { CertificateDetailActions } from "./certificate-detail-actions";
import { CertificateLaunchpad } from "./certificate-launchpad";
import { CertificateViewer } from "./certificate-viewer";
import type { Certificate } from "@/features/certificates";
import { mockCertificateInformation } from "@/shared/data/certificate-information";
import { mockCertificateEvents } from "@/shared/data/certificate-events";
import { mockCertificateLedger } from "@/shared/data/certificate-ledger";

interface CertificateDetailPageProps {
  certificate: Certificate;
}

export function CertificateDetailPage({ certificate }: CertificateDetailPageProps) {

  const handleEditTemplate = () => {
    // TODO: Navigate to template edit page
    console.log("Edit template for certificate:", certificate.id);
  };

  const handleLogEvent = () => {
    // TODO: Open log event dialog/page
    console.log("Log new event for certificate:", certificate.id);
  };

  const handleDownloadQR = () => {
    // TODO: Implement QR code download
    console.log("Download QR for certificate:", certificate.id);
  };

  const handleTransferOwnership = () => {
    // TODO: Open transfer ownership dialog
    console.log("Transfer ownership for certificate:", certificate.id);
  };

  return (
    <div className="space-y-6">
      {/* Certificate Actions Component */}
      <CertificateDetailActions
        certificateId={certificate.id}
        currentStatus={certificate.status}
        unclaimedStatus={certificate.status === "Waiting"}
        shareLink={`https://claim.link/${certificate.id}`}
        onEditTemplate={handleEditTemplate}
        onLogEvent={handleLogEvent}
        onDownloadQR={handleDownloadQR}
        onTransferOwnership={handleTransferOwnership}
      />

      {/* Certificate Launchpad Section */}
      <CertificateLaunchpad
        imageUrl={certificate.imageUrl}
        companyName="COMPANY NAME"
        isVerified={true}
        status={certificate.status === "Waiting" ? "Unclaimed" : certificate.status}
        title={certificate.title}
        description="Vinyl on wooden stretcher 222 x 110,3 cm | 87 x 43 in. Stored in a secured vault in Switzerland"
        issuerLogo="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=64&h=64&fit=crop"
        issuerName="Federitaly"
        qrCodeUrl="https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=https://claim.link/${certificate.id}"
        className="bg-[#fcfafa] rounded-tl-2xl rounded-tr-2xl"
      />

      {/* Certificate Viewer with Tabs */}
      <CertificateViewer
        companyLogo="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=212&h=48&fit=crop"
        tokenId={certificate.id}
        certificateTitle="100% MADE IN ITALY CERTIFICATE"
        companyName="Cusco"
        certifiedBy="Federitaly"
        validUntil="18/02/2024"
        vatNumber="IT01450040702"
        signatureImage="https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=178&h=100&fit=crop"
        signerName="CARLO VERDONE"
        signerTitle="President Federitaly"
        informationData={mockCertificateInformation}
        eventsData={mockCertificateEvents}
        ledgerData={mockCertificateLedger}
      />

      {/* TODO: Add more certificate details sections here */}
      {/* - Event history/timeline */}
      {/* - Owner information */}
      {/* - Additional certificate details */}
    </div>
  );
}

