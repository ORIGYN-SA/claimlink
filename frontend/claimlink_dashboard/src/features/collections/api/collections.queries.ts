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
import { CertificatesService, getCertificateTitle, getCertificateImageUrl } from '@/features/certificates';
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
  template: (collectionId: string) => [...collectionKeys.detail(collectionId), 'template'] as const,
};

interface UseListMyCollectionsOptions {
  offset?: number;
  limit?: number;
  enabled?: boolean;
}

/**
 * Hook to fetch collections owned by the current user
 *
 * Also fetches logo URLs from ORIGYN NFT canisters for each collection.
 */
export const useListMyCollections = (options?: UseListMyCollectionsOptions) => {
  const { authenticatedAgent, principalId, isConnected } = useAuth();
  const { offset, limit, enabled = true } = options || {};

  return useQuery({
    queryKey: collectionKeys.myCollections({ offset, limit }),
    queryFn: async () => {
      if (!authenticatedAgent || !principalId) {
        throw new Error('Not authenticated');
      }

      const result = await CollectionsService.getCollectionsByOwner(
        authenticatedAgent,
        Principal.fromText(principalId),
        offset,
        limit
      );

      // Fetch logos for all collections in parallel
      // Only fetch for collections that have a valid canister ID (not numeric collection_id)
      const collectionsWithLogos = await Promise.all(
        result.collections.map(async (collection) => {
          // Skip logo fetch for collections that don't have a deployed canister yet
          if (collection.id.length <= 10) {
            return collection;
          }

          try {
            const logoUrl = await CollectionsService.getCollectionLogo(
              authenticatedAgent,
              collection.id
            );
            return { ...collection, imageUrl: logoUrl };
          } catch {
            // If logo fetch fails, return collection without logo
            return collection;
          }
        })
      );

      return {
        ...result,
        collections: collectionsWithLogos,
      };
    },
    enabled: enabled && isConnected && !!authenticatedAgent && !!principalId,
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
 *
 * Also fetches logo URLs from ORIGYN NFT canisters for each collection.
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

      const result = await CollectionsService.listAllCollections(
        unauthenticatedAgent,
        offset,
        limit
      );

      // Fetch logos for all collections in parallel
      const collectionsWithLogos = await Promise.all(
        result.collections.map(async (collection) => {
          // Skip logo fetch for collections that don't have a deployed canister yet
          if (collection.id.length <= 10) {
            return collection;
          }

          try {
            const logoUrl = await CollectionsService.getCollectionLogo(
              unauthenticatedAgent,
              collection.id
            );
            return { ...collection, imageUrl: logoUrl };
          } catch {
            return collection;
          }
        })
      );

      return {
        ...result,
        collections: collectionsWithLogos,
      };
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
 *
 * Fetches both ClaimLink backend metadata and ORIGYN NFT logo in parallel.
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

      // Fetch collection info and logo in parallel
      const [collection, logoUrl] = await Promise.all([
        CollectionsService.getCollectionInfo(unauthenticatedAgent, principal),
        CollectionsService.getCollectionLogo(unauthenticatedAgent, canisterId),
      ]);

      if (!collection) {
        throw new Error('Collection not found');
      }

      // Merge logo URL into collection
      return {
        ...collection,
        imageUrl: logoUrl,
      };
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

          // Parse metadata into Certificate objects using shared transformers
          return tokenIds.map((tokenId, index) => {
            const metadata = metadataResults[index];

            return {
              id: tokenId.toString(),
              title: getCertificateTitle(metadata, tokenId),
              collectionName: collection.title,
              imageUrl: getCertificateImageUrl(metadata),
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

interface UseCollectionTemplateOptions {
  collectionId: string;
  enabled?: boolean;
}

/**
 * Hook to fetch a collection's template structure
 *
 * Retrieves the TemplateStructure stored in the collection's metadata.
 * This is used during certificate editing to reconstruct the form.
 *
 * Uses authenticatedAgent when available (required for fetching templates
 * from backend, as get_templates_by_owner requires caller == owner).
 * Falls back to unauthenticatedAgent for public viewing (ORIGYN metadata).
 */
export const useCollectionTemplate = (options: UseCollectionTemplateOptions) => {
  const { authenticatedAgent, unauthenticatedAgent } = useAuth();
  const { collectionId, enabled = true } = options;

  // Prefer authenticated agent (required for backend template fetching)
  // Fall back to unauthenticated for public access (ORIGYN fallback)
  const agent = authenticatedAgent || unauthenticatedAgent;

  return useQuery({
    queryKey: collectionKeys.template(collectionId),
    queryFn: async () => {
      if (!agent) {
        throw new Error('Agent not available');
      }

      return await CollectionsService.getCollectionTemplate(
        agent,
        collectionId
      );
    },
    enabled: enabled && !!agent && !!collectionId,
    staleTime: 10 * 60 * 1000, // 10 minutes - templates rarely change
    retry: 1,
  });
};

interface UseSetCollectionTemplateOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to store a template structure in a collection's metadata
 *
 * Used during collection creation to persist the template for later certificate editing.
 */
export const useSetCollectionTemplate = (options?: UseSetCollectionTemplateOptions) => {
  const { authenticatedAgent, isConnected } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collectionId,
      template,
    }: {
      collectionId: string;
      template: import('@/features/templates/types/template.types').TemplateStructure;
    }) => {
      if (!authenticatedAgent) {
        throw new Error('Not authenticated');
      }

      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      await CollectionsService.setCollectionTemplate(
        authenticatedAgent,
        collectionId,
        template
      );
    },
    onSuccess: (_, { collectionId }) => {
      // Invalidate template query to refetch
      queryClient.invalidateQueries({ queryKey: collectionKeys.template(collectionId) });

      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error: Error) => {
      console.error('Failed to set collection template:', error);

      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};

interface UseCreateCollectionOptions {
  onSuccess?: (canisterId: string) => void;
  onError?: (error: Error) => void;
  /** If true (default), wait for canister creation and return canister ID */
  waitForCanister?: boolean;
}

/**
 * Hook to create a new collection
 *
 * Note: Requires 15,000 OGY tokens to be approved for spending before calling.
 * The backend creates collections asynchronously. By default, this hook waits for
 * the canister to be created and returns the canister ID (string).
 *
 * Set waitForCanister=false to return immediately with the collection ID (as string).
 */
export const useCreateCollection = (options?: UseCreateCollectionOptions) => {
  const { authenticatedAgent, isConnected } = useAuth();
  const queryClient = useQueryClient();
  const waitForCanister = options?.waitForCanister ?? true; // Default to true

  return useMutation({
    mutationFn: async (args: CreateCollectionArgs): Promise<string> => {
      if (!authenticatedAgent) {
        throw new Error('Not authenticated');
      }

      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      const collectionId = await CollectionsService.createCollection(authenticatedAgent, args);

      // By default, wait for canister creation and return the canister ID
      if (waitForCanister) {
        const canisterId = await CollectionsService.waitForCollectionCanister(
          authenticatedAgent,
          collectionId
        );
        return canisterId;
      }

      // If not waiting, return collection ID as string
      return collectionId.toString();
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
