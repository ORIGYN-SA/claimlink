import { useState } from "react";
import { CertificateTabs, type CertificateTab } from "./detail/certificate-tabs";
import {
  CertificateEvents,
  type CertificateEventsData,
} from "./detail/certificate-events";
import {
  CertificateLedger,
  type CertificateLedgerData,
} from "./detail/certificate-ledger";
import { CertificateFrame } from "./certificate-frame";
import { InformationFrame } from "./information-frame";
import {
  TemplateRenderer,
  type TemplateNode,
  type ParsedOrigynMetadata,
  type RenderDataSource,
  type MetadataFieldValue,
} from "@/features/template-renderer";

/**
 * Helper to extract string value from metadata field
 * Handles both plain strings and MetadataFieldValue objects
 */
function extractMetadataValue(
  value: unknown,
  language: string = 'en'
): string | undefined {
  if (!value) return undefined;

  // Plain string
  if (typeof value === 'string') return value;

  // MetadataFieldValue object
  if (typeof value === 'object' && value !== null && 'content' in value) {
    const metaValue = value as MetadataFieldValue;
    const content = metaValue.content;

    // String content
    if (typeof content === 'string') return content;

    // Localized content object
    if (typeof content === 'object' && content !== null && !('date' in content)) {
      const localized = content as Record<string, string>;
      // Try requested language first, then English, then first available
      if (localized[language]) return localized[language];
      if (localized['en']) return localized['en'];
      const keys = Object.keys(localized);
      if (keys.length > 0) return localized[keys[0]];
    }

    // Date content - format it
    if (typeof content === 'object' && content !== null && 'date' in content) {
      const date = new Date((content as { date: number }).date);
      return date.toLocaleDateString();
    }
  }

  return undefined;
}

/**
 * Template data for dynamic rendering from ORIGYN NFT metadata
 */
export interface TemplateData {
  /** Template nodes for certificate view */
  certificateTemplate?: TemplateNode[];
  /** Template nodes for experience/information view */
  template?: TemplateNode[];
  /** Template nodes for user view (summary) */
  userViewTemplate?: TemplateNode[];
  /** Parsed ORIGYN metadata */
  metadata: ParsedOrigynMetadata;
  /** Canister ID containing the NFT */
  canisterId: string;
  /** Token ID within the canister */
  tokenId: string;
  /** Language code for display */
  language?: string;
}

interface CertificateViewerProps {
  /** Template-based rendering data (required for display) */
  templateData?: TemplateData;
  /** Events tab data (blockchain transaction history) */
  eventsData?: CertificateEventsData;
  /** Ledger tab data (blockchain ownership history) */
  ledgerData?: CertificateLedgerData;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Placeholder component for tabs without data
 */
function NoDataPlaceholder({ tab }: { tab: string }) {
  const messages: Record<string, string> = {
    certificate: "No certificate template available",
    informations: "No information available",
    events: "No events recorded yet",
    ledger: "No ledger entries available",
  };

  return (
    <div className="bg-[#222526] px-16 py-10 rounded-bl-[24px] rounded-br-[24px] w-full min-h-[400px] flex items-center justify-center">
      <p className="text-[#e1e1e1] text-xl">{messages[tab] || "No data available"}</p>
    </div>
  );
}

export function CertificateViewer({
  templateData,
  eventsData,
  ledgerData,
  className,
}: CertificateViewerProps) {
  const [activeTab, setActiveTab] = useState<CertificateTab>("certificate");

  // Create data source for template rendering
  const dataSource: RenderDataSource | null = templateData
    ? {
        type: 'onchain',
        metadata: templateData.metadata,
      }
    : null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "certificate":
        // Use CertificateFrame wrapper with TemplateRenderer for content
        if (templateData?.certificateTemplate && dataSource) {
          // Get company logo from metadata if available
          const companyLogo = extractMetadataValue(
            templateData.metadata.metadata.company_logo,
            templateData.language || 'en'
          );

          return (
            <CertificateFrame
              companyLogo={companyLogo}
              tokenId={templateData.tokenId}
            >
              <TemplateRenderer
                template={templateData.certificateTemplate}
                dataSource={dataSource}
                canisterId={templateData.canisterId}
                tokenId={templateData.tokenId}
                language={templateData.language || 'en'}
                variant="certificate"
              />
            </CertificateFrame>
          );
        }
        return <NoDataPlaceholder tab="certificate" />;

      case "informations":
        // Use InformationFrame wrapper with TemplateRenderer for content
        if (templateData?.template && dataSource) {
          const lang = templateData.language || 'en';

          // Extract title info from metadata using helper
          const companyName = extractMetadataValue(
            templateData.metadata.metadata.company_name,
            lang
          );
          const certificateTitle = extractMetadataValue(
            templateData.metadata.metadata.certificate_title,
            lang
          );
          const year = extractMetadataValue(
            templateData.metadata.metadata.certification_date,
            lang
          );

          // TODO: Extract gallery images from metadata.library when available
          const galleryImages: Array<{ url: string; legend: string }> = [];

          return (
            <InformationFrame
              title={{
                artistName: companyName,
                artworkTitle: certificateTitle,
                year: year,
              }}
              galleryImages={galleryImages}
            >
              <TemplateRenderer
                template={templateData.template}
                dataSource={dataSource}
                canisterId={templateData.canisterId}
                tokenId={templateData.tokenId}
                language={templateData.language || 'en'}
                variant="information"
              />
            </InformationFrame>
          );
        }
        return <NoDataPlaceholder tab="informations" />;

      case "events":
        // Events tab shows blockchain event data
        if (eventsData) {
          return <CertificateEvents data={eventsData} />;
        }
        return <NoDataPlaceholder tab="events" />;

      case "ledger":
        // Ledger tab shows blockchain ownership history
        if (ledgerData) {
          return <CertificateLedger data={ledgerData} />;
        }
        return <NoDataPlaceholder tab="ledger" />;

      default:
        return null;
    }
  };

  return (
    <div className={`w-full ${className || ""}`}>
      <CertificateTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {renderTabContent()}
    </div>
  );
}
