/**
 * Campaign Creator Atom
 *
 * Manages state for campaign creation workflow using atomWithReducer
 * Consolidates 9 useState calls from new-campaign-page.tsx into a single atom
 */

import { atomWithReducer } from 'jotai/utils';
import type { Collection } from '@/features/collections/types/collection.types';
import type { CampaignFormData } from '../types/campaign.types';

// ============================================================================
// State Interface
// ============================================================================

export interface CampaignCreatorState {
  // Workflow step
  currentStep: 'select' | 'configure';

  // Collection selection
  selectedCollection: Collection | null;

  // Form data
  formData: CampaignFormData;

  // Loading state
  isLoading: boolean;

  // Cover image
  coverImagePreview: string | null;

  // Whitelist
  whitelistCsvFileName: string | null;
  whitelistAddresses: string[];
  whitelistInput: string;

  // Redirect URL
  redirectUrl: string;
}

// ============================================================================
// Actions
// ============================================================================

export type CampaignCreatorAction =
  // Step navigation
  | { type: 'SET_STEP'; step: 'select' | 'configure' }
  | { type: 'GO_TO_CONFIGURE' }
  | { type: 'GO_TO_SELECT' }

  // Collection selection
  | { type: 'SELECT_COLLECTION'; collection: Collection }

  // Form actions
  | { type: 'UPDATE_FORM_FIELD'; field: keyof CampaignFormData; value: string | number }
  | { type: 'RESET_FORM' }

  // Loading state
  | { type: 'SET_LOADING'; isLoading: boolean }

  // Cover image actions
  | { type: 'SET_COVER_IMAGE_PREVIEW'; preview: string | null }
  | { type: 'REMOVE_COVER_IMAGE' }

  // Whitelist actions
  | { type: 'SET_WHITELIST_CSV_FILE'; fileName: string }
  | { type: 'SET_WHITELIST_ADDRESSES'; addresses: string[] }
  | { type: 'SET_WHITELIST_INPUT'; input: string }
  | { type: 'ADD_WHITELIST_ADDRESS'; address: string }
  | { type: 'CLEAR_WHITELIST' }

  // Redirect URL
  | { type: 'SET_REDIRECT_URL'; url: string }

  // Reset all
  | { type: 'RESET_ALL' };

// ============================================================================
// Initial State
// ============================================================================

export const getInitialCampaignCreatorState = (): CampaignCreatorState => ({
  currentStep: 'select',
  selectedCollection: null,
  formData: {
    name: '',
    description: '',
    maxClaims: 100,
    claimDuration: '7',
    startDate: '',
  },
  isLoading: false,
  coverImagePreview: null,
  whitelistCsvFileName: null,
  whitelistAddresses: [],
  whitelistInput: '',
  redirectUrl: '',
});

// ============================================================================
// Reducer
// ============================================================================

export function campaignCreatorReducer(
  state: CampaignCreatorState,
  action: CampaignCreatorAction
): CampaignCreatorState {
  switch (action.type) {
    // Step navigation
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.step,
      };

    case 'GO_TO_CONFIGURE':
      return {
        ...state,
        currentStep: 'configure',
      };

    case 'GO_TO_SELECT':
      return {
        ...state,
        currentStep: 'select',
      };

    // Collection selection
    case 'SELECT_COLLECTION':
      return {
        ...state,
        selectedCollection: action.collection,
        currentStep: 'configure',
        // Adjust maxClaims if needed
        formData: {
          ...state.formData,
          maxClaims: Math.min(state.formData.maxClaims, action.collection.itemCount),
        },
      };

    // Form actions
    case 'UPDATE_FORM_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        },
      };

    case 'RESET_FORM':
      return {
        ...state,
        formData: {
          name: '',
          description: '',
          maxClaims: 100,
          claimDuration: '7',
          startDate: '',
        },
      };

    // Loading state
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      };

    // Cover image actions
    case 'SET_COVER_IMAGE_PREVIEW':
      return {
        ...state,
        coverImagePreview: action.preview,
      };

    case 'REMOVE_COVER_IMAGE':
      return {
        ...state,
        coverImagePreview: null,
      };

    // Whitelist actions
    case 'SET_WHITELIST_CSV_FILE':
      return {
        ...state,
        whitelistCsvFileName: action.fileName,
      };

    case 'SET_WHITELIST_ADDRESSES':
      return {
        ...state,
        whitelistAddresses: action.addresses,
      };

    case 'SET_WHITELIST_INPUT':
      return {
        ...state,
        whitelistInput: action.input,
      };

    case 'ADD_WHITELIST_ADDRESS':
      return {
        ...state,
        whitelistAddresses: [...state.whitelistAddresses, action.address],
      };

    case 'CLEAR_WHITELIST':
      return {
        ...state,
        whitelistCsvFileName: null,
        whitelistAddresses: [],
        whitelistInput: '',
      };

    // Redirect URL
    case 'SET_REDIRECT_URL':
      return {
        ...state,
        redirectUrl: action.url,
      };

    // Reset all
    case 'RESET_ALL':
      return getInitialCampaignCreatorState();

    default:
      return state;
  }
}

// ============================================================================
// Atom
// ============================================================================

export const campaignCreatorAtom = atomWithReducer(
  getInitialCampaignCreatorState(),
  campaignCreatorReducer
);
