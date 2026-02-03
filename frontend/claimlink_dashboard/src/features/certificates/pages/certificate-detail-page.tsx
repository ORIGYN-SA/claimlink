import { useMemo, useRef, useState } from "react";
import { CertificateDetailActions } from "../components/certificate-detail-actions";
import { CertificateLaunchpad } from "../components/certificate-launchpad";
import { CertificateViewer, type TemplateData } from "../components/certificate-viewer";
import { CertificateQRCode } from "../components/detail/certificate-qr-code";
import { QRCodeService } from "../api/qr.service";
import type { Certificate } from "@/features/certificates";
import type { CertificateEventsData } from "../components/detail/certificate-events";
import type { CertificateLedgerData } from "../components/detail/certificate-ledger";
import { useCollectionTemplate } from "@/features/collections";
import {
  generateOrigynViews,
  DEFAULT_TEMPLATE_VERSION,
  type ParsedOrigynMetadata,
} from "@/features/template-renderer";
import { toast } from "sonner";
import {
  extractTextFromMetadata,
  extractImageFromMetadata,
} from "../utils/metadata-extractors";
import { Button } from "@/components/ui/button";

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
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Fetch template for this collection from on-chain collection metadata
  const { data: templateStructure } = useCollectionTemplate({
    collectionId: certificate.canisterId || '',
    enabled: !!certificate.canisterId,
  });

  // Get available languages from template or parsedMetadata
  const availableLanguages = useMemo(() => {
    // First try parsed metadata (from on-chain)
    if (parsedMetadata?.templates?.languages && parsedMetadata.templates.languages.length > 0) {
      return parsedMetadata.templates.languages.map((lang) => ({
        code: lang.key || 'en',
        name: lang.name || lang.key || 'English',
      }));
    }
    // Then try template structure
    if (templateStructure?.languages && templateStructure.languages.length > 0) {
      return templateStructure.languages.map((lang) => ({
        code: lang.code,
        name: lang.name,
      }));
    }
    return [{ code: "en", name: "English" }];
  }, [parsedMetadata?.templates?.languages, templateStructure?.languages]);

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
        language: selectedLanguage,
        // Include background from template structure if available
        background: templateStructure?.background,
      };
    }

    // Otherwise, generate views from collection's template structure
    if (templateStructure) {
      try {
        const origynViews = generateOrigynViews(templateStructure);

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
          templateVersion: DEFAULT_TEMPLATE_VERSION,
        };

        return {
          certificateTemplate: origynViews.certificateTemplate,
          template: origynViews.template,
          userViewTemplate: origynViews.userViewTemplate,
          metadata: mockMetadata,
          canisterId,
          tokenId,
          language: selectedLanguage,
          // Include background from template structure
          background: templateStructure.background,
        };
      } catch (error) {
        console.error('Failed to generate template views:', error);
        return undefined;
      }
    }

    return undefined;
  }, [certificate, parsedMetadata, templateStructure, selectedLanguage]);

  // Extract issuer info from on-chain metadata
  const issuerInfo = useMemo(() => {
    const canisterId = certificate.canisterId || '';
    const tokenId = certificate.tokenId || certificate.id;

    if (parsedMetadata?.metadata) {
      const companyLogo = extractImageFromMetadata(
        parsedMetadata.metadata.company_logo,
        canisterId,
        tokenId
      );
      const companyName = extractTextFromMetadata(
        parsedMetadata.metadata.company_name
      ) || extractTextFromMetadata(
        parsedMetadata.metadata.name
      );

      return {
        logo: companyLogo,
        name: companyName || certificate.collectionName || 'ORIGYN',
      };
    }

    return {
      logo: undefined,
      name: certificate.collectionName || 'ORIGYN',
    };
  }, [certificate, parsedMetadata]);

  // DISABLED: Certificate editing has been removed. Certificates are immutable after minting.
  // const handleEditTemplate = () => {
  //   navigate({
  //     to: '/mint_certificate/$certificateId/edit',
  //     params: { certificateId: `${certificate.canisterId}:${certificate.tokenId || certificate.id}` },
  //   });
  // };

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
        // onEditTemplate={handleEditTemplate} // DISABLED: Certificate editing removed
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
        issuerLogo={issuerInfo.logo}
        issuerName={issuerInfo.name}
        canisterId={certificate.canisterId}
        tokenId={certificate.tokenId || certificate.id}
        className="bg-[#fcfafa] rounded-tl-2xl rounded-tr-2xl"
      />

      {/* Language Selector (when template has multiple languages) */}
      {availableLanguages.length > 1 && (
        <div className="flex justify-center gap-2 flex-wrap py-2">
          {availableLanguages.map((lang) => (
            <Button
              key={lang.code}
              variant={selectedLanguage === lang.code ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLanguage(lang.code)}
              className={`text-xs sm:text-sm ${selectedLanguage === lang.code ? "bg-[#222526]" : ""}`}
            >
              {lang.name}
            </Button>
          ))}
        </div>
      )}

      {/* Certificate Viewer with Tabs */}
      <CertificateViewer
        templateData={templateData}
        eventsData={eventsData}
        ledgerData={ledgerData}
      />
    </div>
  );
}
