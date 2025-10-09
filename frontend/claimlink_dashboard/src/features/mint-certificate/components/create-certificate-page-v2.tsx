/**
 * CreateCertificatePageV2 Component
 * 
 * Uses dynamic template form to generate certificate creation form
 * Based on selected template structure
 */

import { useState } from 'react';
import { CollectionSection } from "./collection-section";
import { PricingSidebar } from "./pricing-sidebar";
import { DynamicTemplateForm } from "./dynamic-template-form";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Template } from '@/shared/data/templates';
import type { CertificateFormData } from '@/features/templates/types/template-structure.types';
import {
  validateFormData,
  getTemplateProgress,
  isFormComplete,
} from '@/features/templates/utils/template-utils';

interface CreateCertificatePageV2Props {
  onSubmit?: (data: CertificateFormData) => void;
}

export function CreateCertificatePageV2({
  onSubmit,
}: CreateCertificatePageV2Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<CertificateFormData>({});
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const handleTemplateChange = (template: Template | null) => {
    setSelectedTemplate(template);
    // Reset form data when template changes
    setFormData({});
    setValidationErrors({});
  };

  // Calculate form progress (only if template is selected)
  const progress = selectedTemplate ? getTemplateProgress(selectedTemplate, formData) : 0;
  const isComplete = selectedTemplate ? isFormComplete(selectedTemplate, formData) : false;

  const handleFormDataChange = (data: CertificateFormData) => {
    setFormData(data);
    // Clear validation errors when form changes
    setValidationErrors({});
  };

  const handleSubmit = () => {
    if (!selectedTemplate) {
      console.error('No template selected');
      return;
    }
    
    // Validate form
    const validation = validateFormData(selectedTemplate, formData);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      console.error('Validation errors:', validation.errors);
      // TODO: Show toast notification
      return;
    }

    // Submit form
    console.log('Submitting certificate form:', formData);
    onSubmit?.(formData);
  };

  const handleSaveDraft = () => {
    // Save as draft without validation
    console.log('Saving draft:', formData);
    // TODO: Implement draft saving
  };

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
            <CollectionSection onTemplateChange={handleTemplateChange} />

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
                  <p className="text-lg font-medium mb-2">Please select a template</p>
                  <p className="text-sm">Choose a template from the dropdown above to get started</p>
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

            {/* Action Buttons - Only show if template selected */}
            {selectedTemplate && (
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!isComplete}
                  >
                    {isComplete ? 'Mint Certificate' : `Complete Form (${progress}%)`}
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

