import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Principal } from '@dfinity/principal';
import { useAuth } from '@/features/auth';
import { OrigynNftService } from '../api/origyn-nft.service';
import type { ICRC3Value } from '../interfaces';

interface MintNftArgs {
  collectionCanisterId: string;
  name: string;
  description: string;
  imageUrl?: string;
  attributes?: Record<string, string>;
}

interface UseMintNftOptions {
  onSuccess?: (tokenId: bigint) => void;
  onError?: (error: Error) => void;
}

export const useMintNft = (options?: UseMintNftOptions) => {
  const { authenticatedAgent, principalId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: MintNftArgs) => {
      if (!authenticatedAgent || !principalId) {
        throw new Error('Not authenticated');
      }

      // Build metadata (from reference MintingForm.js:345-361)
      const metadata: Array<[string, ICRC3Value]> = [
        ['name', { Text: args.name }],
        ['description', { Text: args.description }],
        ['minted_at', { Text: new Date().toISOString() }],
      ];

      if (args.imageUrl) {
        metadata.push(['image', { Text: args.imageUrl }]);
      }

      if (args.attributes) {
        Object.entries(args.attributes).forEach(([key, value]) => {
          metadata.push([key, { Text: value }]);
        });
      }

      const tokenId = await OrigynNftService.mint(
        authenticatedAgent,
        args.collectionCanisterId,
        { owner: Principal.fromText(principalId), subaccount: [] },
        metadata
      );

      return tokenId;
    },
    onSuccess: (tokenId, variables) => {
      console.log('[useMintNft] Successfully minted NFT with token ID:', tokenId);
      console.log('[useMintNft] Invalidating queries for collection:', variables.collectionCanisterId);

      // Invalidate all collection-specific NFT queries (using prefix match)
      queryClient.invalidateQueries({
        queryKey: ['nfts', 'collection']  // Matches all ['nfts', 'collection', *]
      });
      // Invalidate all user NFT queries (already works for mint certificate page)
      queryClient.invalidateQueries({ queryKey: ['nfts'] });
      // Invalidate collections list
      queryClient.invalidateQueries({ queryKey: ['collections'] });

      options?.onSuccess?.(tokenId);
    },
    onError: options?.onError,
  });
};
