import type { Campaign, CreateCampaignInput } from '../types/campaign.types';
import { mockCampaigns } from '@/shared/data/campaigns';

// Simple in-memory campaign service (will be replaced with real API later)
export const campaignService = {
  async createCampaign(input: CreateCampaignInput): Promise<Campaign> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create new campaign object
    const now = new Date().toISOString();
    const newCampaign: Campaign = {
      id: `campaign_${Date.now()}`,
      name: input.name,
      description: input.description,
      collectionId: input.collectionId,
      imageUrl: '', // Will be set from collection
      claimedCount: 0,
      totalCount: input.maxClaims || 100,
      status: 'Draft',
      createdAt: now,
      maxClaims: input.maxClaims,
      claimDuration: input.claimDuration,
      startDate: input.startDate,
    };

    // In a real app, this would save to backend
    mockCampaigns.push(newCampaign);

    return newCampaign;
  },

  async getCampaigns(): Promise<Campaign[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return mockCampaigns;
  },

  async getCampaign(id: string): Promise<Campaign | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));

    return mockCampaigns.find(c => c.id === id) || null;
  }
};
