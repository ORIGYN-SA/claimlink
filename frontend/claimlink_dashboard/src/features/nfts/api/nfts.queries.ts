import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Principal } from '@dfinity/principal';
import { NFTService } from './nfts.service';
import type { NFTMintData, NFT } from '../types/nft.types';
import { useAuth } from '@/features/auth';
import { OrigynNftService } from '@services/origyn_nft';
import { CollectionService } from '@services/claimlink';
import { parseOrigynMetadata, type ParsedOrigynMetadata } from '@/features/template-renderer';

export const nftKeys = {
  all: ['nfts'] as const,
  lists: () => [...nftKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...nftKeys.lists(), { filters }] as const,
  details: () => [...nftKeys.all, 'detail'] as const,
  detail: (id: string) => [...nftKeys.details(), id] as const,
};

// Fetch NFTs
export const useNFTs = (collectionId?: string, filters?: Record<string, any>) => {
  return useQuery({
    queryKey: nftKeys.list({ collectionId, ...filters }),
    queryFn: () => NFTService.fetchNFTs(collectionId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Return type for useNFT hook
 * Includes both the display NFT data and the parsed ORIGYN metadata with templates
 */
export interface NFTWithParsedMetadata {
  nft: NFT;
  parsedMetadata: ParsedOrigynMetadata;
}

// Fetch single NFT
export const useNFT = (collectionId: string, tokenId: string) => {
  const { authenticatedAgent } = useAuth();

  return useQuery({
    queryKey: nftKeys.detail(`${collectionId}:${tokenId}`),
    queryFn: async (): Promise<NFTWithParsedMetadata> => {
      if (!authenticatedAgent) {
        throw new Error('User not authenticated');
      }

      console.log('[useNFT] Fetching NFT:', {
        collectionId,
        tokenId,
      });

      // Fetch metadata for this specific token
      const metadataResults = await OrigynNftService.getTokenMetadata(
        authenticatedAgent,
        collectionId,
        [BigInt(tokenId)]
      );

      if (metadataResults.length === 0 || metadataResults[0].length === 0) {
        throw new Error(`NFT not found: ${tokenId}`);
      }

      const rawMetadata = metadataResults[0];

      console.log('[useNFT] Metadata fetched:', {
        fields: rawMetadata.map(([key]) => key),
        rawMetadata,
      });

      // Parse ORIGYN metadata with templates
      const parsedMetadata = parseOrigynMetadata(rawMetadata, collectionId, tokenId);

      console.log('[useNFT] Parsed ORIGYN metadata:', {
        hasTemplates: !!parsedMetadata.templates.certificateTemplate || !!parsedMetadata.templates.template,
        metadataFields: Object.keys(parsedMetadata.metadata),
        libraryCount: parsedMetadata.library.length,
      });

      // Helper to extract metadata values (for backward compat display fields)
      const getMetadataValue = (key: string): string => {
        const item = rawMetadata.find(([k]) => k === key);
        if (!item) return '';
        const value = item[1];
        if ('Text' in value) return value.Text;
        if ('Nat' in value) return value.Nat.toString();
        if ('Int' in value) return value.Int.toString();
        return '';
      };

      // Fetch collection info for collection name
      const collectionPrincipal = Principal.fromText(collectionId);
      const collectionInfo = await CollectionService.getCollectionInfo(
        authenticatedAgent,
        collectionPrincipal
      );

      // Validate and convert rarity string to proper type
      const rarityValue = getMetadataValue('rarity');
      const validRarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'] as const;
      const rarity: NFT['rarity'] = validRarities.includes(rarityValue as typeof validRarities[number])
        ? (rarityValue as NFT['rarity'])
        : 'Common';

      // Also check parsed metadata for display fields
      const getParsedMetadataValue = (key: string): string => {
        const value = parsedMetadata.metadata[key];
        if (typeof value === 'string') return value;
        if (typeof value === 'object' && value && 'content' in value) {
          const content = value.content;
          if (typeof content === 'string') return content;
          if (typeof content === 'object' && 'en' in content) return content.en;
        }
        return '';
      };

      const nft: NFT = {
        id: tokenId,
        title:
          getParsedMetadataValue('item_artwork_title') ||
          getParsedMetadataValue('item_name') ||
          getParsedMetadataValue('name') ||
          getMetadataValue('item_artwork_title') ||
          getMetadataValue('item_name') ||
          getMetadataValue('name') ||
          `NFT #${tokenId}`,
        collectionName: collectionInfo?.title ?? 'Unknown Collection',
        imageUrl:
          getParsedMetadataValue('image') ||
          getParsedMetadataValue('item_image') ||
          getParsedMetadataValue('thumbnail') ||
          getMetadataValue('image') ||
          getMetadataValue('item_image') ||
          getMetadataValue('thumbnail') ||
          '',
        status: 'Minted',
        date: new Date().toLocaleDateString(),
        rarity,
        canisterId: collectionId,
        tokenId: tokenId,
        creator: '',
      };

      console.log('[useNFT] NFT transformed:', nft);

      return { nft, parsedMetadata };
    },
    enabled: !!authenticatedAgent && !!collectionId && !!tokenId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Mint NFT mutation
export const useMintNFT = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NFTMintData) => NFTService.mintNFT(data),
    onSuccess: () => {
      // Invalidate and refetch NFTs
      queryClient.invalidateQueries({ queryKey: nftKeys.lists() });
    },
  });
};

// Transfer NFT mutation
export const useTransferNFT = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nftId, toPrincipal }: { nftId: string; toPrincipal: string }) =>
      NFTService.transferNFT(nftId, toPrincipal),
    onSuccess: () => {
      // Invalidate NFT queries
      queryClient.invalidateQueries({ queryKey: nftKeys.all });
    },
  });
};

// Burn NFT mutation
export const useBurnNFT = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nftId: string) => NFTService.burnNFT(nftId),
    onSuccess: () => {
      // Invalidate NFT queries
      queryClient.invalidateQueries({ queryKey: nftKeys.all });
    },
  });
};
