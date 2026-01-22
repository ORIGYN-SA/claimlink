/**
 * Collection Filters Atom
 *
 * Manages filter state for collections-page.tsx
 * Consolidates 5 useState calls into a single atom
 */

import { atom } from 'jotai';
import type { ViewMode, CollectionStatus } from '../types/collection.types';

// ============================================================================
// State Interface
// ============================================================================

export interface CollectionFiltersState {
  viewMode: ViewMode;
  searchQuery: string;
  statusFilter: CollectionStatus;
  currentPage: number;
  itemsPerPage: number;
}

// ============================================================================
// Initial State
// ============================================================================

export const initialCollectionFiltersState: CollectionFiltersState = {
  viewMode: 'grid',
  searchQuery: '',
  statusFilter: 'all',
  currentPage: 1,
  itemsPerPage: 10,
};

// ============================================================================
// Atoms
// ============================================================================

/**
 * Main filter atom
 */
export const collectionFiltersAtom = atom<CollectionFiltersState>(
  initialCollectionFiltersState
);

/**
 * Derived atoms for individual filter values
 */
export const collectionViewModeAtom = atom(
  (get) => get(collectionFiltersAtom).viewMode,
  (get, set, newMode: ViewMode) => {
    set(collectionFiltersAtom, {
      ...get(collectionFiltersAtom),
      viewMode: newMode,
    });
  }
);

export const collectionSearchQueryAtom = atom(
  (get) => get(collectionFiltersAtom).searchQuery,
  (get, set, newQuery: string) => {
    set(collectionFiltersAtom, {
      ...get(collectionFiltersAtom),
      searchQuery: newQuery,
      currentPage: 1, // Reset to first page on search
    });
  }
);

export const collectionStatusFilterAtom = atom(
  (get) => get(collectionFiltersAtom).statusFilter,
  (get, set, newStatus: CollectionStatus) => {
    set(collectionFiltersAtom, {
      ...get(collectionFiltersAtom),
      statusFilter: newStatus,
      currentPage: 1, // Reset to first page on filter change
    });
  }
);

export const collectionCurrentPageAtom = atom(
  (get) => get(collectionFiltersAtom).currentPage,
  (get, set, newPage: number) => {
    set(collectionFiltersAtom, {
      ...get(collectionFiltersAtom),
      currentPage: newPage,
    });
  }
);

export const collectionItemsPerPageAtom = atom(
  (get) => get(collectionFiltersAtom).itemsPerPage,
  (get, set, newLimit: number) => {
    set(collectionFiltersAtom, {
      ...get(collectionFiltersAtom),
      itemsPerPage: newLimit,
      currentPage: 1, // Reset to first page on limit change
    });
  }
);

/**
 * Reset atom - resets all filters to initial state
 */
export const resetCollectionFiltersAtom = atom(null, (_get, set) => {
  set(collectionFiltersAtom, initialCollectionFiltersState);
});
