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
import { PricingSidebar } from "./pricing-sidebar";
import { DynamicTemplateForm } from "./dynamic-template-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { certificateCreatorAtom } from "@/features/certificates/atoms/certificate-creator.atom";
import type { Template } from "@/shared/data/templates";
import type { CertificateFormData } from "@/features/templates/types/template.types";
import {
  validateFormData,
  getTemplateProgress,
  isFormComplete,
  getInitialFormData,
} from "@/features/templates/utils/template-utils";
import {
  useMintCertificateWithTemplate,
  useUpdateCertificateWithTemplate,
  useCertificate
} from "@/features/certificates";
import { useSetCollectionTemplate } from "@/features/templates";
import type { TemplateStructure } from "@/features/templates/types/template.types";

/**
 * Reconstruct CertificateFormData from parsed on-chain metadata
 */
function reconstructFormData(
  metadata: Record<string, any>,
  template: TemplateStructure
): CertificateFormData {
  const formData: CertificateFormData = {};

  // Iterate through template items and extract values from metadata
  template.sections.forEach(section => {
    section.items.forEach(item => {
      const value = metadata[item.id];

      if (value !== undefined && value !== null) {
        // For file/image fields, keep URL references
        if (item.type === 'image' && typeof value === 'string') {
          formData[item.id] = value; // URL string
        } else {
          formData[item.id] = value;
        }
      }
    });
  });

  return formData;
}

interface CreateCertificatePageV2Props {
  mode?: 'create' | 'edit';
  onSubmit?: (data: CertificateFormData) => void;
  initialCollectionId?: string;
  certificateId?: string; // For edit mode: "collectionId:tokenId"
}

export function CreateCertificatePageV2({
  mode = 'create',
  onSubmit,
  initialCollectionId,
  certificateId,
}: CreateCertificatePageV2Props) {
  const navigate = useNavigate();
  const [state, dispatch] = useAtom(certificateCreatorAtom);
  const [uploadProgress, setUploadProgress] = useState<Map<string, number>>(new Map());

  // Extract collection and token ID from certificateId in edit mode
  const [editCollectionId, editTokenId] = mode === 'edit' && certificateId
    ? certificateId.split(':')
    : [null, null];

  // Initialize collection if provided
  useEffect(() => {
    if (initialCollectionId && !state.selectedCollection) {
      dispatch({ type: 'SET_SELECTED_COLLECTION', collectionId: initialCollectionId });
    }
  }, [initialCollectionId, state.selectedCollection, dispatch]);

  // Fetch certificate data in edit mode
  const { data: certificateData } = useCertificate(
    editCollectionId || '',
    editTokenId || '',
    {
      enabled: mode === 'edit' && !!editCollectionId && !!editTokenId,
    }
  );

  // Initialize form with certificate data in edit mode
  useEffect(() => {
    if (mode === 'edit' && certificateData) {
      const { parsedMetadata } = certificateData;

      // Set collection
      if (editCollectionId) {
        dispatch({
          type: 'SET_SELECTED_COLLECTION',
          collectionId: editCollectionId
        });
      }

      // Reconstruct template from parsed metadata
      const template = parsedMetadata.templates?.certificateTemplate
        || parsedMetadata.templates?.template;

      if (template) {
        dispatch({ type: 'SET_SELECTED_TEMPLATE', template });

        // Build form data from metadata
        const formData = reconstructFormData(
          parsedMetadata.metadata,
          template
        );

        dispatch({ type: 'UPDATE_FORM_DATA', data: formData });
      }
    }
  }, [mode, certificateData, dispatch, editCollectionId]);

  const setCollectionTemplate = useSetCollectionTemplate();

  const mintMutation = useMintCertificateWithTemplate({
    onUploadProgress: (fieldId, progress) => {
      setUploadProgress(prev => {
        const updated = new Map(prev);
        updated.set(fieldId, progress);
        return updated;
      });
    },
    onSuccess: (tokenId) => {
      toast.success(`Certificate minted successfully! Token ID: ${tokenId}`);
      setUploadProgress(new Map()); // Clear progress
      dispatch({ type: 'RESET_ALL' });
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
      setUploadProgress(prev => {
        const updated = new Map(prev);
        updated.set(fieldId, progress);
        return updated;
      });
    },
    onSuccess: (tokenId) => {
      toast.success('Certificate updated successfully!');
      setUploadProgress(new Map()); // Clear progress
      dispatch({ type: 'RESET_ALL' });
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
  const activeMutation = mode === 'edit' ? updateMutation : mintMutation;

  const handleTemplateChange = (template: Template | null) => {
    dispatch({ type: 'SET_SELECTED_TEMPLATE', template });

    // Initialize form data with template defaults when template changes
    if (template) {
      dispatch({ type: 'UPDATE_FORM_DATA', data: getInitialFormData(template) });
    } else {
      dispatch({ type: 'RESET_FORM_DATA' });
    }

    dispatch({ type: 'CLEAR_ALL_FILE_FIELDS' });
    dispatch({ type: 'CLEAR_ALL_VALIDATION_ERRORS' });

    // Associate template with collection
    if (template && state.selectedCollection) {
      setCollectionTemplate.mutate({
        collectionId: state.selectedCollection,
        templateId: template.id,
      });
    }
  };

  const handleCollectionChange = (collectionId: string) => {
    dispatch({ type: 'SET_SELECTED_COLLECTION', collectionId });
  };

  // Calculate form progress (only if template is selected)
  const progress = state.selectedTemplate
    ? getTemplateProgress(state.selectedTemplate, state.formData)
    : 0;
  const isComplete = state.selectedTemplate
    ? isFormComplete(state.selectedTemplate, state.formData)
    : false;

  const handleFormDataChange = (data: CertificateFormData) => {
    dispatch({ type: 'UPDATE_FORM_DATA', data });
    dispatch({ type: 'CLEAR_ALL_VALIDATION_ERRORS' });

    // Extract file fields from form data
    const newFileFields = new Map<string, File[]>();
    Object.entries(data).forEach(([key, value]) => {
      // Handle single file fields
      if (value && typeof value === "object" && "file" in value) {
        const file = (value as { file: File }).file;
        newFileFields.set(key, [file]);
      }
      // Handle multiple file fields (array of files)
      else if (Array.isArray(value)) {
        const files: { file: File }[] = [];
        for (const item of value) {
          if (typeof item === "object" && item !== null && "file" in item) {
            files.push(item as { file: File });
          }
        }
        if (files.length > 0) {
          newFileFields.set(key, files.map((f) => f.file));
        }
      }
    });

    // Update file fields in state
    newFileFields.forEach((files, key) => {
      dispatch({ type: 'SET_FILE_FIELD', field: key, files });
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
        dispatch({ type: 'SET_VALIDATION_ERROR', field, error });
      });
      toast.error("Please fix validation errors");
      return;
    }

    try {
      if (mode === 'edit') {
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
      console.error(mode === 'edit' ? "Update error:" : "Minting error:", error);
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
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-[#222526]">
                      {state.selectedTemplate.name}
                    </h2>
                    <p className="text-sm text-[#69737c]">
                      {state.selectedTemplate.description}
                    </p>
                  </div>
                  <div className="text-right">
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
              initialCollectionId={initialCollectionId || editCollectionId || undefined}
              disabled={mode === 'edit'} // Disable in edit mode
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
              <Card className="p-12 text-center">
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
              <Card className="p-6 bg-red-50 border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Please fix the following errors:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(state.validationErrors).map(([itemId, error]) => (
                    <li key={itemId} className="text-sm text-red-600">
                      {error}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Minting/Updating Progress - Show if processing */}
            {activeMutation.isPending && (
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#69737c]">
                      {mode === 'edit'
                        ? 'Updating certificate...'
                        : 'Minting certificate with template...'}
                    </span>
                    <span className="font-medium text-[#222526]">
                      Processing
                    </span>
                  </div>

                  {/* Show upload progress for each field */}
                  {uploadProgress.size > 0 && (
                    <div className="space-y-3">
                      {Array.from(uploadProgress.entries()).map(([fieldId, progress]) => (
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
                      ))}
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
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={isBusy}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isBusy || !state.selectedCollection}
                  >
                    {activeMutation.isPending
                      ? mode === 'edit' ? "Updating..." : "Minting..."
                      : isComplete
                        ? mode === 'edit' ? "Update Certificate" : "Mint Certificate"
                        : `Complete Form (${progress}%)`}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[350px] flex-shrink-0">
          <PricingSidebar />
        </div>
      </div>
    </div>
  );
}
