import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useIsMobile } from '@/shared/hooks/useMediaQuery';
import { ChooseTemplateStep } from '../components/create/choose-template-step';
import { ChooseBackgroundStep } from '../components/create/choose-background-step';
import { EditTemplateStepV2 } from '../components/create/edit-template-step-v2';
import { PreviewDeployStep } from '../components/create/preview-deploy-step';
import { useCreateTemplate } from '../api/templates.queries';
import type { Template } from '../types/template.types';

type Step = 'choose' | 'background' | 'edit' | 'preview';

const STEPS: Step[] = ['choose', 'background', 'edit', 'preview'];

const stepLabels: Record<Step, string> = {
  choose: 'Choose template',
  background: 'Choose your background',
  edit: 'Edit your template',
  preview: 'Preview & deploy'
};

interface MobileStepperProps {
  currentStep: Step;
  onStepClick: (step: Step) => void;
  isStepAccessible: (step: Step) => boolean;
}

function MobileStepper({ currentStep, onStepClick, isStepAccessible }: MobileStepperProps) {
  const currentIndex = STEPS.indexOf(currentStep);

  return (
    <div className="flex flex-col items-center gap-4 py-4 bg-white border-b border-gray-200 px-6">
      {/* Step circles with connecting lines */}
      <div className="flex items-center">
        {STEPS.map((step, index) => {
          const isActive = step === currentStep;
          const isCompleted = index < currentIndex;
          const isAccessible = isStepAccessible(step);

          return (
            <div key={step} className="flex items-center">
              <button
                onClick={() => isAccessible && onStepClick(step)}
                disabled={!isAccessible}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-[#222526] text-white'
                    : isCompleted
                      ? 'bg-[#222526] text-white'
                      : 'border border-gray-400 text-gray-400'
                  }
                  ${isAccessible && !isActive ? 'cursor-pointer hover:bg-gray-100' : ''}
                  ${!isAccessible ? 'cursor-not-allowed opacity-50' : ''}
                `}
              >
                {index + 1}
              </button>
              {index < STEPS.length - 1 && (
                <div className={`w-8 h-px ${index < currentIndex ? 'bg-[#222526]' : 'bg-gray-300'}`} />
              )}
            </div>
          );
        })}
      </div>
      {/* Current step label */}
      <div className="border border-gray-300 rounded px-4 py-2 text-sm text-[#222526]">
        {stepLabels[currentStep]}
      </div>
    </div>
  );
}

interface TemplateWithBackground extends Template {
  backgroundType?: 'standard' | 'custom';
  customBackgroundImage?: string;
}

export function NewTemplatePage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState<Step>('choose');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateWithBackground | null>(null);

  // Template creation mutation
  const createTemplateMutation = useCreateTemplate({
    onSuccess: (templateId) => {
      toast.success(`Template created successfully! (ID: ${templateId})`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create template');
    },
  });

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate({ ...template });
    setCurrentStep('background');
  };

  const handleDeploy = async (template: Template) => {
    await createTemplateMutation.mutateAsync(template);
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

  const isStepAccessible = (step: Step): boolean => {
    switch (step) {
      case 'choose':
        return true;
      case 'background':
        return isBackgroundAccessible;
      case 'edit':
        return isEditAccessible;
      case 'preview':
        return isPreviewAccessible;
      default:
        return false;
    }
  };

  const handleStepClick = (step: Step) => {
    if (isStepAccessible(step)) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfafa]">
      <Tabs value={currentStep} onValueChange={handleTabChange} className="flex-1 flex flex-col">
        {/* Navigation - Mobile Stepper or Desktop Tabs */}
        {isMobile ? (
          <MobileStepper
            currentStep={currentStep}
            onStepClick={handleStepClick}
            isStepAccessible={isStepAccessible}
          />
        ) : (
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
        )}

        {/* Tab Content */}
        <div className="flex-1 flex items-start lg:items-center justify-center p-4 lg:p-6 overflow-y-auto">
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
              onDeploy={handleDeploy}
              onComplete={() => navigate({ to: '/templates' })}
              isDeploying={createTemplateMutation.isPending}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
