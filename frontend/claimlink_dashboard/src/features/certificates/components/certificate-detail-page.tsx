import { useMemo } from "react";
import { CertificateDetailActions } from "./certificate-detail-actions";
import { CertificateLaunchpad } from "./certificate-launchpad";
import { CertificateViewer, type TemplateData } from "./certificate-viewer";
import type { Certificate } from "@/features/certificates";
import type { CertificateEventsData } from "./certificate-events";
import type { CertificateLedgerData } from "./certificate-ledger";
import { useCollectionTemplate } from "@/features/templates";
import {
  generateOrigynViews,
  type ParsedOrigynMetadata,
} from "@/features/template-renderer";

interface CertificateDetailPageProps {
  certificate: Certificate;
  /** Parsed metadata from on-chain NFT (if available) */
  parsedMetadata?: ParsedOrigynMetadata;
  eventsData?: CertificateEventsData;
  ledgerData?: CertificateLedgerData;
}

export function CertificateDetailPage({
  certificate,
  parsedMetadata,
  eventsData,
  ledgerData,
}: CertificateDetailPageProps) {
  // Fetch template for this collection (uses mock templates for now)
  const { data: template } = useCollectionTemplate(certificate.canisterId || '');

  // Build templateData for CertificateViewer
  const templateData: TemplateData | undefined = useMemo(() => {
    const canisterId = certificate.canisterId || 'unknown-canister';
    const tokenId = certificate.tokenId || certificate.id;

    // If we have parsed metadata from on-chain, use it directly
    if (parsedMetadata?.templates?.certificateTemplate) {
      return {
        certificateTemplate: parsedMetadata.templates.certificateTemplate,
        template: parsedMetadata.templates.template,
        userViewTemplate: parsedMetadata.templates.userViewTemplate,
        metadata: parsedMetadata,
        canisterId,
        tokenId,
        language: 'en',
      };
    }

    // Otherwise, generate views from mock template
    if (template?.structure) {
      try {
        const origynViews = generateOrigynViews(template.structure);

        // Build mock metadata from certificate data
        const mockMetadata: ParsedOrigynMetadata = {
          metadata: {
            company_name: certificate.collectionName || 'Unknown Company',
            certificate_title: certificate.title || 'Certificate',
            certified_by: certificate.certifiedBy || 'ORIGYN',
            // Add more fields as available from certificate
          },
          templates: {
            certificateTemplate: origynViews.certificateTemplate,
            template: origynViews.template,
            userViewTemplate: origynViews.userViewTemplate,
            formTemplate: origynViews.formTemplate,
            languages: origynViews.languages,
          },
          library: [],
          tokenId,
          canisterId,
        };

        return {
          certificateTemplate: origynViews.certificateTemplate,
          template: origynViews.template,
          userViewTemplate: origynViews.userViewTemplate,
          metadata: mockMetadata,
          canisterId,
          tokenId,
          language: 'en',
        };
      } catch (error) {
        console.error('Failed to generate template views:', error);
        return undefined;
      }
    }

    return undefined;
  }, [certificate, parsedMetadata, template]);

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
        companyName={certificate.collectionName || "COMPANY NAME"}
        isVerified={true}
        status={
          certificate.status === "Waiting" ? "Unclaimed" : certificate.status
        }
        title={certificate.title}
        description={certificate.description || "Certificate details"}
        issuerLogo="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=64&h=64&fit=crop"
        issuerName={certificate.certifiedBy || "ORIGYN"}
        qrCodeUrl={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=https://claim.link/${certificate.id}`}
        className="bg-[#fcfafa] rounded-tl-2xl rounded-tr-2xl"
      />

      {/* Certificate Viewer with Tabs */}
      <CertificateViewer
        templateData={templateData}
        eventsData={eventsData}
        ledgerData={ledgerData}
      />
    </div>
  );
}
