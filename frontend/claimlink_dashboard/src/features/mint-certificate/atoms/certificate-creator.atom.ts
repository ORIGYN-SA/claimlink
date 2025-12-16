/**
 * Certificate Creator Atom
 *
 * Manages state for certificate minting workflow using atomWithReducer
 * Consolidates 5 useState calls from create-certificate-page-v2.tsx into a single atom
 */

import { atomWithReducer } from 'jotai/utils';
import type { Template } from '@/shared/data';
import type { CertificateFormData } from '@/features/templates/types/template.types';

// ============================================================================
// State Interface
// ============================================================================

export interface CertificateCreatorState {
  // Template and collection selection
  selectedTemplate: Template | null;
  selectedCollection: string;

  // Form data
  formData: CertificateFormData;

  // Validation
  validationErrors: {
    [key: string]: string;
  };

  // File uploads
  fileFields: Map<string, File[]>;
}

// ============================================================================
// Actions
// ============================================================================

export type CertificateCreatorAction =
  // Template/Collection selection
  | { type: 'SET_SELECTED_TEMPLATE'; template: Template | null }
  | { type: 'SET_SELECTED_COLLECTION'; collectionId: string }

  // Form actions
  | { type: 'UPDATE_FORM_DATA'; data: Partial<CertificateFormData> }
  | { type: 'SET_FORM_FIELD'; field: string; value: unknown }
  | { type: 'RESET_FORM_DATA' }

  // Validation
  | { type: 'SET_VALIDATION_ERROR'; field: string; error: string }
  | { type: 'CLEAR_VALIDATION_ERROR'; field: string }
  | { type: 'CLEAR_ALL_VALIDATION_ERRORS' }

  // File uploads
  | { type: 'SET_FILE_FIELD'; field: string; files: File[] }
  | { type: 'REMOVE_FILE_FIELD'; field: string }
  | { type: 'CLEAR_ALL_FILE_FIELDS' }

  // Reset all
  | { type: 'RESET_ALL' };

// ============================================================================
// Initial State
// ============================================================================

export const getInitialCertificateCreatorState = (): CertificateCreatorState => ({
  selectedTemplate: null,
  selectedCollection: '',
  formData: {},
  validationErrors: {},
  fileFields: new Map(),
});

// ============================================================================
// Reducer
// ============================================================================

export function certificateCreatorReducer(
  state: CertificateCreatorState,
  action: CertificateCreatorAction
): CertificateCreatorState {
  switch (action.type) {
    // Template/Collection selection
    case 'SET_SELECTED_TEMPLATE':
      return {
        ...state,
        selectedTemplate: action.template,
      };

    case 'SET_SELECTED_COLLECTION':
      return {
        ...state,
        selectedCollection: action.collectionId,
      };

    // Form actions
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.data,
        } as CertificateFormData,
      };

    case 'SET_FORM_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        } as CertificateFormData,
      };

    case 'RESET_FORM_DATA':
      return {
        ...state,
        formData: {},
      };

    // Validation
    case 'SET_VALIDATION_ERROR':
      return {
        ...state,
        validationErrors: {
          ...state.validationErrors,
          [action.field]: action.error,
        },
      };

    case 'CLEAR_VALIDATION_ERROR': {
      const { [action.field]: _, ...remainingErrors } = state.validationErrors;
      return {
        ...state,
        validationErrors: remainingErrors,
      };
    }

    case 'CLEAR_ALL_VALIDATION_ERRORS':
      return {
        ...state,
        validationErrors: {},
      };

    // File uploads
    case 'SET_FILE_FIELD': {
      const newFileFields = new Map(state.fileFields);
      newFileFields.set(action.field, action.files);
      return {
        ...state,
        fileFields: newFileFields,
      };
    }

    case 'REMOVE_FILE_FIELD': {
      const newFileFields = new Map(state.fileFields);
      newFileFields.delete(action.field);
      return {
        ...state,
        fileFields: newFileFields,
      };
    }

    case 'CLEAR_ALL_FILE_FIELDS':
      return {
        ...state,
        fileFields: new Map(),
      };

    // Reset all
    case 'RESET_ALL':
      return getInitialCertificateCreatorState();

    default:
      return state;
  }
}

// ============================================================================
// Atom
// ============================================================================

export const certificateCreatorAtom = atomWithReducer(
  getInitialCertificateCreatorState(),
  certificateCreatorReducer
);
