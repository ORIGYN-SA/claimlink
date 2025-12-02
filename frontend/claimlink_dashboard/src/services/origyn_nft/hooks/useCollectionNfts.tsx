import { useQuery } from '@tanstack/react-query';
import { Principal } from '@dfinity/principal';
import { useAuth } from '@/features/auth';
import { OrigynNftService } from '../api/origyn-nft.service';
import type { NFT } from '@/features/nfts/types/nft.types';

/**
 * Fetch NFTs for a specific collection
 * Based on reference App.js:109-152
 */
export const useCollectionNfts = (collectionCanisterId: string) => {
  const { authenticatedAgent, principalId } = useAuth();

  return useQuery({
    queryKey: ['nfts', 'collection', collectionCanisterId],
    queryFn: async (): Promise<NFT[]> => {
      if (!authenticatedAgent || !principalId) return [];

      // Step 1: Get token IDs (reference App.js:121-125)
      const account = { owner: Principal.fromText(principalId), subaccount: [] as [] };
      const tokenIds = await OrigynNftService.getTokensOf(
        authenticatedAgent,
        collectionCanisterId,
        account
      );

      if (tokenIds.length === 0) return [];

      // Step 2: Get metadata for each token (reference App.js:128-142)
      const metadataResults = await OrigynNftService.getTokenMetadata(
        authenticatedAgent,
        collectionCanisterId,
        tokenIds
      );

      // Step 3: Parse metadata (reference NFTGallery.js:27-48)
      const getMetadataValue = (metadata: Array<[string, any]>, key: string): string => {
        const item = metadata.find(([k]) => k === key);
        if (!item) return '';
        return item[1].Text || item[1].Nat?.toString() || item[1].Int?.toString() || '';
      };

      return tokenIds.map((tokenId, index) => {
        const metadata = metadataResults[index];
        return {
          id: tokenId.toString(),
          title: getMetadataValue(metadata, 'name'),
          collectionName: collectionCanisterId, // Or fetch from ClaimLink
          imageUrl: getMetadataValue(metadata, 'image'),
          status: 'Minted',
          date: new Date(getMetadataValue(metadata, 'minted_at')).toLocaleDateString(),
          rarity: getMetadataValue(metadata, 'rarity') || 'Common',
        } as NFT;
      });
    },
    enabled: !!authenticatedAgent && !!principalId && !!collectionCanisterId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
