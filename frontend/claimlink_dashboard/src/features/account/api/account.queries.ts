/**
 * Account Query Hooks
 *
 * React Query hooks for account/user data fetching.
 * Uses AccountService for data access abstraction.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AccountService,
  type UpdateProfileRequest,
} from './account.service';

/**
 * Query key factory for account
 */
export const accountKeys = {
  all: ['account'] as const,
  profile: (principalId: string) =>
    [...accountKeys.all, 'profile', principalId] as const,
  stats: (principalId: string) =>
    [...accountKeys.all, 'stats', principalId] as const,
  activity: (principalId: string) =>
    [...accountKeys.all, 'activity', principalId] as const,
};

/**
 * Fetch user profile
 */
export const useProfile = (principalId: string) => {
  return useQuery({
    queryKey: accountKeys.profile(principalId),
    queryFn: () => AccountService.getProfile(principalId),
    enabled: !!principalId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch account statistics
 */
export const useAccountStats = (principalId: string) => {
  return useQuery({
    queryKey: accountKeys.stats(principalId),
    queryFn: () => AccountService.getAccountStats(principalId),
    enabled: !!principalId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch account activity history
 */
export const useActivityHistory = (principalId: string) => {
  return useQuery({
    queryKey: accountKeys.activity(principalId),
    queryFn: () => AccountService.getActivityHistory(principalId),
    enabled: !!principalId,
    staleTime: 2 * 60 * 1000, // 2 minutes - activity changes more frequently
  });
};

/**
 * Update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      principalId,
      request,
    }: {
      principalId: string;
      request: UpdateProfileRequest;
    }) => AccountService.updateProfile(principalId, request),
    onSuccess: (_, variables) => {
      // Invalidate profile to refetch
      queryClient.invalidateQueries({
        queryKey: accountKeys.profile(variables.principalId),
      });
    },
  });
};

/**
 * Delete account
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (principalId: string) =>
      AccountService.deleteAccount(principalId),
    onSuccess: () => {
      // Clear all queries on account deletion
      queryClient.clear();
    },
  });
};
