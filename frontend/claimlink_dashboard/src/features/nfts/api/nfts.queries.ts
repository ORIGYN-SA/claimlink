import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Principal } from '@dfinity/principal';
import { NFTService } from './nfts.service';
import type { NFTMintData, NFT } from '../types/nft.types';
import { useAuth } from '@/features/auth';
import { OrigynNftService } from '@services/origyn_nft';
import { CollectionService } from '@services/claimlink';

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

// Fetch single NFT
export const useNFT = (collectionId: string, tokenId: string) => {
  const { authenticatedAgent } = useAuth();

  return useQuery({
    queryKey: nftKeys.detail(`${collectionId}:${tokenId}`),
    queryFn: async () => {
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

      const metadata = metadataResults[0];

      console.log('[useNFT] Metadata fetched:', {
        fields: metadata.map(([key]) => key),
        metadata,
      });

      // Helper to extract metadata values
      const getMetadataValue = (key: string): string => {
        const item = metadata.find(([k]) => k === key);
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

      // ============================================================
      // TEMPORARY: Hardcoded field priority for title/image
      // TODO: Replace with template-based field extraction when template system is ready
      // The template should specify which field to use as the display title
      // ============================================================
      const nft: NFT = {
        id: tokenId,
        title:
          getMetadataValue('item_artwork_title') ||
          getMetadataValue('item_name') ||
          getMetadataValue('name') ||
          `NFT #${tokenId}`,
        collectionName: collectionInfo?.name ?? 'Unknown Collection',
        imageUrl:
          getMetadataValue('image') ||
          getMetadataValue('item_image') ||
          getMetadataValue('thumbnail') ||
          '',
        status: 'Minted',
        date: new Date().toLocaleDateString(),
        rarity: getMetadataValue('rarity') || 'Common',
        canisterId: collectionId,
        tokenId: tokenId,
        creator: '', // Will be populated by owner query if needed
      };
      // ============================================================
      // END TEMPORARY
      // ============================================================

      console.log('[useNFT] NFT transformed:', nft);

      return nft;
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
