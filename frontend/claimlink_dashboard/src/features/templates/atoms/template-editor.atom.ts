/**
 * Template Editor Atom
 *
 * Manages state for template editing workflow using atomWithReducer
 * Consolidates 12 useState calls from edit-template-step-v2.tsx into a single atom
 */

import { atomWithReducer } from 'jotai/utils';
import type { Template } from '@/shared/data';
import type {
  TemplateItem,
  TemplateLanguage,
} from '../types/template.types';

// ============================================================================
// State Interface
// ============================================================================

export interface TemplateEditorState {
  // Main template data
  template: Template | null;
  searchIndexField: string;

  // Modal states
  modals: {
    addLanguage: boolean;
    deleteLanguage: boolean;
    addField: boolean;
    editField: boolean;
    deleteField: boolean;
  };

  // Selected items for operations
  selectedLanguage: TemplateLanguage | null;
  selectedField: TemplateItem | null;
  selectedSectionId: string;

  // Form states
  languageForm: {
    name: string;
    code: string;
    isDefault: boolean;
  };

  fieldForm: {
    label: string;
    // UI dropdown types - some map to input with different inputType
    type: 'input' | 'textarea' | 'date' | 'badge' | 'image' | 'video' | 'title' | 'readonly';
    inputType: 'text' | 'number' | 'textarea' | 'email' | 'url' | 'date';
    placeholder: string;
    description: string;
    required: boolean;
    badgeStyle: 'default' | 'success' | 'warning' | 'error' | 'info';
  };
}

// ============================================================================
// Actions
// ============================================================================

export type TemplateEditorAction =
  // Template actions
  | { type: 'SET_TEMPLATE'; template: Template | null }
  | { type: 'UPDATE_TEMPLATE'; template: Template }
  | { type: 'SET_SEARCH_INDEX_FIELD'; field: string }

  // Modal actions
  | { type: 'OPEN_ADD_LANGUAGE_MODAL' }
  | { type: 'OPEN_DELETE_LANGUAGE_MODAL'; language: TemplateLanguage }
  | { type: 'OPEN_ADD_FIELD_MODAL'; sectionId: string }
  | { type: 'OPEN_EDIT_FIELD_MODAL'; field: TemplateItem }
  | { type: 'OPEN_DELETE_FIELD_MODAL'; field: TemplateItem }
  | { type: 'CLOSE_ALL_MODALS' }

  // Language actions
  | { type: 'UPDATE_LANGUAGE_FORM'; field: string; value: string | boolean }
  | { type: 'RESET_LANGUAGE_FORM' }
  | { type: 'ADD_LANGUAGE' }
  | { type: 'DELETE_LANGUAGE' }

  // Field actions
  | { type: 'UPDATE_FIELD_FORM'; field: string; value: string | boolean }
  | { type: 'RESET_FIELD_FORM' }
  | { type: 'ADD_FIELD' }
  | { type: 'EDIT_FIELD' }
  | { type: 'DELETE_FIELD' }

  // Reorder actions
  | { type: 'REORDER_ITEMS'; sectionId: string; activeId: string; overId: string };

// ============================================================================
// Initial State
// ============================================================================

export const getInitialTemplateEditorState = (
  template: Template | null
): TemplateEditorState => ({
  template,
  searchIndexField: template?.structure?.searchIndexField || '',
  modals: {
    addLanguage: false,
    deleteLanguage: false,
    addField: false,
    editField: false,
    deleteField: false,
  },
  selectedLanguage: null,
  selectedField: null,
  selectedSectionId: '',
  languageForm: {
    name: '',
    code: '',
    isDefault: false,
  },
  fieldForm: {
    label: '',
    type: 'input',
    inputType: 'text',
    placeholder: '',
    description: '',
    required: false,
    badgeStyle: 'default',
  },
});

// ============================================================================
// Reducer
// ============================================================================

export function templateEditorReducer(
  state: TemplateEditorState,
  action: TemplateEditorAction
): TemplateEditorState {
  switch (action.type) {
    // Template actions
    case 'SET_TEMPLATE':
      return {
        ...state,
        template: action.template,
        searchIndexField: action.template?.structure?.searchIndexField || '',
      };

    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        template: action.template,
      };

    case 'SET_SEARCH_INDEX_FIELD':
      return {
        ...state,
        searchIndexField: action.field,
      };

    // Modal actions
    case 'OPEN_ADD_LANGUAGE_MODAL':
      return {
        ...state,
        modals: { ...state.modals, addLanguage: true },
        languageForm: { name: '', code: '', isDefault: false },
      };

    case 'OPEN_DELETE_LANGUAGE_MODAL':
      return {
        ...state,
        modals: { ...state.modals, deleteLanguage: true },
        selectedLanguage: action.language,
      };

    case 'OPEN_ADD_FIELD_MODAL':
      return {
        ...state,
        modals: { ...state.modals, addField: true },
        selectedSectionId: action.sectionId,
        fieldForm: {
          label: '',
          type: 'input',
          inputType: 'text',
          placeholder: '',
          description: '',
          required: false,
          badgeStyle: 'default',
        },
      };

    case 'OPEN_EDIT_FIELD_MODAL': {
      const inputType =
        action.field.type === 'input'
          ? (action.field as any).inputType || 'text'
          : 'text';
      const placeholder =
        action.field.type === 'input'
          ? (action.field as any).placeholder || ''
          : '';
      const badgeStyle =
        action.field.type === 'badge'
          ? (action.field as any).badgeStyle || 'default'
          : 'default';

      // Determine UI type - reverse map from stored type to UI dropdown value
      let uiType: TemplateEditorState['fieldForm']['type'] = action.field.type as any;
      if (action.field.type === 'input') {
        const storedInputType = (action.field as any).inputType;
        if (storedInputType === 'textarea') {
          uiType = 'textarea';
        } else if (storedInputType === 'date') {
          uiType = 'date';
        } else {
          uiType = 'input';
        }
      }

      return {
        ...state,
        modals: { ...state.modals, editField: true },
        selectedField: action.field,
        fieldForm: {
          label: action.field.label,
          type: uiType,
          inputType,
          placeholder,
          description: action.field.description || '',
          required: action.field.required || false,
          badgeStyle,
        },
      };
    }

    case 'OPEN_DELETE_FIELD_MODAL':
      return {
        ...state,
        modals: { ...state.modals, deleteField: true },
        selectedField: action.field,
      };

    case 'CLOSE_ALL_MODALS':
      return {
        ...state,
        modals: {
          addLanguage: false,
          deleteLanguage: false,
          addField: false,
          editField: false,
          deleteField: false,
        },
        selectedLanguage: null,
        selectedField: null,
        selectedSectionId: '',
      };

    // Language form actions
    case 'UPDATE_LANGUAGE_FORM':
      return {
        ...state,
        languageForm: {
          ...state.languageForm,
          [action.field]: action.value,
        },
      };

    case 'RESET_LANGUAGE_FORM':
      return {
        ...state,
        languageForm: { name: '', code: '', isDefault: false },
      };

    case 'ADD_LANGUAGE': {
      if (
        !state.template?.structure ||
        !state.languageForm.name ||
        !state.languageForm.code
      )
        return state;

      const newLanguage: TemplateLanguage = {
        id: `lang_${Date.now()}`,
        code: state.languageForm.code.toUpperCase(),
        name: state.languageForm.name,
        isDefault: state.languageForm.isDefault,
      };

      const updatedTemplate: Template = {
        ...state.template,
        structure: {
          ...state.template.structure,
          languages: [
            ...(state.template.structure.languages || []),
            newLanguage,
          ],
        },
      };

      return {
        ...state,
        template: updatedTemplate,
        modals: { ...state.modals, addLanguage: false },
      };
    }

    case 'DELETE_LANGUAGE': {
      if (!state.template?.structure || !state.selectedLanguage) return state;

      const updatedTemplate: Template = {
        ...state.template,
        structure: {
          ...state.template.structure,
          languages: state.template.structure.languages?.filter(
            (lang) => lang.id !== state.selectedLanguage?.id
          ),
        },
      };

      return {
        ...state,
        template: updatedTemplate,
        modals: { ...state.modals, deleteLanguage: false },
        selectedLanguage: null,
      };
    }

    // Field form actions
    case 'UPDATE_FIELD_FORM':
      return {
        ...state,
        fieldForm: {
          ...state.fieldForm,
          [action.field]: action.value,
        },
      };

    case 'RESET_FIELD_FORM':
      return {
        ...state,
        fieldForm: {
          label: '',
          type: 'input',
          inputType: 'text',
          placeholder: '',
          description: '',
          required: false,
          badgeStyle: 'default',
        },
      };

    case 'ADD_FIELD': {
      if (
        !state.template?.structure ||
        !state.selectedSectionId ||
        !state.fieldForm.label
      )
        return state;

      // Enforce max 5 data fields on Certificate section
      const targetSection = state.template.structure.sections?.find(
        (s) => s.id === state.selectedSectionId
      );
      if (targetSection?.name === 'Certificate') {
        const fieldType = state.fieldForm.type;
        const isDataField = fieldType !== 'image' && fieldType !== 'title';
        const currentDataFields = targetSection.items.filter(
          (item) => item.type !== 'image' && item.type !== 'title'
        ).length;
        if (isDataField && currentDataFields >= 5) {
          return state; // Silently reject — UI button should be disabled
        }
      }

      // Create field based on type
      let newField: TemplateItem;
      const baseProps = {
        id: `field_${Date.now()}`,
        label: state.fieldForm.label,
        description: state.fieldForm.description,
        required: state.fieldForm.required,
        order: 0,
      };

      switch (state.fieldForm.type) {
        case 'input':
          newField = {
            ...baseProps,
            type: 'input',
            inputType: state.fieldForm.inputType,
            placeholder: state.fieldForm.placeholder,
          };
          break;
        case 'textarea':
          // Textarea is an input with inputType='textarea'
          newField = {
            ...baseProps,
            type: 'input',
            inputType: 'textarea',
            placeholder: state.fieldForm.placeholder,
            multiline: true,
            rows: 4,
          };
          break;
        case 'date':
          // Date is an input with inputType='date'
          newField = {
            ...baseProps,
            type: 'input',
            inputType: 'date',
          };
          break;
        case 'badge':
          newField = {
            ...baseProps,
            type: 'badge',
            badgeStyle: state.fieldForm.badgeStyle,
          };
          break;
        case 'image':
          newField = {
            ...baseProps,
            type: 'image',
          };
          break;
        case 'video':
          newField = {
            ...baseProps,
            type: 'video',
          };
          break;
        case 'title':
          newField = {
            ...baseProps,
            type: 'title',
            style: 'h3',
          };
          break;
        case 'readonly':
          newField = {
            ...baseProps,
            type: 'readonly',
          };
          break;
        default:
          return state;
      }

      const updatedSections = state.template.structure.sections?.map(
        (section) => {
          if (section.id === state.selectedSectionId) {
            const newOrder = section.items.length;
            return {
              ...section,
              items: [...section.items, { ...newField, order: newOrder }],
            };
          }
          return section;
        }
      );

      const updatedTemplate: Template = {
        ...state.template,
        structure: {
          ...state.template.structure,
          sections: updatedSections,
        },
      };

      return {
        ...state,
        template: updatedTemplate,
        modals: { ...state.modals, addField: false },
        selectedSectionId: '',
      };
    }

    case 'EDIT_FIELD': {
      if (!state.template?.structure || !state.selectedField || !state.fieldForm.label)
        return state;

      const updatedSections = state.template.structure.sections?.map(
        (section) => ({
          ...section,
          items: section.items.map((item) => {
            if (item.id !== state.selectedField?.id) return item;

            const baseUpdate = {
              ...item,
              label: state.fieldForm.label,
              description: state.fieldForm.description,
              required: state.fieldForm.required,
            };

            // Map UI type back to storage type
            switch (state.fieldForm.type) {
              case 'input':
                return {
                  ...baseUpdate,
                  type: 'input' as const,
                  inputType: state.fieldForm.inputType,
                  placeholder: state.fieldForm.placeholder,
                };
              case 'textarea':
                return {
                  ...baseUpdate,
                  type: 'input' as const,
                  inputType: 'textarea' as const,
                  placeholder: state.fieldForm.placeholder,
                  multiline: true,
                  rows: 4,
                };
              case 'date':
                return {
                  ...baseUpdate,
                  type: 'input' as const,
                  inputType: 'date' as const,
                };
              case 'badge':
                return {
                  ...baseUpdate,
                  type: 'badge' as const,
                  badgeStyle: state.fieldForm.badgeStyle,
                };
              case 'image':
                return {
                  ...baseUpdate,
                  type: 'image' as const,
                };
              case 'video':
                return {
                  ...baseUpdate,
                  type: 'video' as const,
                };
              case 'title':
                return {
                  ...baseUpdate,
                  type: 'title' as const,
                  style: 'h3' as const,
                };
              case 'readonly':
                return {
                  ...baseUpdate,
                  type: 'readonly' as const,
                };
              default:
                return baseUpdate;
            }
          }),
        })
      );

      const updatedTemplate: Template = {
        ...state.template,
        structure: {
          ...state.template.structure,
          sections: updatedSections,
        },
      };

      return {
        ...state,
        template: updatedTemplate,
        modals: { ...state.modals, editField: false },
        selectedField: null,
      };
    }

    case 'DELETE_FIELD': {
      if (!state.template?.structure || !state.selectedField) return state;

      const updatedSections = state.template.structure.sections?.map(
        (section) => ({
          ...section,
          items: section.items.filter(
            (item) => item.id !== state.selectedField?.id
          ),
        })
      );

      const updatedTemplate: Template = {
        ...state.template,
        structure: {
          ...state.template.structure,
          sections: updatedSections,
        },
      };

      return {
        ...state,
        template: updatedTemplate,
        modals: { ...state.modals, deleteField: false },
        selectedField: null,
      };
    }

    // Reorder items within a section
    case 'REORDER_ITEMS': {
      if (!state.template?.structure) return state;

      const updatedSections = state.template.structure.sections?.map((section) => {
        if (section.id !== action.sectionId) return section;

        const items = [...section.items];
        const oldIndex = items.findIndex(i => i.id === action.activeId);
        const newIndex = items.findIndex(i => i.id === action.overId);

        if (oldIndex === -1 || newIndex === -1) return section;

        // Move item from oldIndex to newIndex
        const [removed] = items.splice(oldIndex, 1);
        items.splice(newIndex, 0, removed);

        // Update order values to match new positions
        const reorderedItems = items.map((item, index) => ({
          ...item,
          order: index,
        }));

        return { ...section, items: reorderedItems };
      });

      const updatedTemplate: Template = {
        ...state.template,
        structure: {
          ...state.template.structure,
          sections: updatedSections,
        },
      };

      return {
        ...state,
        template: updatedTemplate,
      };
    }

    default:
      return state;
  }
}

// ============================================================================
// Atom
// ============================================================================

export const templateEditorAtom = atomWithReducer(
  getInitialTemplateEditorState(null),
  templateEditorReducer
);
