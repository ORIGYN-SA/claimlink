/**
 * Collection Creator Atom
 *
 * Manages state for collection creation workflow using atomWithReducer
 * Ready for new-collection-page.tsx state migration
 */

import { atomWithReducer } from 'jotai/utils';

// ============================================================================
// State Interface
// ============================================================================

export interface CollectionCreatorState {
  // Workflow step
  step: 'info' | 'template' | 'review' | 'creating' | 'success';

  // Form data
  title: string;
  description: string;
  imageUrl: string | null;

  // Template selection
  selectedTemplateId: string | null;

  // Loading state
  isLoading: boolean;

  // Success data
  createdCollectionId: string | null;
}

// ============================================================================
// Actions
// ============================================================================

export type CollectionCreatorAction =
  // Step navigation
  | { type: 'SET_STEP'; step: 'info' | 'template' | 'review' | 'creating' | 'success' }
  | { type: 'GO_TO_INFO' }
  | { type: 'GO_TO_TEMPLATE' }
  | { type: 'GO_TO_REVIEW' }
  | { type: 'START_CREATING' }
  | { type: 'CREATION_SUCCESS'; collectionId: string }

  // Form actions
  | { type: 'SET_TITLE'; title: string }
  | { type: 'SET_DESCRIPTION'; description: string }
  | { type: 'SET_IMAGE_URL'; url: string | null }

  // Template selection
  | { type: 'SELECT_TEMPLATE'; templateId: string }

  // Loading state
  | { type: 'SET_LOADING'; isLoading: boolean }

  // Reset
  | { type: 'RESET_ALL' };

// ============================================================================
// Initial State
// ============================================================================

export const getInitialCollectionCreatorState = (): CollectionCreatorState => ({
  step: 'info',
  title: '',
  description: '',
  imageUrl: null,
  selectedTemplateId: null,
  isLoading: false,
  createdCollectionId: null,
});

// ============================================================================
// Reducer
// ============================================================================

export function collectionCreatorReducer(
  state: CollectionCreatorState,
  action: CollectionCreatorAction
): CollectionCreatorState {
  switch (action.type) {
    // Step navigation
    case 'SET_STEP':
      return {
        ...state,
        step: action.step,
      };

    case 'GO_TO_INFO':
      return {
        ...state,
        step: 'info',
      };

    case 'GO_TO_TEMPLATE':
      return {
        ...state,
        step: 'template',
      };

    case 'GO_TO_REVIEW':
      return {
        ...state,
        step: 'review',
      };

    case 'START_CREATING':
      return {
        ...state,
        step: 'creating',
        isLoading: true,
      };

    case 'CREATION_SUCCESS':
      return {
        ...state,
        step: 'success',
        isLoading: false,
        createdCollectionId: action.collectionId,
      };

    // Form actions
    case 'SET_TITLE':
      return {
        ...state,
        title: action.title,
      };

    case 'SET_DESCRIPTION':
      return {
        ...state,
        description: action.description,
      };

    case 'SET_IMAGE_URL':
      return {
        ...state,
        imageUrl: action.url,
      };

    // Template selection
    case 'SELECT_TEMPLATE':
      return {
        ...state,
        selectedTemplateId: action.templateId,
      };

    // Loading state
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      };

    // Reset
    case 'RESET_ALL':
      return getInitialCollectionCreatorState();

    default:
      return state;
  }
}

// ============================================================================
// Atom
// ============================================================================

export const collectionCreatorAtom = atomWithReducer(
  getInitialCollectionCreatorState(),
  collectionCreatorReducer
);
