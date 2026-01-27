import { useMemo, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { usePublicCertificate } from "../api/certificates.queries";
import { CertificateLaunchpad } from "../components/certificate-launchpad";
import {
  CertificateViewer,
  type TemplateData,
} from "../components/certificate-viewer";
import { CertificateQRCode } from "../components/detail/certificate-qr-code";
import { QRCodeService } from "../api/qr.service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCollectionTemplate } from "@/features/collections";
import {
  generateOrigynViews,
  type ParsedOrigynMetadata,
} from "@/features/template-renderer";
import { toast } from "sonner";

export interface PublicCertificatePageProps {
  collectionId: string;
  tokenId: string;
}

/**
 * Public Certificate Page
 *
 * Full public-facing representation of a certificate without requiring authentication.
 * Displays the complete certificate including launchpad and dynamic template viewer.
 *
 * Key features:
 * - Works without login (uses unauthenticated agent)
 * - Shows full certificate with dynamic template rendering
 * - QR code display and download
 * - CTA to login for management features
 */
export const PublicCertificatePage = ({
  collectionId,
  tokenId,
}: PublicCertificatePageProps) => {
  const { data, isLoading, error } = usePublicCertificate(
    collectionId,
    tokenId,
  );
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch template for this collection from on-chain collection metadata
  const { data: templateStructure } = useCollectionTemplate({
    collectionId,
    enabled: !!collectionId,
  });

  // Build templateData for CertificateViewer
  const templateData: TemplateData | undefined = useMemo(() => {
    if (!data) return undefined;

    const { certificate, parsedMetadata } = data;
    const canisterId = collectionId;
    const token = tokenId;

    // If we have parsed metadata from on-chain, use it directly
    if (parsedMetadata?.templates?.certificateTemplate) {
      return {
        certificateTemplate: parsedMetadata.templates.certificateTemplate,
        template: parsedMetadata.templates.template,
        userViewTemplate: parsedMetadata.templates.userViewTemplate,
        metadata: parsedMetadata,
        canisterId,
        tokenId: token,
        language: "en",
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
            company_name: certificate.collectionName || "Unknown Company",
            certificate_title: certificate.title || "Certificate",
            certified_by: certificate.certifiedBy || "ORIGYN",
          },
          templates: {
            certificateTemplate: origynViews.certificateTemplate,
            template: origynViews.template,
            userViewTemplate: origynViews.userViewTemplate,
            formTemplate: origynViews.formTemplate,
            languages: origynViews.languages,
          },
          library: [],
          tokenId: token,
          canisterId,
        };

        return {
          certificateTemplate: origynViews.certificateTemplate,
          template: origynViews.template,
          userViewTemplate: origynViews.userViewTemplate,
          metadata: mockMetadata,
          canisterId,
          tokenId: token,
          language: "en",
          // Include background from template structure
          background: templateStructure.background,
        };
      } catch (error) {
        console.error("Failed to generate template views:", error);
        return undefined;
      }
    }

    return undefined;
  }, [data, templateStructure, collectionId, tokenId]);

  const handleDownloadQR = async () => {
    if (!qrCanvasRef.current || !data) {
      toast.error("QR code not ready");
      return;
    }

    try {
      const filename = QRCodeService.generateFilename(data.certificate.title);
      await QRCodeService.downloadQRCode(qrCanvasRef.current, filename);
      toast.success("QR code downloaded successfully!");
    } catch (error) {
      console.error("Failed to download QR code:", error);
      toast.error("Failed to download QR code");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcfafa] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-lg font-medium text-charcoal mb-2">
            Loading certificate...
          </div>
          <div className="text-slate">
            Please wait while we load the certificate.
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#fcfafa] flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-bold text-charcoal mb-4">
            Certificate Not Found
          </h1>
          <p className="text-slate mb-6">
            The certificate you're looking for could not be found or does not
            exist.
          </p>
          <p className="text-sm text-slate mb-6">
            Certificate ID: {collectionId}:{tokenId}
          </p>
          <Link to="/">
            <Button>Go to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const { certificate } = data;
  const qrValue = QRCodeService.getCertificateVerificationUrl(
    collectionId,
    tokenId,
  );

  return (
    <div className="min-h-screen bg-[#fcfafa]">
      {/* Hidden high-resolution QR code for download */}
      <div className="sr-only">
        <CertificateQRCode
          ref={qrCanvasRef}
          value={qrValue}
          size={512}
          level="M"
          showLogo={true}
        />
      </div>

      {/* Public Actions Bar - minimal actions for public users */}
      <div className="bg-white border-b border-[#e1e1e1] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-slate uppercase tracking-wider">
              ORIGYN Certificate
            </h2>
            <p className="text-xs text-slate mt-0.5">Public View</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDownloadQR} variant="outline" size="sm">
              Download QR Code
            </Button>
            <Link
              to="/login"
              search={{
                returnTo: `/mint_certificate/${collectionId}:${tokenId}`,
              }}
            >
              <Button size="sm">Login to Manage</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Certificate Launchpad Section */}
        <CertificateLaunchpad
          imageUrl={certificate.imageUrl}
          companyName={certificate.collectionName}
          isVerified={true}
          status={certificate.status}
          title={certificate.title}
          description={certificate.description || "ORIGYN Certified Asset"}
          issuerName={certificate.certifiedBy || "ORIGYN"}
          canisterId={collectionId}
          tokenId={tokenId}
          className="bg-[#fcfafa] rounded-tl-2xl rounded-tr-2xl"
        />

        {/* Certificate Viewer with Dynamic Template */}
        <CertificateViewer
          templateData={templateData}
          // Note: No eventsData or ledgerData for public view (requires auth)
        />

        {/* Login CTA Card */}
        <Card className="bg-azure/10 border-azure p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h3 className="font-semibold mb-2 text-charcoal">
                Need to manage this certificate?
              </h3>
              <p className="text-slate mb-4">
                Login to view transaction history, edit certificate details,
                transfer ownership, and access additional management features.
              </p>
            </div>
            <Link
              to="/login"
              search={{
                returnTo: `/mint_certificate/${collectionId}:${tokenId}`,
              }}
            >
              <Button>Login</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
