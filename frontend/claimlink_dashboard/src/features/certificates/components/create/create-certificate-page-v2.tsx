/**
 * CreateCertificatePageV2 Component
 *
 * Uses dynamic template form to generate certificate creation form
 * Based on selected template structure.
 * Mints certificates with full ORIGYN template metadata.
 *
 * Uses certificateCreatorAtom for state management (Phase 3 migration)
 * - Consolidated 5 useState calls into single atom
 * - Template, collection, formData, validation, and files managed by atom
 */

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { CollectionSection } from "./collection-section";
import { DynamicTemplateForm } from "./dynamic-template-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { certificateCreatorAtom } from "@/features/certificates/atoms/certificate-creator.atom";
import type { Template } from "@/shared/data/templates";
import type {
  CertificateFormData,
  TemplateStructure as TemplateStructureType,
} from "@/features/templates/types/template.types";
import type {
  MetadataFieldValue,
  FileReference,
} from "@/features/template-renderer/types/origyn-template.types";
import {
  validateFormData,
  getTemplateProgress,
  isFormComplete,
  getInitialFormData,
} from "@/features/templates/utils/template-utils";
import {
  useMintCertificateWithTemplate,
  useUpdateCertificateWithTemplate,
  useCertificate,
} from "@/features/certificates";
import { useCollectionTemplate } from "@/features/collections";
import { mockTemplates } from "@/shared/data/templates";

/**
 * Reconstruct CertificateFormData from parsed on-chain metadata
 *
 * Handles MetadataFieldValue objects by extracting the actual string content,
 * preventing [object Object] from appearing in form inputs.
 */
function reconstructFormData(
  metadata: Record<string, MetadataFieldValue | FileReference[] | string>,
  template: TemplateStructureType,
): CertificateFormData {
  const formData: CertificateFormData = {};

  template.sections.forEach((section) => {
    section.items.forEach((item) => {
      const value = metadata[item.id];
      if (value === undefined || value === null) return;

      if (typeof value === "string") {
        formData[item.id] = value;
      } else if (Array.isArray(value)) {
        // FileReference[] - for image fields, use the first file's path
        if (item.type === "image" && value.length > 0) {
          formData[item.id] = (value[0] as FileReference).path;
        }
      } else if (typeof value === "object" && "content" in value) {
        // MetadataFieldValue - extract the actual string
        const content = (value as MetadataFieldValue).content;
        if (typeof content === "string") {
          formData[item.id] = content;
        } else if (typeof content === "object" && content !== null) {
          // LocalizedContent: { en: "...", fr: "..." } or DateContent: { date: number }
          if ("date" in content) {
            formData[item.id] = String(content.date);
          } else {
            formData[item.id] =
              (content as Record<string, string>)["en"] ||
              Object.values(content)[0] ||
              "";
          }
        }
      }
    });
  });

  return formData;
}

interface CreateCertificatePageV2Props {
  mode?: "create" | "edit";
  onSubmit?: (data: CertificateFormData) => void;
  initialCollectionId?: string;
  certificateId?: string; // For edit mode: "collectionId:tokenId"
}

export function CreateCertificatePageV2({
  mode = "create",
  onSubmit,
  initialCollectionId,
  certificateId,
}: CreateCertificatePageV2Props) {
  const navigate = useNavigate();
  const [state, dispatch] = useAtom(certificateCreatorAtom);
  const [uploadProgress, setUploadProgress] = useState<Map<string, number>>(
    new Map(),
  );

  // Extract collection and token ID from certificateId in edit mode
  const [editCollectionId, editTokenId] =
    mode === "edit" && certificateId ? certificateId.split(":") : [null, null];

  // Initialize collection if provided (update if URL param differs from current state)
  useEffect(() => {
    if (
      initialCollectionId &&
      initialCollectionId !== state.selectedCollection
    ) {
      dispatch({
        type: "SET_SELECTED_COLLECTION",
        collectionId: initialCollectionId,
      });
    }
  }, [initialCollectionId, state.selectedCollection, dispatch]);

  // Fetch certificate data in edit mode
  const { data: certificateData } = useCertificate(
    editCollectionId || "",
    editTokenId || "",
    {
      enabled: mode === "edit" && !!editCollectionId && !!editTokenId,
    },
  );

  // Fetch template structure from collection metadata (for edit mode)
  const { data: collectionTemplateStructure, isLoading: isLoadingTemplate } =
    useCollectionTemplate({
      collectionId: editCollectionId || "",
      enabled: mode === "edit" && !!editCollectionId,
    });

  // Initialize form with certificate data in edit mode
  useEffect(() => {
    if (mode === "edit" && certificateData && !isLoadingTemplate) {
      const { parsedMetadata } = certificateData;

      // Set collection
      if (editCollectionId) {
        dispatch({
          type: "SET_SELECTED_COLLECTION",
          collectionId: editCollectionId,
        });
      }

      // Get template from collection metadata (stored TemplateStructure)
      // Fall back to mock templates for legacy collections
      let templateStructure: TemplateStructureType | null =
        collectionTemplateStructure ?? null;

      if (!templateStructure) {
        // Legacy fallback: try to find a mock template that matches
        const fallbackTemplate = mockTemplates.find((t) => t.structure);
        if (fallbackTemplate?.structure) {
          console.warn(
            `Collection ${editCollectionId} has no stored template, using fallback: ${fallbackTemplate.name}`,
          );
          templateStructure = fallbackTemplate.structure;
        }
      }

      if (templateStructure) {
        // Create a Template object from the TemplateStructure
        const template: Template = {
          id: `collection-template-${editCollectionId}`,
          name: "Collection Template",
          description: "Template from collection metadata",
          category: "existing",
          structure: templateStructure,
        };

        dispatch({ type: "SET_SELECTED_TEMPLATE", template });

        // Build form data from metadata using the collection's template structure
        const formData = reconstructFormData(
          parsedMetadata.metadata,
          templateStructure,
        );

        dispatch({ type: "UPDATE_FORM_DATA", data: formData });
      } else {
        console.error(
          "Cannot edit certificate: No template found in collection or fallback templates",
        );
        toast.error(
          "Cannot load template for editing. Please contact support.",
        );
      }
    }
  }, [
    mode,
    certificateData,
    collectionTemplateStructure,
    isLoadingTemplate,
    dispatch,
    editCollectionId,
  ]);

  const mintMutation = useMintCertificateWithTemplate({
    onUploadProgress: (fieldId, progress) => {
      setUploadProgress((prev) => {
        const updated = new Map(prev);
        updated.set(fieldId, progress);
        return updated;
      });
    },
    onSuccess: (tokenId) => {
      toast.success(`Certificate minted successfully! Token ID: ${tokenId}`);
      setUploadProgress(new Map()); // Clear progress
      dispatch({ type: "RESET_ALL" });
      navigate({
        to: "/collections/$collectionId",
        params: { collectionId: state.selectedCollection },
      });
    },
    onError: (error) => {
      toast.error(`Minting failed: ${error.message}`);
      setUploadProgress(new Map()); // Clear progress
    },
  });

  const updateMutation = useUpdateCertificateWithTemplate({
    onUploadProgress: (fieldId, progress) => {
      setUploadProgress((prev) => {
        const updated = new Map(prev);
        updated.set(fieldId, progress);
        return updated;
      });
    },
    onSuccess: (tokenId) => {
      toast.success("Certificate updated successfully!");
      setUploadProgress(new Map()); // Clear progress
      dispatch({ type: "RESET_ALL" });
      navigate({
        to: "/mint_certificate/$certificateId",
        params: { certificateId: `${state.selectedCollection}:${tokenId}` },
      });
    },
    onError: (error) => {
      toast.error(`Update failed: ${error.message}`);
      setUploadProgress(new Map()); // Clear progress
    },
  });

  // Select the active mutation based on mode
  const activeMutation = mode === "edit" ? updateMutation : mintMutation;

  const handleTemplateChange = (template: Template | null) => {
    dispatch({ type: "SET_SELECTED_TEMPLATE", template });

    // Initialize form data with template defaults when template changes
    if (template) {
      dispatch({
        type: "UPDATE_FORM_DATA",
        data: getInitialFormData(template),
      });
    } else {
      dispatch({ type: "RESET_FORM_DATA" });
    }

    dispatch({ type: "CLEAR_ALL_FILE_FIELDS" });
    dispatch({ type: "CLEAR_ALL_VALIDATION_ERRORS" });

    // Note: Template is now stored in collection metadata during collection creation
    // No need to associate here - CollectionSection will fetch it from collection
  };

  const handleCollectionChange = (collectionId: string) => {
    dispatch({ type: "SET_SELECTED_COLLECTION", collectionId });
  };

  // Calculate form progress (only if template is selected)
  const progress = state.selectedTemplate
    ? getTemplateProgress(state.selectedTemplate, state.formData)
    : 0;
  const isComplete = state.selectedTemplate
    ? isFormComplete(state.selectedTemplate, state.formData)
    : false;

  const handleFormDataChange = (data: CertificateFormData) => {
    dispatch({ type: "UPDATE_FORM_DATA", data });
    dispatch({ type: "CLEAR_ALL_VALIDATION_ERRORS" });

    // Extract file fields from form data
    // DynamicTemplateForm stores files directly as File or File[] (not wrapped in { file: File })
    // Also handle URL strings (existing images from on-chain data)
    const newFileFields = new Map<string, (File | string)[]>();
    Object.entries(data).forEach(([key, value]) => {
      // Handle single File object directly
      if (value instanceof File) {
        newFileFields.set(key, [value]);
      }
      // Handle URL string (existing image from on-chain data)
      else if (typeof value === "string" && value.startsWith("http")) {
        newFileFields.set(key, [value]);
      }
      // Handle array of File objects or URL strings
      else if (Array.isArray(value) && value.length > 0) {
        const filesOrUrls = value.filter(
          (item): item is File | string =>
            item instanceof File ||
            (typeof item === "string" && item.startsWith("http")),
        );
        if (filesOrUrls.length > 0) {
          newFileFields.set(key, filesOrUrls);
        }
      }
      // Legacy support: Handle wrapped { file: File } objects
      // Skip LocalizedValue objects (they have short string keys like 'en', 'it', not 'file')
      else if (
        value &&
        typeof value === "object" &&
        "file" in value &&
        !Array.isArray(value)
      ) {
        const maybeFile = (value as Record<string, unknown>).file;
        if (maybeFile instanceof File) {
          newFileFields.set(key, [maybeFile]);
        }
      }
    });

    // Update file fields in state (cast to File[] for backward compatibility)
    // The actual File vs string distinction is handled in the mutation
    newFileFields.forEach((filesOrUrls, key) => {
      dispatch({
        type: "SET_FILE_FIELD",
        field: key,
        files: filesOrUrls as File[],
      });
    });
  };

  const handleSubmit = async () => {
    if (!state.selectedTemplate) {
      toast.error("No template selected");
      return;
    }

    if (!state.selectedTemplate.structure) {
      toast.error("Template has no structure defined");
      return;
    }

    if (!state.selectedCollection) {
      toast.error("No collection selected");
      return;
    }

    // Validate form
    const validation = validateFormData(state.selectedTemplate, state.formData);

    if (!validation.isValid) {
      // Set validation errors in state
      Object.entries(validation.errors).forEach(([field, error]) => {
        dispatch({ type: "SET_VALIDATION_ERROR", field, error });
      });
      toast.error("Please fix validation errors");
      return;
    }

    try {
      if (mode === "edit") {
        toast.info("Updating certificate...");

        if (!editTokenId) {
          toast.error("Invalid certificate ID");
          return;
        }

        await updateMutation.mutateAsync({
          collectionCanisterId: state.selectedCollection,
          tokenId: BigInt(editTokenId),
          template: state.selectedTemplate.structure,
          formData: state.formData,
          files: state.fileFields.size > 0 ? state.fileFields : undefined,
          name:
            (state.formData.company_name as string) ||
            (state.formData.name as string) ||
            state.selectedTemplate.name,
          description:
            (state.formData.short_description as string) ||
            (state.formData.description as string) ||
            state.selectedTemplate.description,
        });
      } else {
        toast.info("Minting certificate with template...");

        await mintMutation.mutateAsync({
          collectionCanisterId: state.selectedCollection,
          template: state.selectedTemplate.structure,
          formData: state.formData,
          files: state.fileFields.size > 0 ? state.fileFields : undefined,
          name:
            (state.formData.company_name as string) ||
            (state.formData.name as string) ||
            state.selectedTemplate.name,
          description:
            (state.formData.short_description as string) ||
            (state.formData.description as string) ||
            state.selectedTemplate.description,
        });
      }

      // Call optional callback
      onSubmit?.(state.formData);
    } catch (error: unknown) {
      console.error(
        mode === "edit" ? "Update error:" : "Minting error:",
        error,
      );
      // Error toast is handled by mutation onError
    }
  };

  const handleSaveDraft = () => {
    // Save as draft without validation
    console.log("Saving draft:", state.formData);
    // TODO: Implement draft saving
  };

  // Compute if we're in uploading/minting state
  const isBusy = activeMutation.isPending;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Main Form Section */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-4">
            {/* Template Info Card - Only show if template selected */}
            {state.selectedTemplate && (
              <Card className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-[#222526]">
                      {state.selectedTemplate.name}
                    </h2>
                    <p className="text-sm text-[#69737c]">
                      {state.selectedTemplate.description}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-[#69737c]">Completion</p>
                    <p className="text-2xl font-bold text-[#222526]">
                      {progress}%
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#e1e1e1] rounded-full h-2">
                  <div
                    className="bg-[#615bff] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </Card>
            )}

            {/* Collection Section */}
            <CollectionSection
              onTemplateChange={handleTemplateChange}
              onCollectionChange={handleCollectionChange}
              initialCollectionId={
                initialCollectionId || editCollectionId || undefined
              }
              disabled={mode === "edit"} // Disable in edit mode
            />

            {/* Dynamic Template Form - Only show if template selected */}
            {state.selectedTemplate ? (
              <DynamicTemplateForm
                template={state.selectedTemplate}
                onFormDataChange={handleFormDataChange}
                initialData={state.formData}
                mode={mode}
              />
            ) : (
              <Card className="p-6 sm:p-12 text-center">
                <div className="text-[#69737c]">
                  <p className="text-lg font-medium mb-2">
                    Please select a template
                  </p>
                  <p className="text-sm">
                    Choose a template from the dropdown above to get started
                  </p>
                </div>
              </Card>
            )}

            {/* Validation Errors Summary */}
            {Object.keys(state.validationErrors).length > 0 && (
              <Card className="p-4 sm:p-6 bg-red-50 border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Please fix the following errors:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(state.validationErrors).map(
                    ([itemId, error]) => (
                      <li key={itemId} className="text-sm text-red-600">
                        {error}
                      </li>
                    ),
                  )}
                </ul>
              </Card>
            )}

            {/* Minting/Updating Progress - Show if processing */}
            {activeMutation.isPending && (
              <Card className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#69737c]">
                      {mode === "edit"
                        ? "Updating certificate..."
                        : "Minting certificate with template..."}
                    </span>
                    <span className="font-medium text-[#222526]">
                      Processing
                    </span>
                  </div>

                  {/* Show upload progress for each field */}
                  {uploadProgress.size > 0 && (
                    <div className="space-y-3">
                      {Array.from(uploadProgress.entries()).map(
                        ([fieldId, progress]) => (
                          <div key={fieldId} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-[#69737c]">
                                Uploading {fieldId}
                              </span>
                              <span className="font-medium text-[#222526]">
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <div className="w-full bg-[#e1e1e1] rounded-full h-1.5">
                              <div
                                className="bg-[#615bff] h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {/* Overall progress bar */}
                  {uploadProgress.size === 0 && (
                    <div className="w-full bg-[#e1e1e1] rounded-full h-2">
                      <div
                        className="bg-[#615bff] h-2 rounded-full transition-all duration-300 animate-pulse"
                        style={{ width: "60%" }}
                      />
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Action Buttons - Only show if template selected */}
            {state.selectedTemplate && (
              <Card className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
                  {/*<Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={isBusy}
                  >
                    Save as Draft
                  </Button>*/}
                  <Button
                    onClick={handleSubmit}
                    disabled={isBusy || !state.selectedCollection}
                  >
                    {activeMutation.isPending
                      ? mode === "edit"
                        ? "Updating..."
                        : "Minting..."
                      : isComplete
                        ? mode === "edit"
                          ? "Update Certificate"
                          : "Mint Certificate"
                        : `Complete Form (${progress}%)`}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        {/*<div className="w-full lg:w-[350px] flex-shrink-0">
          <PricingSidebar />
        </div>*/}
      </div>
    </div>
  );
}
