import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import { CollectionService } from '../api/collection.service';
import { collectionKeys } from './useListMyCollections';
import type { CreateCollectionArgs } from '../interfaces';

interface UseCreateCollectionOptions {
  onSuccess?: (canisterId: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to create a new collection
 *
 * Note: Requires 15,000 OGY tokens to be approved for spending before calling
 */
export const useCreateCollection = (options?: UseCreateCollectionOptions) => {
  const { authenticatedAgent, isConnected } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: CreateCollectionArgs) => {
      if (!authenticatedAgent) {
        throw new Error('Not authenticated');
      }

      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      return await CollectionService.createCollection(authenticatedAgent, args);
    },
    onSuccess: (canisterId) => {
      // Invalidate collection queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: collectionKeys.all });

      if (options?.onSuccess) {
        options.onSuccess(canisterId);
      }
    },
    onError: (error: Error) => {
      console.error('Failed to create collection:', error);

      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};
