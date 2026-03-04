import { useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SelectCollectionStep } from '@/features/campaigns';
import { ConfigureCampaignStep } from '@/features/campaigns';
import { campaignService } from '../api/campaigns.service';
import { campaignCreatorAtom } from '../atoms/campaign-creator.atom';
import type { Collection } from '@/features/collections/types/collection.types';
import type { CreateCampaignInput } from '../types/campaign.types';

/**
 * SMART COMPONENT - Manages state and business logic
 * Handles all data fetching, state management, and side effects
 * Delegates presentation to dumb components
 *
 * Uses campaignCreatorAtom for workflow state management
 */
export function NewCampaignPage() {
  const navigate = useNavigate();
  const [state, dispatch] = useAtom(campaignCreatorAtom);

  // Refs for file inputs
  const coverImageInputRef = useRef<HTMLInputElement | null>(null);
  const whitelistCsvInputRef = useRef<HTMLInputElement | null>(null);

  // Collection selection handler
  const handleCollectionSelect = (collection: Collection) => {
    dispatch({ type: 'SELECT_COLLECTION', collection });
  };

  // Tab navigation handler
  const handleTabChange = (value: string) => {
    if (value === 'select') {
      dispatch({ type: 'GO_TO_SELECT' });
    } else if (value === 'configure' && state.currentStep === 'configure') {
      dispatch({ type: 'GO_TO_CONFIGURE' });
    }
  };

  // Form field change handler
  const handleFormChange = (field: string, value: string | number) => {
    dispatch({
      type: 'UPDATE_FORM_FIELD',
      field: field as keyof typeof state.formData,
      value
    });
  };

  // Cover image handlers
  const handleCoverImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch({
          type: 'SET_COVER_IMAGE_PREVIEW',
          preview: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageRemove = () => {
    dispatch({ type: 'REMOVE_COVER_IMAGE' });
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = '';
    }
  };

  const handleCoverImageUploadClick = () => {
    coverImageInputRef.current?.click();
  };

  // Whitelist CSV handlers
  const handleWhitelistCsvSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch({ type: 'SET_WHITELIST_CSV_FILE', fileName: file.name });

      // Parse CSV file
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        // Simple CSV parsing - split by lines and filter empty lines
        const addresses = text
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        dispatch({ type: 'SET_WHITELIST_ADDRESSES', addresses });
      };
      reader.readAsText(file);
    }
  };

  const handleWhitelistCsvRemove = () => {
    dispatch({ type: 'CLEAR_WHITELIST' });
    if (whitelistCsvInputRef.current) {
      whitelistCsvInputRef.current.value = '';
    }
  };

  const handleWhitelistCsvUploadClick = () => {
    whitelistCsvInputRef.current?.click();
  };

  // Manual whitelist handlers
  const handleWhitelistInputChange = (value: string) => {
    dispatch({ type: 'SET_WHITELIST_INPUT', input: value });
  };

  const handleAddToWhitelist = () => {
    if (state.whitelistInput.trim()) {
      dispatch({
        type: 'ADD_WHITELIST_ADDRESS',
        address: state.whitelistInput.trim()
      });
      dispatch({ type: 'SET_WHITELIST_INPUT', input: '' });
    }
  };

  // Redirect URL handler
  const handleRedirectUrlChange = (value: string) => {
    dispatch({ type: 'SET_REDIRECT_URL', url: value });
  };

  // Form submission handler
  const handleSubmit = async () => {
    if (!state.formData.name.trim() || !state.selectedCollection) return;

    dispatch({ type: 'SET_LOADING', isLoading: true });

    try {
      // Convert form data to API input
      const campaignInput: CreateCampaignInput = {
        name: state.formData.name,
        description: state.formData.description,
        collectionId: state.selectedCollection.id,
        maxClaims: state.formData.maxClaims,
        claimDuration: state.formData.claimDuration === 'unlimited' ? 0 : parseInt(state.formData.claimDuration),
        startDate: state.formData.startDate || undefined,
      };

      await campaignService.createCampaign(campaignInput);

      // Reset state and navigate to campaigns list on success
      dispatch({ type: 'RESET_ALL' });
      navigate({ to: '/campaigns' });
    } catch (error) {
      console.error('Failed to create campaign:', error);
      // TODO: Show error toast
    } finally {
      dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  };

  const isConfigureAccessible = state.currentStep === 'configure';

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfafa]">
      <Tabs value={state.currentStep} onValueChange={handleTabChange} className="flex-1 flex flex-col">
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
              selectedCollection={state.selectedCollection}
              formData={state.formData}
              isLoading={state.isLoading}
              coverImagePreview={state.coverImagePreview}
              coverImageInputRef={coverImageInputRef}
              whitelistCsvFileName={state.whitelistCsvFileName}
              whitelistCsvInputRef={whitelistCsvInputRef}
              whitelistAddresses={state.whitelistAddresses}
              whitelistInput={state.whitelistInput}
              redirectUrl={state.redirectUrl}
              onFormChange={handleFormChange}
              onCoverImageSelect={handleCoverImageSelect}
              onCoverImageRemove={handleCoverImageRemove}
              onCoverImageUploadClick={handleCoverImageUploadClick}
              onWhitelistCsvSelect={handleWhitelistCsvSelect}
              onWhitelistCsvRemove={handleWhitelistCsvRemove}
              onWhitelistCsvUploadClick={handleWhitelistCsvUploadClick}
              onWhitelistInputChange={handleWhitelistInputChange}
              onAddToWhitelist={handleAddToWhitelist}
              onRedirectUrlChange={handleRedirectUrlChange}
              onBack={() => dispatch({ type: 'GO_TO_SELECT' })}
              onSubmit={handleSubmit}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
