import { useState, useMemo } from "react";
import type { Template, TemplateBackground } from "../../types/template.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CertificateViewer,
  type TemplateData,
} from "@/features/certificates/components/certificate-viewer";
import { mockCertificateEvents } from "@/shared/data/certificate-events";
import { mockCertificateLedger } from "@/shared/data/certificate-ledger";
import {
  generateOrigynViews,
  DEFAULT_TEMPLATE_VERSION,
  type ParsedOrigynMetadata,
} from "@/features/template-renderer";

interface TemplateWithBackground extends Template {
  backgroundType?: "standard" | "custom";
  customBackgroundImage?: string;
}

interface PreviewDeployStepProps {
  selectedTemplate: TemplateWithBackground | null;
  onBack?: () => void;
  onComplete?: () => void;
  onDeploy?: (template: Template) => Promise<void>;
  isDeploying?: boolean;
}

// Template Preview Section Component
function TemplatePreviewSection({
  selectedTemplate,
}: {
  selectedTemplate: TemplateWithBackground | null;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Image Preview */}
      <div className="space-y-3 sm:space-y-4">
        <div className="aspect-square bg-[#f5f5f5] rounded-lg overflow-hidden max-w-[300px] sm:max-w-none mx-auto lg:mx-0">
          {selectedTemplate?.thumbnail ? (
            <img
              src={selectedTemplate.thumbnail}
              alt={selectedTemplate.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#69737c]">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-[#e1e1e1] rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm">Template Preview</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Template Information */}
      <div className="space-y-4 sm:space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg sm:text-xl font-medium text-[#222526]">
              {selectedTemplate?.name}
            </h3>
            {Boolean(selectedTemplate?.metadata?.premium) && (
              <Badge variant="secondary" className="bg-[#50be8f] text-white text-xs">
                Premium
              </Badge>
            )}
          </div>
          <p className="text-[#69737c] text-xs sm:text-sm leading-relaxed">
            {selectedTemplate?.description}
          </p>
        </div>

        {/* Template Stats */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <div className="bg-[#fcfafa] rounded-lg p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-[#69737c] uppercase tracking-wide mb-1">
              Used in
            </p>
            <p className="text-base sm:text-lg font-semibold text-[#222526]">
              {selectedTemplate?.certificateCount || 0} certificates
            </p>
          </div>
          <div className="bg-[#fcfafa] rounded-lg p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-[#69737c] uppercase tracking-wide mb-1">
              Category
            </p>
            <p className="text-base sm:text-lg font-semibold text-[#222526] capitalize">
              {selectedTemplate?.category}
            </p>
          </div>
        </div>

        <div className="bg-[#fcfafa] rounded-lg p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-[#69737c] uppercase tracking-wide mb-2">
            Background Type
          </p>
          {(() => {
            // Check both local UI state and saved structure
            const isCustom = selectedTemplate?.backgroundType === "custom" ||
              selectedTemplate?.structure?.background?.type === "custom";
            const customImage = selectedTemplate?.customBackgroundImage ||
              selectedTemplate?.structure?.background?.dataUri;
            const isVideo = customImage?.startsWith('data:video') ||
              selectedTemplate?.structure?.background?.mediaType === 'video';

            return (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  {isCustom ? (
                    <div className="contents">
                      <Badge variant="outline" className="text-xs">
                        Custom
                      </Badge>
                      <span className="text-xs sm:text-sm text-[#222526]">
                        Custom background {isVideo ? 'video' : 'image'} uploaded
                      </span>
                    </div>
                  ) : (
                    <div className="contents">
                      <Badge variant="outline" className="text-xs">
                        Standard
                      </Badge>
                      <span className="text-xs sm:text-sm text-[#222526]">
                        Default ORIGYN background
                      </span>
                    </div>
                  )}
                </div>
                {isCustom && customImage && (
                  <div className="mt-3">
                    <p className="text-xs text-[#69737c] mb-1">Preview</p>
                    <div className="w-full h-20 sm:h-24 rounded border border-[#e1e1e1] overflow-hidden">
                      {isVideo ? (
                        <video
                          src={customImage}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                          autoPlay
                        />
                      ) : (
                        <img
                          src={customImage}
                          alt="Custom background"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>

        {/* Company Info (if available) */}
        {Boolean(selectedTemplate?.metadata?.company) && (
          <div className="bg-[#fcfafa] rounded-lg p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-[#69737c] uppercase tracking-wide mb-2">
              Company
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-medium text-[#222526]">
                {String(selectedTemplate?.metadata?.company)}
              </span>
              {Boolean(selectedTemplate?.metadata?.verified) && (
                <Badge variant="outline" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Placeholder SVG for company logo preview (simple company icon)
const PLACEHOLDER_LOGO_SVG = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40"><rect fill="#e1e1e1" width="120" height="40" rx="4"/><text x="60" y="24" font-family="system-ui, sans-serif" font-size="12" fill="#69737c" text-anchor="middle">Company Logo</text></svg>`)}`;

// Mock form data for preview
const MOCK_PREVIEW_DATA: Record<string, string> = {
  company_logo: PLACEHOLDER_LOGO_SVG,
  company_name: "Sample Company",
  vat_number: "IT01450040702",
  certification_expiration: "2024-12-31",
  certification_date: "2024-01-15",
  certified_by: "Federitaly",
  short_description:
    "This is a sample company description for preview purposes.",
  about_company:
    "Founded in 1990, Sample Company has been a leader in Italian craftsmanship for over 30 years.",
  founding_year: "1990",
  location: "Milan, Lombardy, Italy",
  website: "https://samplecompany.it",
  craftsmanship:
    "Traditional Italian techniques passed down through generations.",
  materials: "Premium Italian leather and sustainable materials.",
  production_process:
    "Our manufacturing process ensures quality and authenticity at every step.",
};

// Certificate Preview Component using CertificateViewer with templateData
function CertificatePreview({
  selectedTemplate,
  selectedLanguage,
}: {
  selectedTemplate: TemplateWithBackground | null;
  selectedLanguage: string;
}) {
  // Generate ORIGYN views from template structure (if available)
  const origynViews = useMemo(() => {
    if (!selectedTemplate?.structure) return null;
    try {
      return generateOrigynViews(selectedTemplate.structure);
    } catch (error) {
      console.error("Failed to generate ORIGYN views:", error);
      return null;
    }
  }, [selectedTemplate?.structure]);

  // Build background configuration from template state
  // Check both local UI state (during creation) and saved structure (when editing)
  const background: TemplateBackground | undefined = useMemo(() => {
    // First check local UI state properties (used during new template creation)
    if (selectedTemplate?.backgroundType === 'custom' && selectedTemplate.customBackgroundImage) {
      return {
        type: 'custom',
        dataUri: selectedTemplate.customBackgroundImage,
        mediaType: selectedTemplate.customBackgroundImage.startsWith('data:video') ? 'video' as const : 'image' as const,
      };
    }
    // Then check saved structure (used when editing existing templates)
    if (selectedTemplate?.structure?.background?.type === 'custom' && selectedTemplate.structure.background.dataUri) {
      return selectedTemplate.structure.background;
    }
    return { type: 'standard' };
  }, [selectedTemplate?.backgroundType, selectedTemplate?.customBackgroundImage, selectedTemplate?.structure?.background]);

  // Build templateData for CertificateViewer
  const templateData: TemplateData | undefined = useMemo(() => {
    if (!origynViews) return undefined;

    // Create mock parsed metadata for preview
    const mockMetadata: ParsedOrigynMetadata = {
      metadata: MOCK_PREVIEW_DATA,
      templates: {
        certificateTemplate: origynViews.certificateTemplate,
        template: origynViews.template,
        userViewTemplate: origynViews.userViewTemplate,
        formTemplate: origynViews.formTemplate,
        languages: origynViews.languages,
      },
      library: [],
      tokenId: "preview-token",
      canisterId: "preview-canister",
      templateVersion: DEFAULT_TEMPLATE_VERSION,
    };

    return {
      certificateTemplate: origynViews.certificateTemplate,
      template: origynViews.template,
      userViewTemplate: origynViews.userViewTemplate,
      metadata: mockMetadata,
      canisterId: "preview-canister",
      tokenId: "preview-token",
      language: selectedLanguage,
      showPlaceholders: true, // Enable placeholders for custom fields in preview
      background, // Pass background for custom image/video rendering
    };
  }, [origynViews, selectedLanguage, background]);

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-semibold text-[#222526] mb-1 sm:mb-2">
          Certificate Preview
        </h3>
        <p className="text-[#69737c] text-sm sm:text-base">
          Preview how your certificate will look with{" "}
          {(selectedTemplate?.backgroundType === "custom" || selectedTemplate?.structure?.background?.type === "custom")
            ? "your custom background"
            : "the standard ORIGYN background"}
        </p>
      </div>

      {/* Certificate Viewer with templateData */}
      {templateData ? (
        <CertificateViewer
          templateData={templateData}
          eventsData={mockCertificateEvents}
          ledgerData={mockCertificateLedger}
        />
      ) : (
        <div className="bg-[#f5f5f5] rounded-lg p-8 sm:p-12 text-center">
          <p className="text-[#69737c] text-sm sm:text-base">
            No template structure available for preview.
            <br />
            Please select a template with a defined structure.
          </p>
        </div>
      )}
    </div>
  );
}

export function PreviewDeployStep({
  selectedTemplate,
  onBack,
  onComplete,
  onDeploy,
  isDeploying = false,
}: PreviewDeployStepProps) {
  // Language selection for template preview
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleDeploy = async () => {
    if (!selectedTemplate) return;

    // If onDeploy is provided, use it (async backend deployment)
    if (onDeploy) {
      await onDeploy(selectedTemplate);
    }

    // Call onComplete after deployment (navigation)
    if (onComplete) {
      onComplete();
    }
  };

  // Get available languages from template
  const availableLanguages = useMemo(() => {
    if (!selectedTemplate?.structure?.languages) {
      return [{ code: "en", name: "English" }];
    }
    return selectedTemplate.structure.languages.map((lang) => ({
      code: lang.code,
      name: lang.name,
    }));
  }, [selectedTemplate?.structure?.languages]);

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-1 sm:space-y-2">
        <h1 className="text-xl sm:text-2xl font-medium text-[#222526]">
          Preview & deploy
        </h1>
        <p className="text-[#69737c] text-sm sm:text-base">
          Review your template: {selectedTemplate?.name || "Untitled Template"}
        </p>
      </div>

      {/* Template Preview Section */}
      <TemplatePreviewSection selectedTemplate={selectedTemplate} />

      {/* Language Selector (when template has multiple languages) */}
      {availableLanguages.length > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
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

      {/* Certificate Preview Section */}
      <CertificatePreview
        selectedTemplate={selectedTemplate}
        selectedLanguage={selectedLanguage}
      />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center pt-4 sm:pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isDeploying}
          className="w-full sm:w-auto px-8 order-2 sm:order-1"
        >
          Back
        </Button>
        <Button
          onClick={handleDeploy}
          disabled={isDeploying || !selectedTemplate}
          className="w-full sm:w-auto px-8 bg-[#222526] hover:bg-[#333333] order-1 sm:order-2"
        >
          {isDeploying ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Deploying...
            </span>
          ) : (
            "Deploy"
          )}
        </Button>
      </div>
    </div>
  );
}
