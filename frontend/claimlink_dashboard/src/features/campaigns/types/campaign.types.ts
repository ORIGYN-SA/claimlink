// Campaign status types
export type CampaignStatus = 'Active' | 'Ready' | 'Finished' | 'Draft';

// Campaign timer/badge types
export type CampaignTimer = 'Urgent' | 'Ongoing' | 'Starting Soon' | 'Finished';

export interface Campaign {
  id: string;
  name: string;
  imageUrl: string;
  claimedCount: number;
  totalCount: number;
  status: CampaignStatus;
  timerText?: string;
  timerType?: CampaignTimer;
  createdAt: string;
  endDate?: string;
  description?: string;
  collectionId: string;
  maxClaims?: number;
  claimDuration?: number; // in days
  startDate?: string;
}

export interface CampaignFilters {
  search: string;
  status: CampaignStatus | 'all';
  duration: 'all' | 'upcoming' | 'active' | 'ended';
}

// Campaign creation types
export interface CreateCampaignInput {
  name: string;
  description?: string;
  collectionId: string;
  maxClaims?: number;
  claimDuration: number; // in days
  startDate?: string;
}

export interface CampaignFormData {
  name: string;
  description: string;
  maxClaims: number;
  claimDuration: string; // '1' | '3' | '7' | '14' | '30' | '90' | 'unlimited'
  startDate: string;
}
