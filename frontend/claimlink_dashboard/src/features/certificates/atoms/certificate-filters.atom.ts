/**
 * Certificate Filters Atom
 *
 * Manages filter state for certificate list pages
 * Ready for certificate filtering implementation
 */

import { atom } from 'jotai';
import type { CertificateStatus } from '../types/certificate.types';

// ============================================================================
// State Interface
// ============================================================================

export interface CertificateFiltersState {
  searchQuery: string;
  statusFilter: CertificateStatus | 'all';
  currentPage: number;
  itemsPerPage: number;
}

// ============================================================================
// Initial State
// ============================================================================

export const initialCertificateFiltersState: CertificateFiltersState = {
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
export const certificateFiltersAtom = atom<CertificateFiltersState>(
  initialCertificateFiltersState
);

/**
 * Derived atoms for individual filter values
 */
export const certificateSearchQueryAtom = atom(
  (get) => get(certificateFiltersAtom).searchQuery,
  (get, set, newQuery: string) => {
    set(certificateFiltersAtom, {
      ...get(certificateFiltersAtom),
      searchQuery: newQuery,
      currentPage: 1, // Reset to first page on search
    });
  }
);

export const certificateStatusFilterAtom = atom(
  (get) => get(certificateFiltersAtom).statusFilter,
  (get, set, newStatus: CertificateStatus | 'all') => {
    set(certificateFiltersAtom, {
      ...get(certificateFiltersAtom),
      statusFilter: newStatus,
      currentPage: 1, // Reset to first page on filter change
    });
  }
);

export const certificateCurrentPageAtom = atom(
  (get) => get(certificateFiltersAtom).currentPage,
  (get, set, newPage: number) => {
    set(certificateFiltersAtom, {
      ...get(certificateFiltersAtom),
      currentPage: newPage,
    });
  }
);

export const certificateItemsPerPageAtom = atom(
  (get) => get(certificateFiltersAtom).itemsPerPage,
  (get, set, newLimit: number) => {
    set(certificateFiltersAtom, {
      ...get(certificateFiltersAtom),
      itemsPerPage: newLimit,
      currentPage: 1, // Reset to first page on limit change
    });
  }
);

/**
 * Reset atom - resets all filters to initial state
 */
export const resetCertificateFiltersAtom = atom(null, (_get, set) => {
  set(certificateFiltersAtom, initialCertificateFiltersState);
});
