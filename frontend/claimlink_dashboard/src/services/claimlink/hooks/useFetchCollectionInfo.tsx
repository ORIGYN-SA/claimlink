import { useQuery } from '@tanstack/react-query';
import { Principal } from '@dfinity/principal';
import { useAuth } from '@/features/auth';
import { CollectionService } from '../api/collection.service';
import { collectionKeys } from './useListMyCollections';

interface UseFetchCollectionInfoOptions {
  collectionId: string;
  enabled?: boolean;
}

/**
 * Hook to fetch detailed information about a specific collection
 */
export const useFetchCollectionInfo = (options: UseFetchCollectionInfoOptions) => {
  const { unauthenticatedAgent } = useAuth();
  const { collectionId, enabled = true } = options;

  return useQuery({
    queryKey: collectionKeys.detail(collectionId),
    queryFn: async () => {
      if (!unauthenticatedAgent) {
        throw new Error('Agent not available');
      }

      const principal = Principal.fromText(collectionId);
      const result = await CollectionService.getCollectionInfo(
        unauthenticatedAgent,
        principal
      );

      if (!result) {
        throw new Error('Collection not found');
      }

      return result;
    },
    enabled: enabled && !!unauthenticatedAgent && !!collectionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
