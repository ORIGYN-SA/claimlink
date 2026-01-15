/**
 * EditTemplatePage Component
 *
 * Page component for editing an existing template dynamically
 * Allows users to edit template sections, items, and preview changes
 */

import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EditTemplateStepV2 } from '../components/create/edit-template-step-v2';
import { PreviewDeployStep } from '../components/create/preview-deploy-step';
import { useTemplate } from '../api/templates.queries';
import type { Template } from '../types/template.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Step = 'edit' | 'preview';

interface EditTemplatePageProps {
  templateId: string;
}

export function EditTemplatePage({ templateId }: EditTemplatePageProps) {
  const navigate = useNavigate();

  // Fetch template by ID from backend
  const { data: initialTemplate, isLoading, error } = useTemplate({ templateId });

  const [currentStep, setCurrentStep] = useState<Step>('edit');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  // Update selectedTemplate when initialTemplate is loaded
  useEffect(() => {
    if (initialTemplate) {
      setSelectedTemplate(initialTemplate);
    }
  }, [initialTemplate]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === 'edit' || value === 'preview') {
      setCurrentStep(value);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fcfafa]">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#222526]" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fcfafa]">
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="p-8 max-w-md">
            <h2 className="text-xl font-semibold text-[#222526] mb-4">Error Loading Template</h2>
            <p className="text-[#69737c] mb-6">{error.message}</p>
            <Button onClick={() => navigate({ to: '/templates' })}>
              Back to Templates
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // If template not found, show error
  if (!initialTemplate) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fcfafa]">
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="p-8 max-w-md">
            <h2 className="text-xl font-semibold text-[#222526] mb-4">Template Not Found</h2>
            <p className="text-[#69737c] mb-6">
              The template with ID "{templateId}" could not be found.
            </p>
            <Button onClick={() => navigate({ to: '/templates' })}>
              Back to Templates
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfafa]">
      <Tabs value={currentStep} onValueChange={handleTabChange} className="flex-1 flex flex-col">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 bg-white px-4 sm:px-6 py-3 sm:py-4">
          <TabsList className="w-full max-w-2xl mx-auto bg-transparent h-auto p-0 gap-1">
            <TabsTrigger
              value="edit"
              className="flex-1 data-[state=active]:bg-[#615bff] data-[state=active]:text-white rounded-md px-2 sm:px-4 py-2 text-xs sm:text-sm"
            >
              Edit your template
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="flex-1 data-[state=active]:bg-[#615bff] data-[state=active]:text-white rounded-md px-2 sm:px-4 py-2 text-xs sm:text-sm"
            >
              Preview & deploy
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <TabsContent value="edit" className="mt-0 w-full flex justify-center">
            <EditTemplateStepV2
              selectedTemplate={selectedTemplate}
              onNext={() => setCurrentStep('preview')}
              onBack={() => navigate({ to: '/templates' })}
              onTemplateChange={(updatedTemplate) => setSelectedTemplate(updatedTemplate)}
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-0 w-full flex justify-center">
            <PreviewDeployStep
              selectedTemplate={selectedTemplate}
              onBack={() => setCurrentStep('edit')}
              onComplete={() => navigate({ to: '/templates' })}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

