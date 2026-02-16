/**
 * Certificate Preview Modal
 *
 * Displays a full preview of the certificate before minting.
 * Builds TemplateData from form data and renders using CertificateViewer.
 */

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  CertificateViewer,
  type TemplateData,
} from "../certificate-viewer";
import type { Template } from "@/shared/data/templates";
import type { CertificateFormData } from "@/features/templates/types/template.types";
import {
  generateOrigynViews,
  DEFAULT_TEMPLATE_VERSION,
  type ParsedOrigynMetadata,
  type FileReference,
} from "@/features/template-renderer";

interface CertificatePreviewModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close the modal */
  onClose: () => void;
  /** Proceed to mint */
  onConfirmMint: () => void;
  /** The selected template */
  template: Template;
  /** Current form data */
  formData: CertificateFormData;
  /** File fields from form (field ID -> files) */
  fileFields: Map<string, File[]>;
  /** Whether the mint button should be disabled */
  isMinting?: boolean;
}

/**
 * Build preview metadata from form data.
 * Converts form state + file object URLs into ParsedOrigynMetadata format.
 */
function buildPreviewMetadata(
  formData: CertificateFormData,
  fileFields: Map<string, File[]>,
  template: Template,
): { metadata: ParsedOrigynMetadata; fileUrls: Map<string, string> } {
  const fileUrls = new Map<string, string>();

  // Build metadata fields
  const metadataFields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(formData)) {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      fileUrls.set(key, url);
      metadataFields[key] = [{ id: value.name, path: url }] as FileReference[];
    } else if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
      const refs = (value as File[]).map((file) => {
        const url = URL.createObjectURL(file);
        fileUrls.set(`${key}_${file.name}`, url);
        return { id: file.name, path: url } as FileReference;
      });
      metadataFields[key] = refs;
    } else if (typeof value === "string") {
      metadataFields[key] = {
        language: "true",
        content: { en: value },
      };
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // LocalizedValue
      metadataFields[key] = {
        language: "true",
        content: value,
      };
    }
  }

  // Also add file fields from the state (only actual File objects)
  fileFields.forEach((files, fieldId) => {
    if (files.length > 0) {
      const actualFiles = files.filter((f): f is File => f instanceof File);
      if (actualFiles.length === 0) return;

      const refs = actualFiles.map((file) => {
        const url = URL.createObjectURL(file);
        fileUrls.set(`${fieldId}_${file.name}`, url);
        return { id: file.name, path: url } as FileReference;
      });
      metadataFields[fieldId] = refs;
    }
  });

  // Generate template views
  const structure = template.structure!;
  const origynViews = generateOrigynViews(structure);

  const parsedMetadata: ParsedOrigynMetadata = {
    metadata: metadataFields as ParsedOrigynMetadata["metadata"],
    templates: {
      certificateTemplate: origynViews.certificateTemplate,
      template: origynViews.template,
      userViewTemplate: origynViews.userViewTemplate,
      formTemplate: origynViews.formTemplate,
      languages: origynViews.languages,
    },
    library: [],
    tokenId: "preview",
    canisterId: "preview",
    templateVersion: DEFAULT_TEMPLATE_VERSION,
  };

  return { metadata: parsedMetadata, fileUrls };
}

export function CertificatePreviewModal({
  isOpen,
  onClose,
  onConfirmMint,
  template,
  formData,
  fileFields,
  isMinting = false,
}: CertificatePreviewModalProps) {
  // Build template data for preview
  const templateData = useMemo(() => {
    if (!isOpen || !template.structure) {
      return undefined;
    }

    const { metadata } = buildPreviewMetadata(formData, fileFields, template);
    const origynViews = generateOrigynViews(template.structure);

    // Extract section title from form data
    const sectionTitle =
      (formData.__section_section_information_title as string) ||
      template.structure.sections.find((s) => s.name === "Information")?.displayName;

    // Extract stamp URL if custom stamp was uploaded
    const stampFiles = fileFields.get("stamp_upload");
    let stampUrl: string | undefined;
    if (stampFiles && stampFiles.length > 0 && stampFiles[0] instanceof File) {
      stampUrl = URL.createObjectURL(stampFiles[0]);
    }

    const data: TemplateData = {
      certificateTemplate: origynViews.certificateTemplate,
      template: origynViews.template,
      userViewTemplate: origynViews.userViewTemplate,
      metadata,
      canisterId: "preview",
      tokenId: "preview",
      language: "en",
      showPlaceholders: true,
      background: template.structure.background,
      sectionTitle,
      stampUrl,
    };

    return data;
  }, [isOpen, template, formData, fileFields]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto">
      {/* Modal */}
      <div className="relative w-full max-w-5xl mx-4 my-8 bg-[#fcfafa] rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-[#e1e1e1] rounded-t-2xl">
          <h2 className="text-lg font-semibold text-[#222526]">
            Certificate Preview
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors"
            aria-label="Close preview"
          >
            <X className="w-5 h-5 text-[#69737c]" />
          </button>
        </div>

        {/* Content - scale certificate to fit modal */}
        <div className="p-6 overflow-hidden">
          {templateData ? (
            <div className="flex justify-center">
              <div
                className="origin-top"
                style={{
                  transform: 'scale(0.7)',
                  height: `${1350 * 0.7}px`,
                }}
              >
                <CertificateViewer templateData={templateData} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[400px]">
              <p className="text-[#69737c]">
                Unable to generate preview. Please ensure the template has a valid structure.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between px-6 py-4 bg-white border-t border-[#e1e1e1] rounded-b-2xl">
          <Button variant="outline" onClick={onClose} disabled={isMinting}>
            Back to Edit
          </Button>
          <Button onClick={onConfirmMint} disabled={isMinting}>
            {isMinting ? "Minting..." : "Confirm & Mint"}
          </Button>
        </div>
      </div>
    </div>
  );
}
