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
  VersionedTemplateRenderer,
  type TemplateNode,
  type ParsedOrigynMetadata,
  type RenderDataSource,
  resolveTokenAssetUrl,
  resolveCollectionAssetUrl,
} from "@/features/template-renderer";
import type { V2TemplateDocument, V2RenderDataSource, V2TokenData } from "@/features/template-renderer-v2";
import type { TemplateBackground } from "@/features/templates/types/template.types";
import {
  extractTextFromMetadata,
  extractImageFromMetadata,
} from "../utils/metadata-extractors";

/**
 * V2 template data for dynamic rendering
 */
export interface V2TemplateData {
  templateDocument: V2TemplateDocument;
  tokenData: V2TokenData;
  canisterId: string;
  tokenId: string;
  language?: string;
  showPlaceholders?: boolean;
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
  /** Whether to show placeholders for missing values (preview mode) */
  showPlaceholders?: boolean;
  /** Background configuration for certificate rendering */
  background?: TemplateBackground;
  /** Custom section title for the Information tab (e.g., "Made In Italy") */
  sectionTitle?: string;
  /** Custom stamp URL (overrides default stamp_standard.svg) */
  stampUrl?: string;
}

interface CertificateViewerProps {
  /** Template-based rendering data (required for display) — v1 tokens */
  templateData?: TemplateData;
  /** V2 template data — v2 tokens */
  v2TemplateData?: V2TemplateData;
  /** Events tab data (blockchain transaction history) */
  eventsData?: CertificateEventsData;
  /** Ledger tab data (blockchain ownership history) */
  ledgerData?: CertificateLedgerData;
  /** Callback when an event is added (to refresh data) */
  onEventAdded?: () => void;
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
    <div className="bg-[#222526] px-4 sm:px-16 py-6 sm:py-10 rounded-bl-[24px] rounded-br-[24px] w-full min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
      <p className="text-[#e1e1e1] text-base sm:text-xl text-center">{messages[tab] || "No data available"}</p>
    </div>
  );
}

export function CertificateViewer({
  templateData,
  v2TemplateData,
  eventsData,
  ledgerData,
  onEventAdded,
  className,
}: CertificateViewerProps) {
  const [activeTab, setActiveTab] = useState<CertificateTab>("certificate");

  const isV2 = !!v2TemplateData;

  // Create data source for template rendering (v1)
  const dataSource: RenderDataSource | null = templateData
    ? {
        type: 'onchain',
        metadata: templateData.metadata,
        showPlaceholders: templateData.showPlaceholders,
      }
    : null;

  // V2 data source
  const v2DataSource: V2RenderDataSource | null = v2TemplateData
    ? {
        type: 'onchain',
        tokenData: v2TemplateData.tokenData,
        showPlaceholders: v2TemplateData.showPlaceholders,
      }
    : null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "certificate":
        // V2: render via VersionedTemplateRenderer with templateDocument
        if (isV2 && v2TemplateData && v2DataSource) {
          return (
            <VersionedTemplateRenderer
              version="2.0.0"
              templateDocument={v2TemplateData.templateDocument}
              dataSource={v2DataSource}
              canisterId={v2TemplateData.canisterId}
              tokenId={v2TemplateData.tokenId}
              language={v2TemplateData.language || 'en'}
              activeViewId="certificate"
            />
          );
        }

        // V1: Use CertificateFrame wrapper with TemplateRenderer for content
        if (templateData?.certificateTemplate && dataSource) {
          // Get company logo from metadata if available (image field)
          const companyLogo = extractImageFromMetadata(
            templateData.metadata.metadata.company_logo,
            templateData.canisterId,
            templateData.tokenId
          );

          // Determine variant based on background type
          const variant = templateData.background?.type === 'custom' ? 'custom-certificate' : 'certificate';

          // Extract custom stamp URL from metadata
          const stampUrl = extractImageFromMetadata(
            templateData.metadata.metadata.stamp_upload,
            templateData.canisterId,
            templateData.tokenId
          ) || templateData.stampUrl;

          return (
            <CertificateFrame
              companyLogo={companyLogo}
              tokenId={templateData.tokenId}
              background={templateData.background}
              stampUrl={stampUrl}
            >
              <VersionedTemplateRenderer
                template={templateData.certificateTemplate}
                dataSource={dataSource}
                canisterId={templateData.canisterId}
                tokenId={templateData.tokenId}
                language={templateData.language || 'en'}
                variant={variant}
              />
            </CertificateFrame>
          );
        }
        return <NoDataPlaceholder tab="certificate" />;

      case "informations":
        // V2: render information view via VersionedTemplateRenderer
        if (isV2 && v2TemplateData && v2DataSource) {
          return (
            <VersionedTemplateRenderer
              version="2.0.0"
              templateDocument={v2TemplateData.templateDocument}
              dataSource={v2DataSource}
              canisterId={v2TemplateData.canisterId}
              tokenId={v2TemplateData.tokenId}
              language={v2TemplateData.language || 'en'}
              activeViewId="information"
            />
          );
        }

        // V1: Use InformationFrame wrapper with TemplateRenderer for content
        if (templateData?.template && dataSource) {
          const lang = templateData.language || 'en';

          // Extract title info from metadata using helper
          const companyName = extractTextFromMetadata(
            templateData.metadata.metadata.company_name,
            lang
          );
          const certificateTitle = extractTextFromMetadata(
            templateData.metadata.metadata.certificate_title,
            lang
          );
          const year = extractTextFromMetadata(
            templateData.metadata.metadata.certification_date,
            lang
          );

          // Extract gallery images from metadata.library
          const galleryImages: Array<{ url: string; legend: string }> =
            templateData.metadata.library
              .filter((item) => item.content_type?.startsWith('image/'))
              .map((item) => {
                // Check if library_id is already a full URL (from ClaimLink upload)
                // or a relative path (needs URL resolution)
                let url: string;
                if (item.library_id.startsWith('http://') || item.library_id.startsWith('https://')) {
                  // Already a full URL - use directly
                  url = item.library_id;
                } else {
                  // Relative path - resolve to full URL
                  url = item.location_type === 'collection'
                    ? resolveCollectionAssetUrl(templateData.canisterId, item.library_id)
                    : resolveTokenAssetUrl(templateData.canisterId, templateData.tokenId, item.library_id);
                }
                return {
                  url,
                  legend: item.title || item.filename || '',
                };
              });

          // Extract custom section title from metadata
          const sectionTitle = extractTextFromMetadata(
            templateData.metadata.metadata.__section_section_information_title,
            lang
          ) || templateData.sectionTitle;

          return (
            <InformationFrame
              title={{
                artistName: companyName,
                artworkTitle: certificateTitle,
                year: year,
              }}
              sectionTitle={sectionTitle}
              galleryImages={galleryImages}
            >
              <VersionedTemplateRenderer
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
          return (
            <CertificateEvents
              data={eventsData}
              canisterId={templateData?.canisterId}
              tokenId={templateData?.tokenId}
              onEventAdded={onEventAdded}
            />
          );
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
