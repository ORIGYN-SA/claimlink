/**
 * EditTemplatePage Component
 *
 * Page component for editing an existing template dynamically.
 * NOTE: Editing a template creates a NEW template (templates are immutable).
 * The original template is preserved, and a new version is created with the changes.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EditTemplateStepV2 } from '../components/create/edit-template-step-v2';
import { PreviewDeployStep } from '../components/create/preview-deploy-step';
import { useTemplate, useCreateTemplate } from '../api/templates.queries';
import type { Template } from '../types/template.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';

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
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [newTemplateId, setNewTemplateId] = useState<string | null>(null);

  // Create template mutation (editing creates a new template)
  const createTemplateMutation = useCreateTemplate({
    onSuccess: (templateId) => {
      setNewTemplateId(templateId.toString());
      setShowSuccessDialog(true);
    },
    onError: (error) => {
      toast.error(`Failed to save template: ${error.message}`);
    },
  });

  // Update selectedTemplate when initialTemplate is loaded
  useEffect(() => {
    if (initialTemplate) {
      // Create a modified copy for editing (will be saved as new template)
      setSelectedTemplate({
        ...initialTemplate,
        // Clear the ID so it's treated as a new template
        id: '',
        // Append "(Copy)" to the name to indicate it's a new version
        name: initialTemplate.name.endsWith(' (Copy)')
          ? initialTemplate.name
          : `${initialTemplate.name} (Copy)`,
      });
    }
  }, [initialTemplate]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === 'edit' || value === 'preview') {
      setCurrentStep(value);
    }
  };

  // Handle deploy - creates a new template (templates are immutable)
  const handleDeploy = async (template: Template) => {
    await createTemplateMutation.mutateAsync(template);
  };

  // Handle dialog actions
  const handleGoToNewTemplate = () => {
    setShowSuccessDialog(false);
    if (newTemplateId) {
      navigate({ to: '/templates/$templateId', params: { templateId: newTemplateId } });
    }
  };

  const handleGoToTemplates = () => {
    setShowSuccessDialog(false);
    navigate({ to: '/templates' });
  };

  const handleCreateCollection = () => {
    setShowSuccessDialog(false);
    navigate({ to: '/collections/new' });
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
              onDeploy={handleDeploy}
              isDeploying={createTemplateMutation.isPending}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Success Dialog - explains that a new template was created */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center">Template Saved as New Version</DialogTitle>
            <DialogDescription className="text-center space-y-2">
              <p>
                Your changes have been saved as a new template. The original template
                remains unchanged.
              </p>
              <p className="text-sm text-muted-foreground">
                To use this template, create a new collection with it. Existing
                collections will continue using the original template.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button onClick={handleCreateCollection} className="w-full bg-[#222526] hover:bg-[#333333]">
              Create Collection with New Template
            </Button>
            <Button onClick={handleGoToTemplates} variant="outline" className="w-full">
              Go to Templates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

