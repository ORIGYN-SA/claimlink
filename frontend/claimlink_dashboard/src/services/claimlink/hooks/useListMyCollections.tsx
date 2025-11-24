import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import { CollectionService } from '../api/collection.service';

export const collectionKeys = {
  all: ['collections'] as const,
  lists: () => [...collectionKeys.all, 'list'] as const,
  list: (filters?: { offset?: number; limit?: number }) =>
    [...collectionKeys.lists(), filters] as const,
  myCollections: (filters?: { offset?: number; limit?: number }) =>
    [...collectionKeys.all, 'my', filters] as const,
  details: () => [...collectionKeys.all, 'detail'] as const,
  detail: (id: string) => [...collectionKeys.details(), id] as const,
};

interface UseListMyCollectionsOptions {
  offset?: number;
  limit?: number;
  enabled?: boolean;
}

/**
 * Hook to fetch collections owned by the current user
 */
export const useListMyCollections = (options?: UseListMyCollectionsOptions) => {
  const { authenticatedAgent, isConnected } = useAuth();
  const { offset, limit, enabled = true } = options || {};

  return useQuery({
    queryKey: collectionKeys.myCollections({ offset, limit }),
    queryFn: async () => {
      if (!authenticatedAgent) {
        throw new Error('Not authenticated');
      }
      return await CollectionService.listMyCollections(
        authenticatedAgent,
        offset,
        limit
      );
    },
    enabled: enabled && isConnected && !!authenticatedAgent,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
