/**
 * Campaign Filters Atom
 *
 * Manages filter state for campaigns-page.tsx
 * Consolidates 4 useState calls into a single atom
 */

import { atom } from 'jotai';
import type { CampaignFilters, ViewMode } from '../types/campaign.types';

// ============================================================================
// State Interface
// ============================================================================

export interface CampaignFiltersState {
  viewMode: ViewMode;
  filters: CampaignFilters;
  currentPage: number;
  linesPerPage: number;
}

// ============================================================================
// Initial State
// ============================================================================

export const initialCampaignFiltersState: CampaignFiltersState = {
  viewMode: 'grid',
  filters: {
    search: '',
    status: 'all',
    duration: 'all',
  },
  currentPage: 1,
  linesPerPage: 10,
};

// ============================================================================
// Atoms
// ============================================================================

/**
 * Main filter atom
 */
export const campaignFiltersAtom = atom<CampaignFiltersState>(
  initialCampaignFiltersState
);

/**
 * Derived atoms for individual filter values
 */
export const campaignViewModeAtom = atom(
  (get) => get(campaignFiltersAtom).viewMode,
  (get, set, newMode: ViewMode) => {
    set(campaignFiltersAtom, {
      ...get(campaignFiltersAtom),
      viewMode: newMode,
    });
  }
);

export const campaignStatusFilterAtom = atom(
  (get) => get(campaignFiltersAtom).filters.status,
  (get, set, newStatus: CampaignFilters['status']) => {
    set(campaignFiltersAtom, {
      ...get(campaignFiltersAtom),
      filters: {
        ...get(campaignFiltersAtom).filters,
        status: newStatus,
      },
      currentPage: 1, // Reset to first page on filter change
    });
  }
);

export const campaignDurationFilterAtom = atom(
  (get) => get(campaignFiltersAtom).filters.duration,
  (get, set, newDuration: CampaignFilters['duration']) => {
    set(campaignFiltersAtom, {
      ...get(campaignFiltersAtom),
      filters: {
        ...get(campaignFiltersAtom).filters,
        duration: newDuration,
      },
      currentPage: 1, // Reset to first page on filter change
    });
  }
);

export const campaignCurrentPageAtom = atom(
  (get) => get(campaignFiltersAtom).currentPage,
  (get, set, newPage: number) => {
    set(campaignFiltersAtom, {
      ...get(campaignFiltersAtom),
      currentPage: newPage,
    });
  }
);

export const campaignLinesPerPageAtom = atom(
  (get) => get(campaignFiltersAtom).linesPerPage,
  (get, set, newLimit: number) => {
    set(campaignFiltersAtom, {
      ...get(campaignFiltersAtom),
      linesPerPage: newLimit,
      currentPage: 1, // Reset to first page on limit change
    });
  }
);

/**
 * Reset atom - resets all filters to initial state
 */
export const resetCampaignFiltersAtom = atom(null, (_get, set) => {
  set(campaignFiltersAtom, initialCampaignFiltersState);
});
