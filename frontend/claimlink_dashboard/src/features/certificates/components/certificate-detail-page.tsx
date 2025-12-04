import { CertificateDetailActions } from "./certificate-detail-actions";
import { CertificateLaunchpad } from "./certificate-launchpad";
import { CertificateViewer } from "./certificate-viewer";
import type { Certificate } from "@/features/certificates";
import type { CertificateEventsData } from "./certificate-events";
import type { CertificateLedgerData } from "./certificate-ledger";

interface CertificateDetailPageProps {
  certificate: Certificate;
  eventsData?: CertificateEventsData;
  ledgerData?: CertificateLedgerData;
}

export function CertificateDetailPage({
  certificate,
  eventsData,
  ledgerData,
}: CertificateDetailPageProps) {
  console.log("[CertificateDetailPage] Rendering with data:", {
    certificate,
    hasEventsData: !!eventsData,
    hasLedgerData: !!ledgerData,
  });

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
        status={
          certificate.status === "Waiting" ? "Unclaimed" : certificate.status
        }
        title={certificate.title}
        description="Vinyl on wooden stretcher 222 x 110,3 cm | 87 x 43 in. Stored in a secured vault in Switzerland"
        issuerLogo="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=64&h=64&fit=crop"
        issuerName="Federitaly"
        qrCodeUrl="https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=https://claim.link/${certificate.id}"
        className="bg-[#fcfafa] rounded-tl-2xl rounded-tr-2xl"
      />

      {/* Certificate Viewer with Tabs */}
      {/*
        TEMPORARY: informationData not passed - Information tab will show "No information data available"
        TODO: When template system is ready:
        1. Fetch template by template_id from NFT metadata
        2. Parse metadata according to template schema
        3. Generate informationData dynamically based on template fields
        4. Pass informationData to CertificateViewer
      */}
      <CertificateViewer
        companyLogo="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=212&h=48&fit=crop"
        tokenId={certificate.id}
        certificateTitle={certificate.title}
        companyName={certificate.collectionName}
        certifiedBy={certificate.certifiedBy || "ORIGYN"}
        validUntil="N/A" // TODO: Get from metadata when available
        vatNumber="N/A" // TODO: Get from metadata when available
        signatureImage="https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=178&h=100&fit=crop"
        signerName="ORIGYN Network"
        signerTitle="Certificate Authority"
        eventsData={eventsData}
        ledgerData={ledgerData}
        //* informationData prop intentionally omitted until template system is ready */
      />

      {/* TODO: Add more certificate details sections here */}
      {/* - Event history/timeline */}
      {/* - Owner information */}
      {/* - Additional certificate details */}
    </div>
  );
}
