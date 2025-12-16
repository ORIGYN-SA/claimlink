/**
 * NFT Minting Query Hooks
 *
 * React Query hooks for NFT minting operations.
 * Uses NFTService for data access abstraction.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  NFTService,
  type MintNFTRequest,
} from './nft.service';

/**
 * Query key factory for NFT minting
 */
export const nftMintKeys = {
  all: ['nft-minting'] as const,
  price: (collectionId: string, templateId: string) =>
    [...nftMintKeys.all, 'price', collectionId, templateId] as const,
  validation: (templateId: string, formData: Record<string, unknown>) =>
    [
      ...nftMintKeys.all,
      'validation',
      templateId,
      JSON.stringify(formData),
    ] as const,
};

/**
 * Get minting price estimate for NFT
 */
export const useNFTMintingPrice = (collectionId: string, templateId: string) => {
  return useQuery({
    queryKey: nftMintKeys.price(collectionId, templateId),
    queryFn: () => NFTService.getMintingPrice(collectionId, templateId),
    enabled: !!collectionId && !!templateId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Validate NFT form data
 */
export const useValidateNFTData = (
  templateId: string,
  formData: Record<string, unknown>,
  enabled = true
) => {
  return useQuery({
    queryKey: nftMintKeys.validation(templateId, formData),
    queryFn: () => NFTService.validateNFTData(templateId, formData),
    enabled: enabled && !!templateId,
    staleTime: 0, // Don't cache validation results
  });
};

/**
 * Mint a new NFT
 */
export const useMintNFT = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: MintNFTRequest) => NFTService.mintNFT(request),
    onSuccess: () => {
      // Invalidate NFTs list to refetch
      queryClient.invalidateQueries({
        queryKey: ['nfts'],
      });
    },
  });
};

/**
 * Batch mint multiple NFTs
 */
export const useBatchMintNFTs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requests: MintNFTRequest[]) =>
      NFTService.batchMintNFTs(requests),
    onSuccess: () => {
      // Invalidate NFTs list to refetch
      queryClient.invalidateQueries({
        queryKey: ['nfts'],
      });
    },
  });
};
