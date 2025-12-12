import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import { CollectionService } from '../api/collection.service';
import { collectionKeys } from './useListMyCollections';

interface UseListAllCollectionsOptions {
  offset?: number;
  limit?: number;
  enabled?: boolean;
}

/**
 * Hook to fetch all collections in the system (public query)
 */
export const useListAllCollections = (options?: UseListAllCollectionsOptions) => {
  const { unauthenticatedAgent } = useAuth();
  const { offset, limit, enabled = true } = options || {};

  return useQuery({
    queryKey: collectionKeys.list({ offset, limit }),
    queryFn: async () => {
      if (!unauthenticatedAgent) {
        throw new Error('Agent not available');
      }
      return await CollectionService.listAllCollections(
        unauthenticatedAgent,
        offset,
        limit
      );
    },
    enabled: enabled && !!unauthenticatedAgent,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
