import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NFTService } from './nfts.service';
import type { NFT, NFTMintData } from '../types/nft.types';

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
export const useNFT = (nftId: string) => {
  return useQuery({
    queryKey: nftKeys.detail(nftId),
    queryFn: () => {
      // TODO: Implement single NFT fetch
      throw new Error('Single NFT fetch not implemented');
    },
    enabled: !!nftId,
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
