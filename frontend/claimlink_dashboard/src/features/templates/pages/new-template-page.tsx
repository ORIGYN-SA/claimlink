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
import type { Template, TemplateBackground } from '../types/template.types';

type Step = 'choose' | 'background' | 'edit' | 'preview';
type EditorMode = 'ui' | 'code';

const STEPS_PRESET: Step[] = ['choose', 'background', 'edit', 'preview'];
const STEPS_SCRATCH: Step[] = ['choose', 'background', 'edit', 'preview'];

const stepLabels: Record<Step, string> = {
  choose: 'Choose template',
  background: 'Choose your background',
  edit: 'Edit your template',
  preview: 'Preview & deploy'
};

interface MobileStepperProps {
  currentStep: Step;
  steps: Step[];
  onStepClick: (step: Step) => void;
  isStepAccessible: (step: Step) => boolean;
}

function MobileStepper({ currentStep, steps, onStepClick, isStepAccessible }: MobileStepperProps) {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="flex flex-col items-center gap-4 py-4 bg-white border-b border-gray-200 px-6">
      {/* Step circles with connecting lines */}
      <div className="flex items-center">
        {steps.map((step, index) => {
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
              {index < steps.length - 1 && (
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
  const [isScratchMode, setIsScratchMode] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>('ui');

  // Get the appropriate steps array based on mode
  const steps = isScratchMode ? STEPS_SCRATCH : STEPS_PRESET;

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

    // Check if "Make one from scratch" option was selected
    if (template.category === 'manual' || template.id === 'from_scratch') {
      setIsScratchMode(true);
      setEditorMode('ui'); // Start with UI editor by default
      setCurrentStep('background'); // Include background step for scratch mode too
    } else {
      setIsScratchMode(false);
      setCurrentStep('background');
    }
  };

  const handleDeploy = async (template: Template) => {
    // Build background configuration from selected template state
    let background: TemplateBackground = { type: 'standard' };

    if (selectedTemplate?.backgroundType === 'custom' && selectedTemplate.customBackgroundImage) {
      background = {
        type: 'custom',
        dataUri: selectedTemplate.customBackgroundImage,
        mediaType: selectedTemplate.customBackgroundImage.startsWith('data:video') ? 'video' : 'image',
      };
    }

    // Merge background into template structure before saving
    const templateWithBackground: Template = {
      ...template,
      structure: template.structure
        ? {
            ...template.structure,
            background,
          }
        : undefined,
    };

    await createTemplateMutation.mutateAsync(templateWithBackground);
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
    const step = value as Step;
    if (isStepAccessible(step)) {
      setCurrentStep(step);
    }
  };

  // Determine which steps are accessible based on current mode and step
  const isStepAccessible = (step: Step): boolean => {
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);

    // Step is accessible if it's before or equal to current step
    // (and it exists in the current steps array)
    if (stepIndex === -1) return false;
    return stepIndex <= currentIndex;
  };

  const handleStepClick = (step: Step) => {
    if (isStepAccessible(step)) {
      setCurrentStep(step);
    }
  };

  // Get the next step after the editing step
  const handleEditNext = () => {
    setCurrentStep('preview');
  };

  // Get the back step from the editing step
  const handleEditBack = () => {
    if (isScratchMode) {
      setCurrentStep('choose');
      setIsScratchMode(false);
    } else {
      setCurrentStep('background');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfafa]">
      <Tabs value={currentStep} onValueChange={handleTabChange} className="flex-1 flex flex-col">
        {/* Navigation - Mobile Stepper or Desktop Tabs */}
        {isMobile ? (
          <MobileStepper
            currentStep={currentStep}
            steps={steps}
            onStepClick={handleStepClick}
            isStepAccessible={isStepAccessible}
          />
        ) : (
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <TabsList className="w-full max-w-2xl mx-auto bg-transparent h-auto p-0 gap-1">
              {steps.map((step) => (
                <TabsTrigger
                  key={step}
                  value={step}
                  disabled={!isStepAccessible(step)}
                  className="flex-1 data-[state=active]:bg-[#615bff] data-[state=active]:text-white rounded-md px-4 py-2 disabled:opacity-40"
                >
                  {stepLabels[step]}
                </TabsTrigger>
              ))}
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
            {/* Dynamic data-driven template editor with sections and items */}
            <EditTemplateStepV2
              selectedTemplate={selectedTemplate}
              onNext={handleEditNext}
              onBack={handleEditBack}
              onTemplateChange={(updatedTemplate) => setSelectedTemplate(updatedTemplate)}
              editorMode={editorMode}
              onEditorModeChange={setEditorMode}
              isScratchMode={isScratchMode}
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
