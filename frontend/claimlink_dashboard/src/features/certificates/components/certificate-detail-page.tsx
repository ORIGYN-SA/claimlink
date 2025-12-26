import { useMemo, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CertificateDetailActions } from "./certificate-detail-actions";
import { CertificateLaunchpad } from "./certificate-launchpad";
import { CertificateViewer, type TemplateData } from "./certificate-viewer";
import { CertificateQRCode } from "./certificate-qr-code";
import { QRCodeService } from "../api/qr.service";
import type { Certificate } from "@/features/certificates";
import type { CertificateEventsData } from "./certificate-events";
import type { CertificateLedgerData } from "./certificate-ledger";
import { useCollectionTemplate } from "@/features/templates";
import {
  generateOrigynViews,
  type ParsedOrigynMetadata,
} from "@/features/template-renderer";
import { toast } from "sonner";

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
  const navigate = useNavigate();
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

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
    navigate({
      to: '/mint_certificate/$certificateId/edit',
      params: { certificateId: `${certificate.canisterId}:${certificate.tokenId || certificate.id}` },
    });
  };

  const handleLogEvent = () => {
    // TODO: Open log event dialog/page
    console.log("Log new event for certificate:", certificate.id);
  };

  const handleDownloadQR = async () => {
    if (!qrCanvasRef.current) {
      console.error('QR code canvas not available');
      toast.error('QR code not ready');
      return;
    }

    try {
      const filename = QRCodeService.generateFilename(certificate.title);
      await QRCodeService.downloadQRCode(qrCanvasRef.current, filename);
      toast.success('QR code downloaded successfully!');
    } catch (error) {
      console.error('Failed to download QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  const handleTransferOwnership = () => {
    // TODO: Open transfer ownership dialog
    console.log("Transfer ownership for certificate:", certificate.id);
  };

  return (
    <div className="space-y-6">
      {/* Hidden high-resolution QR code for download */}
      <div className="sr-only">
        <CertificateQRCode
          ref={qrCanvasRef}
          value={QRCodeService.getCertificateVerificationUrl(
            certificate.canisterId || '',
            certificate.tokenId || certificate.id
          )}
          size={512}
          level="M"
          showLogo={true}
        />
      </div>

      {/* Certificate Actions Component */}
      <CertificateDetailActions
        certificateId={certificate.id}
        currentStatus={certificate.status}
        unclaimedStatus={certificate.status === "Waiting"}
        shareLink={QRCodeService.getCertificateVerificationUrl(
          certificate.canisterId || '',
          certificate.tokenId || certificate.id
        )}
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
        canisterId={certificate.canisterId}
        tokenId={certificate.tokenId || certificate.id}
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
