/**
 * CreateCertificatePageV2 Component
 *
 * Uses dynamic template form to generate certificate creation form
 * Based on selected template structure.
 * Mints certificates with full ORIGYN template metadata.
 */

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { CollectionSection } from "./collection-section";
import { PricingSidebar } from "./pricing-sidebar";
import { DynamicTemplateForm } from "./dynamic-template-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Template } from "@/shared/data/templates";
import type { CertificateFormData } from "@/features/templates/types/template-structure.types";
import {
  validateFormData,
  getTemplateProgress,
  isFormComplete,
  getInitialFormData,
} from "@/features/templates/utils/template-utils";
import { useMintNftWithTemplate } from "@services/origyn_nft";
import { useSetCollectionTemplate } from "@/features/templates";

interface CreateCertificatePageV2Props {
  onSubmit?: (data: CertificateFormData) => void;
  initialCollectionId?: string;
}

export function CreateCertificatePageV2({
  onSubmit,
  initialCollectionId,
}: CreateCertificatePageV2Props) {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [selectedCollection, setSelectedCollection] = useState<string>(
    initialCollectionId || "",
  );
  const [formData, setFormData] = useState<CertificateFormData>({});
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  // Track file fields separately for the template-based minting
  const [fileFields, setFileFields] = useState<Map<string, File[]>>(new Map());

  const setCollectionTemplate = useSetCollectionTemplate();

  const mintMutation = useMintNftWithTemplate({
    onSuccess: (tokenId) => {
      toast.success(`Certificate minted successfully! Token ID: ${tokenId}`);
      navigate({
        to: "/collections/$collectionId",
        params: { collectionId: selectedCollection },
      });
    },
    onError: (error) => {
      toast.error(`Minting failed: ${error.message}`);
    },
  });

  const handleTemplateChange = (template: Template | null) => {
    setSelectedTemplate(template);
    // Initialize form data with template defaults when template changes
    setFormData(template ? getInitialFormData(template) : {});
    setFileFields(new Map());
    setValidationErrors({});

    // Associate template with collection
    if (template && selectedCollection) {
      setCollectionTemplate.mutate({
        collectionId: selectedCollection,
        templateId: template.id,
      });
    }
  };

  // Calculate form progress (only if template is selected)
  const progress = selectedTemplate
    ? getTemplateProgress(selectedTemplate, formData)
    : 0;
  const isComplete = selectedTemplate
    ? isFormComplete(selectedTemplate, formData)
    : false;

  const handleFormDataChange = (data: CertificateFormData) => {
    setFormData(data);
    // Clear validation errors when form changes
    setValidationErrors({});

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
    setFileFields(newFileFields);
  };

  const handleSubmit = async () => {
    if (!selectedTemplate) {
      toast.error("No template selected");
      return;
    }

    if (!selectedTemplate.structure) {
      toast.error("Template has no structure defined");
      return;
    }

    if (!selectedCollection) {
      toast.error("No collection selected");
      return;
    }

    // Validate form
    const validation = validateFormData(selectedTemplate, formData);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      toast.error("Please fix validation errors");
      return;
    }

    try {
      toast.info("Minting certificate with template...");

      await mintMutation.mutateAsync({
        collectionCanisterId: selectedCollection,
        template: selectedTemplate.structure,
        formData,
        files: fileFields.size > 0 ? fileFields : undefined,
        name:
          (formData.company_name as string) ||
          (formData.name as string) ||
          selectedTemplate.name,
        description:
          (formData.short_description as string) ||
          (formData.description as string) ||
          selectedTemplate.description,
      });

      // Call optional callback
      onSubmit?.(formData);
    } catch (error: unknown) {
      console.error("Minting error:", error);
      // Error toast is handled by mutation onError
    }
  };

  const handleSaveDraft = () => {
    // Save as draft without validation
    console.log("Saving draft:", formData);
    // TODO: Implement draft saving
  };

  // Compute if we're in uploading/minting state
  const isBusy = mintMutation.isPending;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Main Form Section */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-4">
            {/* Template Info Card - Only show if template selected */}
            {selectedTemplate && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-[#222526]">
                      {selectedTemplate.name}
                    </h2>
                    <p className="text-sm text-[#69737c]">
                      {selectedTemplate.description}
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
              onCollectionChange={setSelectedCollection}
              initialCollectionId={initialCollectionId}
            />

            {/* Dynamic Template Form - Only show if template selected */}
            {selectedTemplate ? (
              <DynamicTemplateForm
                template={selectedTemplate}
                onFormDataChange={handleFormDataChange}
                initialData={formData}
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
            {Object.keys(validationErrors).length > 0 && (
              <Card className="p-6 bg-red-50 border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Please fix the following errors:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(validationErrors).map(([itemId, error]) => (
                    <li key={itemId} className="text-sm text-red-600">
                      {error}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Minting Progress - Show if minting */}
            {mintMutation.isPending && (
              <Card className="p-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#69737c]">
                      Minting certificate with template...
                    </span>
                    <span className="font-medium text-[#222526]">
                      Processing
                    </span>
                  </div>
                  <div className="w-full bg-[#e1e1e1] rounded-full h-2">
                    <div
                      className="bg-[#615bff] h-2 rounded-full transition-all duration-300 animate-pulse"
                      style={{ width: "60%" }}
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Action Buttons - Only show if template selected */}
            {selectedTemplate && (
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
                    disabled={isBusy || !selectedCollection}
                  >
                    {mintMutation.isPending
                      ? "Minting..."
                      : isComplete
                        ? "Mint Certificate"
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
