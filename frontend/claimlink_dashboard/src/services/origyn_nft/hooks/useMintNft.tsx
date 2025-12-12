import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Principal } from '@dfinity/principal';
import { useAuth } from '@/features/auth';
import { OrigynNftService } from '../api/origyn-nft.service';
import type { ICRC3Value } from '../interfaces';
import type { TemplateStructure, CertificateFormData } from '@/features/templates/types/template-structure.types';
import type { FileReference } from '@/features/template-renderer/types';
import { buildOrigynApps, convertToIcrc3Metadata } from '@/features/template-renderer';

interface MintNftArgs {
  collectionCanisterId: string;
  name: string;
  description: string;
  imageUrl?: string;
  attributes?: Record<string, string>;
}

/**
 * Args for minting with full template support
 */
interface MintNftWithTemplateArgs {
  /** The collection canister ID to mint in */
  collectionCanisterId: string;
  /** The template structure defining the certificate */
  template: TemplateStructure;
  /** Form data collected from the user */
  formData: CertificateFormData;
  /** Files to upload (field ID -> File array) */
  files?: Map<string, File[]>;
  /** Override name (optional, extracted from formData if not provided) */
  name?: string;
  /** Override description (optional, extracted from formData if not provided) */
  description?: string;
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

/**
 * Hook for minting NFTs with full ORIGYN template support
 *
 * This hook:
 * 1. Uploads any files to the canister
 * 2. Builds the complete ORIGYN __apps structure using buildOrigynApps
 * 3. Converts to ICRC3 format
 * 4. Mints the NFT with embedded template views
 */
export const useMintNftWithTemplate = (options?: UseMintNftOptions) => {
  const { authenticatedAgent, principalId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: MintNftWithTemplateArgs) => {
      if (!authenticatedAgent || !principalId) {
        throw new Error('Not authenticated');
      }

      // Step 1: Upload files and build file references
      const uploadedFiles = new Map<string, FileReference[]>();

      if (args.files && args.files.size > 0) {
        for (const [fieldId, files] of args.files) {
          const refs: FileReference[] = [];

          for (const file of files) {
            // Upload file to canister
            const uploadedUrl = await OrigynNftService.uploadFile(
              authenticatedAgent,
              args.collectionCanisterId,
              file
            );

            refs.push({
              id: file.name,
              path: uploadedUrl,
            });
          }

          uploadedFiles.set(fieldId, refs);
        }
      }

      // Step 2: Build ORIGYN apps structure
      const apps = buildOrigynApps({
        template: args.template,
        formData: args.formData,
        files: uploadedFiles,
        writerPrincipal: principalId,
      });

      // Step 3: Find first uploaded image URL for the image field
      let imageUrl: string | undefined;
      uploadedFiles.forEach((refs) => {
        if (!imageUrl && refs.length > 0) {
          const firstRef = refs[0];
          // Check if it's an image file
          const ext = firstRef.path.split('.').pop()?.toLowerCase();
          if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
            imageUrl = firstRef.path;
          }
        }
      });

      // Step 4: Convert to ICRC3 metadata format
      const metadata = convertToIcrc3Metadata(apps, args.formData, {
        name: args.name,
        description: args.description,
        imageUrl,
      });

      // Step 5: Mint the NFT
      const tokenId = await OrigynNftService.mint(
        authenticatedAgent,
        args.collectionCanisterId,
        { owner: Principal.fromText(principalId), subaccount: [] },
        metadata
      );

      return tokenId;
    },
    onSuccess: (tokenId) => {
      console.log('[useMintNftWithTemplate] Successfully minted NFT with token ID:', tokenId);

      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: ['nfts', 'collection'],
      });
      queryClient.invalidateQueries({ queryKey: ['nfts'] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });

      options?.onSuccess?.(tokenId);
    },
    onError: options?.onError,
  });
};
