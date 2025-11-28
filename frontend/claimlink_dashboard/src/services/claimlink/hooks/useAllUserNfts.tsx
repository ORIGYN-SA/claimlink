import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import { useListMyCollections } from './useListMyCollections';
import { OrigynNftService } from '@services/origyn_nft';
import type { NFT } from '@/features/nfts/types/nft.types';

/**
 * Fetch all NFTs across all of the user's collections
 *
 * This hook:
 * 1. Fetches all collections owned by the user
 * 2. For each collection, fetches its NFTs from the ORIGYN canister
 * 3. Combines all NFTs into a single array
 *
 * @returns Query result with combined NFT array
 */
export const useAllUserNfts = () => {
  const { authenticatedAgent, principalId } = useAuth();

  // Step 1: Get all user's collections
  const { data: collectionsData, isLoading: isLoadingCollections } = useListMyCollections({
    limit: 100, // Get all collections (adjust if needed)
  });

  const collections = collectionsData?.collections || [];

  // Step 2: Fetch NFTs from all collections
  return useQuery({
    queryKey: ['nfts', 'all-user', principalId],
    queryFn: async (): Promise<NFT[]> => {
      if (!authenticatedAgent || !principalId) return [];
      if (collections.length === 0) return [];

      const account = { owner: principalId, subaccount: [] as [] };

      // Fetch NFTs from each collection in parallel
      const nftPromises = collections.map(async (collection) => {
        try {
          // Get token IDs for this collection
          const tokenIds = await OrigynNftService.getTokensOf(
            authenticatedAgent,
            collection.id, // This is the ORIGYN canister ID
            account
          );

          if (tokenIds.length === 0) return [];

          // Get metadata for each token
          const metadataResults = await OrigynNftService.getTokenMetadata(
            authenticatedAgent,
            collection.id,
            tokenIds
          );

          // Parse metadata into NFT objects
          const getMetadataValue = (metadata: Array<[string, any]>, key: string): string => {
            const item = metadata.find(([k]) => k === key);
            if (!item) return '';
            return item[1].Text || item[1].Nat?.toString() || item[1].Int?.toString() || '';
          };

          return tokenIds.map((tokenId, index) => {
            const metadata = metadataResults[index];
            return {
              id: tokenId.toString(),
              title: getMetadataValue(metadata, 'name') || `NFT #${tokenId}`,
              collectionName: collection.title, // Use collection name from ClaimLink
              imageUrl: getMetadataValue(metadata, 'image'),
              status: 'Minted',
              date: new Date(getMetadataValue(metadata, 'minted_at')).toLocaleDateString(),
              rarity: getMetadataValue(metadata, 'rarity') || 'Common',
            } as NFT;
          });
        } catch (error) {
          console.error(`Failed to fetch NFTs for collection ${collection.id}:`, error);
          return [];
        }
      });

      // Wait for all promises and flatten results
      const nftArrays = await Promise.all(nftPromises);
      return nftArrays.flat();
    },
    enabled: !!authenticatedAgent && !!principalId && !isLoadingCollections && collections.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
