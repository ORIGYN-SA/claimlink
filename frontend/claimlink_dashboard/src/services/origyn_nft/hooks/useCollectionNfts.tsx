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

      console.log('[useCollectionNfts] Fetched token IDs:', tokenIds);

      if (tokenIds.length === 0) {
        console.log('[useCollectionNfts] No tokens found for collection:', collectionCanisterId);
        return [];
      }

      // Step 2: Get metadata for each token (reference App.js:128-142)
      const metadataResults = await OrigynNftService.getTokenMetadata(
        authenticatedAgent,
        collectionCanisterId,
        tokenIds
      );

      console.log('[useCollectionNfts] Fetched metadata for', metadataResults.length, 'tokens');

      // Step 3: Parse metadata (reference NFTGallery.js:27-48)
      const getMetadataValue = (metadata: Array<[string, any]>, key: string): string => {
        const item = metadata.find(([k]) => k === key);
        if (!item) return '';
        return item[1].Text || item[1].Nat?.toString() || item[1].Int?.toString() || '';
      };

      return tokenIds.map((tokenId, index) => {
        const metadata = metadataResults[index];

        // Log the actual metadata structure for debugging
        console.log(`[useCollectionNfts] Token ${tokenId} - Raw Metadata:`, metadata);
        console.log(`[useCollectionNfts] Token ${tokenId} - Metadata Keys:`, metadata.map(([key]) => key));

        // Log each metadata field for debugging
        const metadataObject: Record<string, any> = {};
        metadata.forEach(([key, value]) => {
          if ('Text' in value) metadataObject[key] = `Text: ${value.Text}`;
          else if ('Nat' in value) metadataObject[key] = `Nat: ${value.Nat.toString()}`;
          else if ('Int' in value) metadataObject[key] = `Int: ${value.Int.toString()}`;
          else if ('Blob' in value) metadataObject[key] = `Blob: [${value.Blob.length} bytes]`;
          else if ('Array' in value) metadataObject[key] = `Array: [${value.Array.length} items]`;
          else if ('Map' in value) metadataObject[key] = `Map: [${value.Map.length} entries]`;
          else metadataObject[key] = value;
        });
        console.log(`[useCollectionNfts] Token ${tokenId} - Parsed Metadata:`, metadataObject);

        // ============================================================
        // TEMPORARY: Hardcoded field priority for title/image
        // TODO: Replace with template-based field extraction when template system is ready
        // The template should specify which field to use as the display title
        // ============================================================
        const nftTitle =
          getMetadataValue(metadata, 'item_artwork_title') ||
          getMetadataValue(metadata, 'item_name') ||
          getMetadataValue(metadata, 'name') ||
          `NFT #${tokenId}`;

        const nftImage =
          getMetadataValue(metadata, 'image') ||
          getMetadataValue(metadata, 'item_image') ||
          '';
        // ============================================================
        // END TEMPORARY
        // ============================================================

        console.log(`[useCollectionNfts] Token ${tokenId} - Extracted Values:`, {
          title: nftTitle,
          titleSource: metadata.find(([k]) =>
            k === 'item_artwork_title' || k === 'item_name' || k === 'name'
          )?.[0] || 'fallback',
          image: nftImage,
          allKeys: metadata.map(([key]) => key)
        });

        return {
          id: tokenId.toString(),
          title: nftTitle || `NFT #${tokenId}`,
          collectionName: collectionCanisterId, // Or fetch from ClaimLink
          imageUrl: nftImage,
          status: 'Minted',
          date: new Date().toLocaleDateString(), // Default to now if minted_at not available
          rarity: getMetadataValue(metadata, 'rarity') || 'Common',
        } as NFT;
      });
    },
    enabled: !!authenticatedAgent && !!principalId && !!collectionCanisterId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
