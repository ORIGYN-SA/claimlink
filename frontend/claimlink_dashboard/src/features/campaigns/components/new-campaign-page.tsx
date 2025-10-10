import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SelectCollectionStep } from '@/features/campaigns';
import { ConfigureCampaignStep } from '@/features/campaigns';
import type { Collection } from '@/features/collections/types/collection.types';

type Step = 'select' | 'configure';

export function NewCampaignPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  const handleCollectionSelect = (collection: Collection) => {
    setSelectedCollection(collection);
    setCurrentStep('configure');
  };

  const handleTabChange = (value: string) => {
    // Only allow navigation to completed steps or current step
    if (value === 'select') {
      setCurrentStep('select');
    } else if (value === 'configure' && (currentStep === 'configure')) {
      setCurrentStep('configure');
    }
  };

  // Determine which steps are accessible
  const isConfigureAccessible = currentStep === 'configure';

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfafa]">
      <Tabs value={currentStep} onValueChange={handleTabChange} className="flex-1 flex flex-col">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <TabsList className="w-full max-w-2xl mx-auto bg-transparent h-auto p-0 gap-1">
            <TabsTrigger
              value="select"
              className="flex-1 data-[state=active]:bg-[#615bff] data-[state=active]:text-white rounded-md px-4 py-2"
            >
              Select collection
            </TabsTrigger>
            <TabsTrigger
              value="configure"
              disabled={!isConfigureAccessible}
              className="flex-1 data-[state=active]:bg-[#615bff] data-[state=active]:text-white rounded-md px-4 py-2 disabled:opacity-40"
            >
              Set your campaign
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <TabsContent value="select" className="mt-0 w-full flex justify-center">
            <SelectCollectionStep onNext={handleCollectionSelect} />
          </TabsContent>

          <TabsContent value="configure" className="mt-0 w-full flex justify-center">
            <ConfigureCampaignStep
              selectedCollection={selectedCollection}
              onBack={() => setCurrentStep('select')}
              onComplete={() => navigate({ to: '/campaigns' })}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
