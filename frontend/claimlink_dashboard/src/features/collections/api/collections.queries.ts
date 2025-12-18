/**
 * Collections Query Hooks
 *
 * React Query hooks for collection data fetching using real ClaimLink canister integration.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Principal } from '@dfinity/principal';
import { useAuth } from '@/features/auth';
import { CollectionsService } from './collections.service';
import type { CreateCollectionArgs } from '@canisters/claimlink';
import { CertificatesService } from '@/features/certificates';
import type { Certificate } from '@/features/certificates/types/certificate.types';

/**
 * Query key factory for collections
 */
export const collectionKeys = {
  all: ['collections'] as const,
  lists: () => [...collectionKeys.all, 'list'] as const,
  list: (filters?: { offset?: number; limit?: number }) =>
    [...collectionKeys.lists(), filters] as const,
  myCollections: (filters?: { offset?: number; limit?: number }) =>
    [...collectionKeys.all, 'my', filters] as const,
  details: () => [...collectionKeys.all, 'detail'] as const,
  detail: (id: string) => [...collectionKeys.details(), id] as const,
  nfts: (collectionId: string) => [...collectionKeys.detail(collectionId), 'nfts'] as const,
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
      return await CollectionsService.listMyCollections(
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

interface UseListAllCollectionsOptions {
  offset?: number;
  limit?: number;
  enabled?: boolean;
}

/**
 * Hook to fetch all collections in the system
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
      return await CollectionsService.listAllCollections(
        unauthenticatedAgent,
        offset,
        limit
      );
    },
    enabled: enabled && !!unauthenticatedAgent,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

interface UseFetchCollectionInfoOptions {
  canisterId: string;
  enabled?: boolean;
}

/**
 * Hook to fetch detailed information about a specific collection
 */
export const useFetchCollectionInfo = (options: UseFetchCollectionInfoOptions) => {
  const { unauthenticatedAgent } = useAuth();
  const { canisterId, enabled = true } = options;

  return useQuery({
    queryKey: collectionKeys.detail(canisterId),
    queryFn: async () => {
      if (!unauthenticatedAgent) {
        throw new Error('Agent not available');
      }

      const principal = Principal.fromText(canisterId);
      const collection = await CollectionsService.getCollectionInfo(
        unauthenticatedAgent,
        principal
      );

      if (!collection) {
        throw new Error('Collection not found');
      }

      return collection;
    },
    enabled: enabled && !!unauthenticatedAgent && !!canisterId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

interface UseCollectionNftsOptions {
  canisterId: string;
  prev?: bigint;
  take?: bigint;
  enabled?: boolean;
}

/**
 * Hook to fetch NFT token IDs in a collection
 */
export const useCollectionNfts = (options: UseCollectionNftsOptions) => {
  const { unauthenticatedAgent } = useAuth();
  const { canisterId, prev, take, enabled = true } = options;

  return useQuery({
    queryKey: collectionKeys.nfts(canisterId),
    queryFn: async () => {
      if (!unauthenticatedAgent) {
        throw new Error('Agent not available');
      }

      const principal = Principal.fromText(canisterId);
      return await CollectionsService.getCollectionNfts(
        unauthenticatedAgent,
        principal,
        prev,
        take
      );
    },
    enabled: enabled && !!unauthenticatedAgent && !!canisterId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

/**
 * Fetch all certificates across all of the user's collections
 *
 * This hook:
 * 1. Fetches all collections owned by the user
 * 2. For each collection, fetches its certificates from the ORIGYN canister
 * 3. Combines all certificates into a single array
 */
export const useAllUserNfts = () => {
  const { authenticatedAgent, principalId } = useAuth();

  // Step 1: Get all user's collections
  const { data: collectionsData, isLoading: isLoadingCollections } = useListMyCollections({
    limit: 100, // Get all collections (adjust if needed)
  });

  const collections = collectionsData?.collections || [];

  // Step 2: Fetch certificates from all collections
  return useQuery({
    queryKey: ['certificates', 'all-user', principalId],
    queryFn: async (): Promise<Certificate[]> => {
      if (!authenticatedAgent || !principalId) return [];
      if (collections.length === 0) return [];

      const account = { owner: Principal.fromText(principalId), subaccount: [] as [] };

      // Fetch certificates from each collection in parallel
      const certificatePromises = collections.map(async (collection) => {
        try {
          // Get token IDs for this collection
          const tokenIds = await CertificatesService.getCertificatesOf(
            authenticatedAgent,
            collection.id, // This is the ORIGYN canister ID
            account
          );

          if (tokenIds.length === 0) return [];

          // Get metadata for each token
          const metadataResults = await CertificatesService.getCertificateMetadata(
            authenticatedAgent,
            collection.id,
            tokenIds
          );

          // Parse metadata into Certificate objects
          const getMetadataValue = (metadata: Array<[string, any]>, key: string): string => {
            const item = metadata.find(([k]) => k === key);
            if (!item) return '';
            return item[1].Text || item[1].Nat?.toString() || item[1].Int?.toString() || '';
          };

          return tokenIds.map((tokenId, index) => {
            const metadata = metadataResults[index];

            const certificateTitle =
              getMetadataValue(metadata, 'item_artwork_title') ||
              getMetadataValue(metadata, 'item_name') ||
              getMetadataValue(metadata, 'name') ||
              `Certificate #${tokenId}`;

            const certificateImage =
              getMetadataValue(metadata, 'image') ||
              getMetadataValue(metadata, 'item_image') ||
              '';

            return {
              id: tokenId.toString(),
              title: certificateTitle,
              collectionName: collection.title,
              imageUrl: certificateImage,
              status: 'Minted',
              date: new Date().toLocaleDateString(),
              canisterId: collection.id,
              tokenId: tokenId.toString(),
            } as Certificate;
          });
        } catch (error) {
          console.error(`Failed to fetch certificates for collection ${collection.id}:`, error);
          return [];
        }
      });

      // Wait for all promises and flatten results
      const certificateArrays = await Promise.all(certificatePromises);
      return certificateArrays.flat();
    },
    enabled: !!authenticatedAgent && !!principalId && !isLoadingCollections && collections.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

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

      return await CollectionsService.createCollection(authenticatedAgent, args);
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
