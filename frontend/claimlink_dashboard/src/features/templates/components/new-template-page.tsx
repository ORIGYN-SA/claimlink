import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChooseTemplateStep } from './choose-template-step';
import { ChooseBackgroundStep } from './choose-background-step';
// import { EditTemplateStep } from './edit-template-step'; // OLD: Commented out - using V2 version
import { EditTemplateStepV2 } from './edit-template-step-v2'; // NEW: Data-driven template editor
import { PreviewDeployStep } from './preview-deploy-step';
import { type Template } from '@/shared/data';

type Step = 'choose' | 'background' | 'edit' | 'preview';

interface TemplateWithBackground extends Template {
  backgroundType?: 'standard' | 'custom';
  customBackgroundImage?: string;
}

export function NewTemplatePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('choose');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateWithBackground | null>(null);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate({ ...template });
    setCurrentStep('background');
  };

  const handleBackgroundSelect = (backgroundType: 'standard' | 'custom', customImage?: string) => {
    if (selectedTemplate) {
      setSelectedTemplate({
        ...selectedTemplate,
        backgroundType,
        customBackgroundImage: customImage
      });
    }
    setCurrentStep('edit');
  };

  const handleTabChange = (value: string) => {
    // Only allow navigation to completed steps or current step
    if (value === 'choose') {
      setCurrentStep('choose');
    } else if (value === 'background' && (currentStep === 'background' || currentStep === 'edit' || currentStep === 'preview')) {
      setCurrentStep('background');
    } else if (value === 'edit' && (currentStep === 'edit' || currentStep === 'preview')) {
      setCurrentStep('edit');
    } else if (value === 'preview' && currentStep === 'preview') {
      setCurrentStep('preview');
    }
  };

  // Determine which steps are accessible
  const isBackgroundAccessible = currentStep === 'background' || currentStep === 'edit' || currentStep === 'preview';
  const isEditAccessible = currentStep === 'edit' || currentStep === 'preview';
  const isPreviewAccessible = currentStep === 'preview';

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfafa]">
      <Tabs value={currentStep} onValueChange={handleTabChange} className="flex-1 flex flex-col">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <TabsList className="w-full max-w-2xl mx-auto bg-transparent h-auto p-0 gap-1">
            <TabsTrigger 
              value="choose" 
              className="flex-1 data-[state=active]:bg-[#615bff] data-[state=active]:text-white rounded-md px-4 py-2"
            >
              Choose template
            </TabsTrigger>
            <TabsTrigger 
              value="background" 
              disabled={!isBackgroundAccessible}
              className="flex-1 data-[state=active]:bg-[#615bff] data-[state=active]:text-white rounded-md px-4 py-2 disabled:opacity-40"
            >
              Choose your background
            </TabsTrigger>
            <TabsTrigger 
              value="edit" 
              disabled={!isEditAccessible}
              className="flex-1 data-[state=active]:bg-[#615bff] data-[state=active]:text-white rounded-md px-4 py-2 disabled:opacity-40"
            >
              Edit your template
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              disabled={!isPreviewAccessible}
              className="flex-1 data-[state=active]:bg-[#615bff] data-[state=active]:text-white rounded-md px-4 py-2 disabled:opacity-40"
            >
              Preview & deploy
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <TabsContent value="choose" className="mt-0 w-full flex justify-center">
            <ChooseTemplateStep onNext={handleTemplateSelect} />
          </TabsContent>

          <TabsContent value="background" className="mt-0 w-full flex justify-center">
            <ChooseBackgroundStep
              selectedTemplate={selectedTemplate}
              onNext={handleBackgroundSelect}
              onBack={() => setCurrentStep('choose')}
            />
          </TabsContent>

          <TabsContent value="edit" className="mt-0 w-full flex justify-center">
            {/* OLD: Static hard-coded template editor */}
            {/* <EditTemplateStep
              selectedTemplate={selectedTemplate}
              onNext={() => setCurrentStep('preview')}
              onBack={() => setCurrentStep('choose')}
            /> */}
            
            {/* NEW: Dynamic data-driven template editor with sections and items */}
            <EditTemplateStepV2
              selectedTemplate={selectedTemplate}
              onNext={() => setCurrentStep('preview')}
              onBack={() => setCurrentStep('background')}
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
