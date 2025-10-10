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
}

export interface CampaignFilters {
  search: string;
  status: CampaignStatus | 'all';
  duration: 'all' | 'upcoming' | 'active' | 'ended';
}
