/**
 * Template Filters Atom
 *
 * Manages filter state for templates-page.tsx
 * Consolidates 4 useState calls into a single atom
 */

import { atom } from 'jotai';

// ============================================================================
// State Interface
// ============================================================================

export interface TemplateFiltersState {
  searchQuery: string;
  selectedStatus: 'all' | 'certificate' | 'nft';
  currentPage: number;
  linesPerPage: number;
}

// ============================================================================
// Initial State
// ============================================================================

export const initialTemplateFiltersState: TemplateFiltersState = {
  searchQuery: '',
  selectedStatus: 'all',
  currentPage: 1,
  linesPerPage: 10,
};

// ============================================================================
// Atoms
// ============================================================================

/**
 * Main filter atom
 */
export const templateFiltersAtom = atom<TemplateFiltersState>(
  initialTemplateFiltersState
);

/**
 * Derived atoms for individual filter values
 * These allow components to subscribe to specific parts of the filter state
 */
export const templateSearchQueryAtom = atom(
  (get) => get(templateFiltersAtom).searchQuery,
  (get, set, newQuery: string) => {
    set(templateFiltersAtom, {
      ...get(templateFiltersAtom),
      searchQuery: newQuery,
      currentPage: 1, // Reset to first page on search
    });
  }
);

export const templateSelectedStatusAtom = atom(
  (get) => get(templateFiltersAtom).selectedStatus,
  (get, set, newStatus: 'all' | 'certificate' | 'nft') => {
    set(templateFiltersAtom, {
      ...get(templateFiltersAtom),
      selectedStatus: newStatus,
      currentPage: 1, // Reset to first page on filter change
    });
  }
);

export const templateCurrentPageAtom = atom(
  (get) => get(templateFiltersAtom).currentPage,
  (get, set, newPage: number) => {
    set(templateFiltersAtom, {
      ...get(templateFiltersAtom),
      currentPage: newPage,
    });
  }
);

export const templateLinesPerPageAtom = atom(
  (get) => get(templateFiltersAtom).linesPerPage,
  (get, set, newLimit: number) => {
    set(templateFiltersAtom, {
      ...get(templateFiltersAtom),
      linesPerPage: newLimit,
      currentPage: 1, // Reset to first page on limit change
    });
  }
);

/**
 * Reset atom - resets all filters to initial state
 */
export const resetTemplateFiltersAtom = atom(null, (_get, set) => {
  set(templateFiltersAtom, initialTemplateFiltersState);
});
