/**
 * Collections Query Hooks
 *
 * React Query hooks for collection data fetching.
 * Uses CollectionsService for data access abstraction.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CollectionsService,
  type CollectionFilters,
  type CreateCollectionRequest,
  type UpdateCollectionRequest,
} from './collections.service';

/**
 * Query key factory for collections
 */
export const collectionsKeys = {
  all: ['collections'] as const,
  lists: () => [...collectionsKeys.all, 'list'] as const,
  list: (filters?: CollectionFilters) =>
    [...collectionsKeys.lists(), filters] as const,
  detail: (id: string) => [...collectionsKeys.all, 'detail', id] as const,
  stats: () => [...collectionsKeys.all, 'stats'] as const,
};

/**
 * Fetch all collections with optional filters
 */
export const useCollections = (filters?: CollectionFilters) => {
  return useQuery({
    queryKey: collectionsKeys.list(filters),
    queryFn: () => CollectionsService.getCollections(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch a single collection by ID
 */
export const useCollection = (collectionId: string) => {
  return useQuery({
    queryKey: collectionsKeys.detail(collectionId),
    queryFn: () => CollectionsService.getCollectionById(collectionId),
    enabled: !!collectionId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch collection statistics
 */
export const useCollectionStats = () => {
  return useQuery({
    queryKey: collectionsKeys.stats(),
    queryFn: () => CollectionsService.getCollectionStats(),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new collection
 */
export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCollectionRequest) =>
      CollectionsService.createCollection(request),
    onSuccess: () => {
      // Invalidate collections list to refetch
      queryClient.invalidateQueries({
        queryKey: collectionsKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: collectionsKeys.stats(),
      });
    },
  });
};

/**
 * Update an existing collection
 */
export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateCollectionRequest) =>
      CollectionsService.updateCollection(request),
    onSuccess: (_, variables) => {
      // Invalidate collection detail to refetch
      queryClient.invalidateQueries({
        queryKey: collectionsKeys.detail(variables.id),
      });
      // Invalidate collections list
      queryClient.invalidateQueries({
        queryKey: collectionsKeys.lists(),
      });
    },
  });
};

/**
 * Delete a collection
 */
export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionId: string) =>
      CollectionsService.deleteCollection(collectionId),
    onSuccess: () => {
      // Invalidate collections list to refetch
      queryClient.invalidateQueries({
        queryKey: collectionsKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: collectionsKeys.stats(),
      });
    },
  });
};
