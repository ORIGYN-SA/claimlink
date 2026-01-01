import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type Template } from '@/shared/data';
import { UploadBackgroundStep } from './upload-background-step';

interface ChooseBackgroundStepProps {
  selectedTemplate: Template | null;
  onNext: (backgroundType: 'standard' | 'custom', customImage?: string) => void;
  onBack: () => void;
}

export function ChooseBackgroundStep({ 
  onNext 
}: ChooseBackgroundStepProps) {
  const [selectedBackground, setSelectedBackground] = useState<'standard' | 'custom'>('standard');
  const [showUploadStep, setShowUploadStep] = useState(false);

  const handleNext = () => {
    if (selectedBackground === 'custom') {
      setShowUploadStep(true);
    } else {
      onNext('standard');
    }
  };

  const handleUploadComplete = (customImage: string) => {
    onNext('custom', customImage);
  };

  const handleBackFromUpload = () => {
    setShowUploadStep(false);
  };

  // If user selected custom background, show the upload step
  if (showUploadStep) {
    return (
      <UploadBackgroundStep
        onBack={handleBackFromUpload}
        onNext={handleUploadComplete}
      />
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-medium text-[#222526] mb-2">
          Choose your certificate background
        </h2>
        <p className="text-sm text-[#69737c] max-w-md mx-auto">
          Select how your certificate will appear to viewers during verification and sharing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Standard Background Option */}
        <Card 
          className={`cursor-pointer border-2 transition-all ${
            selectedBackground === 'standard' 
              ? 'border-[#50be8f] shadow-md' 
              : 'border-[#e1e1e1] hover:border-gray-300'
          }`}
          onClick={() => setSelectedBackground('standard')}
        >
          <CardContent className="p-0">
            <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#50be8f]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Standard Background</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-[#222526] mb-2">Standard</h3>
              <p className="text-sm text-[#69737c]">
                Use the default ORIGYN background for a clean, professional display.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Custom Background Option */}
        <Card 
          className={`cursor-pointer border-2 transition-all ${
            selectedBackground === 'custom' 
              ? 'border-[#50be8f] shadow-md' 
              : 'border-[#e1e1e1] hover:border-gray-300'
          }`}
          onClick={() => setSelectedBackground('custom')}
        >
          <CardContent className="p-0">
            <div className="h-64 bg-gray-100 rounded-t-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Upload Custom Image</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-[#222526] mb-2">Custom</h3>
              <p className="text-sm text-[#69737c]">
                Upload your own image to personalize the look of your certificate.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleNext}
          className="bg-[#222526] hover:bg-[#333333] text-white px-10 py-2 rounded-full"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
