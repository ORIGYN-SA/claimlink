/**
 * Campaign Query Hooks
 *
 * React Query hooks for campaign data fetching and mutations.
 * Uses campaignService for data access abstraction.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService } from './campaigns.service';
import type { CreateCampaignInput } from '../types/campaign.types';

/**
 * Query key factory for campaigns
 */
export const campaignKeys = {
  all: ['campaigns'] as const,
  list: () => [...campaignKeys.all, 'list'] as const,
  detail: (id: string) => [...campaignKeys.all, 'detail', id] as const,
};

/**
 * Fetch all campaigns
 */
export const useCampaigns = () => {
  return useQuery({
    queryKey: campaignKeys.list(),
    queryFn: () => campaignService.getCampaigns(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch a single campaign by ID
 */
export const useCampaign = (id: string) => {
  return useQuery({
    queryKey: campaignKeys.detail(id),
    queryFn: () => campaignService.getCampaign(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new campaign
 */
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCampaignInput) => campaignService.createCampaign(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.list() });
    },
  });
};
