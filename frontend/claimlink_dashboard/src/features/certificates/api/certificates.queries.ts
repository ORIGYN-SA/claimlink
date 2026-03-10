/**
 * Certificates Query Hooks
 *
 * React Query hooks for certificate data fetching using real ORIGYN NFT canister integration.
 * Certificates are NFTs with ORIGYN badge - technically the same, just presented differently.
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Actor } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import type { HttpAgent } from '@dfinity/agent';
import { DateTime } from 'luxon';
import { useAuth } from '@/features/auth';
import { CertificatesService, ClaimlinkMintingService } from './certificates.service';
import { getCertificateTitle, getCertificateImageUrl, extractMetadataValue } from './transformers';
import type { ICRC3Value } from '@canisters/origyn_nft';
import type { ICRC3Value_1 } from '@canisters/claimlink';
import type { Certificate } from '../types/certificate.types';
import type { TemplateStructure, CertificateFormData } from '@/features/templates/types/template.types';
import type { FileReference } from '@/features/template-renderer/types';
import { buildOrigynApps, convertToIcrc3Metadata, parseOrigynMetadata, type ParsedOrigynMetadata } from '@/features/template-renderer';
import { CollectionsService } from '@/features/collections';
import { getCanisterId } from '@/shared/canister';
import { idlFactory as ledgerIdlFactory } from '@/services/ledger/idlFactory';
import type { CertificateEventsData } from '../components/detail/certificate-events';
import type { CertificateLedgerData, LedgerTransaction } from '../components/detail/certificate-ledger';

/**
 * Query key factory for certificates
 */
export const certificatesKeys = {
  all: ['certificates'] as const,
  lists: () => [...certificatesKeys.all, 'list'] as const,
  list: (filters?: any) => [...certificatesKeys.lists(), filters] as const,
  details: () => [...certificatesKeys.all, 'detail'] as const,
  detail: (id: string) => [...certificatesKeys.details(), id] as const,
  collection: (collectionId: string) => [...certificatesKeys.all, 'collection', collectionId] as const,
};

// ============================================================================
// Mint Cost Estimation
// ============================================================================

/**
 * Hook for estimating mint cost via ClaimLink backend
 * Returns live OGY cost based on file size, number of mints, and current OGY price
 */
export const useEstimateMintCost = (
  collectionCanisterId: string,
  numMints: number,
  totalFileSizeBytes: number,
  options?: { enabled?: boolean },
) => {
  const { unauthenticatedAgent } = useAuth();

  return useQuery({
    queryKey: ['mint-cost-estimate', collectionCanisterId, numMints, totalFileSizeBytes],
    queryFn: () =>
      ClaimlinkMintingService.estimateMintCost(
        unauthenticatedAgent!,
        collectionCanisterId,
        numMints,
        totalFileSizeBytes,
      ),
    enabled:
      (options?.enabled ?? true) &&
      !!unauthenticatedAgent &&
      !!collectionCanisterId &&
      numMints > 0,
    staleTime: 30_000, // 30s - OGY price changes slowly
    retry: 1,
  });
};

// ============================================================================
// Collection Certificates
// ============================================================================

/**
 * Fetch certificates for a specific collection
 */
export const useCollectionCertificates = (collectionCanisterId: string) => {
  const { unauthenticatedAgent, principalId } = useAuth();

  return useQuery({
    queryKey: certificatesKeys.collection(collectionCanisterId),
    queryFn: async (): Promise<Certificate[]> => {
      if (!unauthenticatedAgent || !principalId) return [];

      // Step 1: Get token IDs
      const account = { owner: Principal.fromText(principalId), subaccount: [] as [] };
      const tokenIds = await CertificatesService.getCertificatesOf(
        unauthenticatedAgent,
        collectionCanisterId,
        account
      );

      console.log('[useCollectionCertificates] Fetched token IDs:', tokenIds);

      if (tokenIds.length === 0) {
        console.log('[useCollectionCertificates] No certificates found for collection:', collectionCanisterId);
        return [];
      }

      // Step 2: Get metadata for each token
      const metadataResults = await CertificatesService.getCertificateMetadata(
        unauthenticatedAgent,
        collectionCanisterId,
        tokenIds
      );

      console.log('[useCollectionCertificates] Fetched metadata for', metadataResults.length, 'certificates');

      // Step 3: Parse metadata and transform to Certificate type
      return tokenIds.map((tokenId, index) => {
        const metadata = metadataResults[index];

        const certificateTitle = getCertificateTitle(metadata, tokenId);
        const certificateImage = getCertificateImageUrl(metadata);

        return {
          id: tokenId.toString(),
          title: certificateTitle,
          collectionName: collectionCanisterId, // Or fetch from ClaimLink
          imageUrl: certificateImage,
          status: 'Minted',
          date: extractMetadataValue(metadata, 'minted_at') || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          canisterId: collectionCanisterId,
          tokenId: tokenId.toString(),
        } as Certificate;
      });
    },
    enabled: !!unauthenticatedAgent && !!principalId && !!collectionCanisterId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// ============================================================================
// Transfer Certificate
// ============================================================================

interface TransferCertificateArgs {
  canisterId: string;
  tokenId: string;
  recipientPrincipal: string;
}

interface UseTransferCertificateOptions {
  onSuccess?: (transactionIndex: bigint) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for transferring certificate ownership
 *
 * Calls icrc7_transfer on the collection canister.
 * The authenticated user's agent signs the call, so only the token owner can transfer.
 */
export const useTransferCertificate = (options?: UseTransferCertificateOptions) => {
  const { authenticatedAgent } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: TransferCertificateArgs) => {
      if (!authenticatedAgent) {
        throw new Error('Not authenticated');
      }

      return CertificatesService.transferCertificate(
        authenticatedAgent,
        args.canisterId,
        args.tokenId,
        args.recipientPrincipal,
      );
    },
    onSuccess: (transactionIndex, variables) => {
      // Invalidate certificate detail so the page refreshes with the new owner
      queryClient.invalidateQueries({
        queryKey: certificatesKeys.detail(`${variables.canisterId}:${variables.tokenId}`),
      });
      queryClient.invalidateQueries({ queryKey: certificatesKeys.all });
      queryClient.invalidateQueries({
        queryKey: ['certificate-transaction-history', variables.canisterId, variables.tokenId],
      });

      options?.onSuccess?.(transactionIndex);
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

interface MintCertificateArgs {
  collectionCanisterId: string;
  name: string;
  description: string;
  imageUrl?: string;
  attributes?: Record<string, string>;
}

interface UseMintCertificateOptions {
  onSuccess?: (tokenId: bigint) => void;
  onError?: (error: Error) => void;
  onUploadProgress?: (fieldId: string, progress: number) => void;
}

/**
 * Hook for minting certificates (basic version)
 */
export const useMintCertificate = (options?: UseMintCertificateOptions) => {
  const { authenticatedAgent, principalId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: MintCertificateArgs) => {
      if (!authenticatedAgent || !principalId) {
        throw new Error('Not authenticated');
      }

      // Build metadata
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

      const tokenId = await CertificatesService.mintCertificate(
        authenticatedAgent,
        args.collectionCanisterId,
        { owner: Principal.fromText(principalId), subaccount: [] },
        metadata
      );

      return tokenId;
    },
    onSuccess: (tokenId, variables) => {
      console.log('[useMintCertificate] Successfully minted certificate with token ID:', tokenId);
      console.log('[useMintCertificate] Invalidating queries for collection:', variables.collectionCanisterId);

      // Invalidate all collection-specific certificate queries
      queryClient.invalidateQueries({
        queryKey: certificatesKeys.collection(variables.collectionCanisterId)
      });
      // Invalidate all certificate queries
      queryClient.invalidateQueries({ queryKey: certificatesKeys.all });
      // Invalidate collections list
      queryClient.invalidateQueries({ queryKey: ['collections'] });

      options?.onSuccess?.(tokenId);
    },
    onError: options?.onError,
  });
};

/**
 * Args for minting with full template support
 */
interface MintCertificateWithTemplateArgs {
  /** The collection canister ID to mint in */
  collectionCanisterId: string;
  /** The template structure defining the certificate */
  template: TemplateStructure;
  /** Form data collected from the user */
  formData: CertificateFormData;
  /** Files to upload (field ID -> File array, can include URL strings for existing files) */
  files?: Map<string, (File | string)[]>;
  /** Override name (optional, extracted from formData if not provided) */
  name?: string;
  /** Override description (optional, extracted from formData if not provided) */
  description?: string;
}

/**
 * Hook for minting certificates with full ORIGYN template support (Paid Flow)
 *
 * This hook routes through the ClaimLink backend canister:
 * 1. Estimates cost + approves OGY spending
 * 2. Initializes mint request (backend collects payment)
 * 3. Uploads files via proxy
 * 4. Builds ORIGYN metadata
 * 5. Mints via proxy
 */
export const useMintCertificateWithTemplate = (options?: UseMintCertificateOptions) => {
  const { authenticatedAgent, principalId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: MintCertificateWithTemplateArgs) => {
      if (!authenticatedAgent || !principalId) {
        throw new Error('Not authenticated');
      }

      // Step 1: Calculate total file size
      let totalFileSizeBytes = 0;
      if (args.files && args.files.size > 0) {
        for (const [, files] of args.files) {
          for (const file of files) {
            if (file instanceof File) {
              totalFileSizeBytes += file.size;
            }
          }
        }
      }

      // Step 2: Estimate cost
      const estimate = await ClaimlinkMintingService.estimateMintCost(
        authenticatedAgent,
        args.collectionCanisterId,
        1, // single mint
        totalFileSizeBytes,
      );

      // Step 3: Approve OGY spending on the ledger
      // Add a buffer for the transfer fee
      const OGY_TRANSFER_FEE = 200_000n; // 0.002 OGY
      const approvalAmount = estimate.total_ogy_e8s + OGY_TRANSFER_FEE;

      const ogyLedgerCanisterId = getCanisterId('ogyLedger');
      const claimlinkCanisterId = getCanisterId('claimlink');

      const ledgerActor = Actor.createActor(ledgerIdlFactory, {
        agent: authenticatedAgent,
        canisterId: ogyLedgerCanisterId,
      });

      const approveResult = await ledgerActor.icrc2_approve({
        amount: approvalAmount,
        fee: [],
        memo: [],
        expected_allowance: [],
        created_at_time: [],
        expires_at: [
          BigInt(DateTime.now().plus({ hours: 1 }).toMillis()) * 1_000_000n,
        ],
        spender: {
          owner: Principal.fromText(claimlinkCanisterId),
          subaccount: [],
        },
        from_subaccount: [],
      }) as { Ok: bigint } | { Err: unknown };

      if ('Err' in approveResult) {
        throw new Error(`OGY approval failed: ${JSON.stringify(approveResult.Err)}`);
      }

      // Step 4: Initialize mint (backend collects payment via transfer_from)
      const mintRequestId = await ClaimlinkMintingService.initializeMint(
        authenticatedAgent,
        args.collectionCanisterId,
        1, // single mint
        totalFileSizeBytes,
      );

      // Step 5: Upload files via proxy and build file references
      const uploadedFiles = new Map<string, FileReference[]>();

      if (args.files && args.files.size > 0) {
        for (const [fieldId, files] of args.files) {
          const refs: FileReference[] = [];

          for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Skip URL strings (existing file references)
            if (typeof file === 'string') {
              refs.push({ id: file, path: file });
              continue;
            }

            // Upload file via ClaimLink proxy
            const uploadedUrl = await ClaimlinkMintingService.proxyUploadFile(
              authenticatedAgent,
              mintRequestId,
              file,
              (progress) => {
                const overallProgress = ((i + progress / 100) / files.length) * 100;
                options?.onUploadProgress?.(fieldId, overallProgress);
              },
            );

            refs.push({
              id: file.name,
              path: uploadedUrl,
            });
          }

          uploadedFiles.set(fieldId, refs);
        }
      }

      // Step 6: Build ORIGYN apps structure
      const apps = buildOrigynApps({
        template: args.template,
        formData: args.formData,
        files: uploadedFiles,
        writerPrincipal: principalId,
      });

      // Step 7: Find certificate image URL
      const certificateImageFieldIds = ['product_images', 'certificate_image', 'main_image', 'primary_image', 'gallery_images', 'detail_images', 'files-media'];
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

      let imageUrl: string | undefined;

      for (const fieldId of certificateImageFieldIds) {
        const refs = uploadedFiles.get(fieldId);
        if (refs && refs.length > 0) {
          const firstRef = refs[0];
          const ext = firstRef.path.split('.').pop()?.toLowerCase();
          if (imageExtensions.includes(ext || '')) {
            imageUrl = firstRef.path;
            break;
          }
        }
      }

      if (!imageUrl) {
        const logoFieldIds = ['company_logo', 'logo', 'brand_logo'];
        uploadedFiles.forEach((refs, fieldId) => {
          if (!imageUrl && !logoFieldIds.includes(fieldId) && refs.length > 0) {
            const firstRef = refs[0];
            const ext = firstRef.path.split('.').pop()?.toLowerCase();
            if (imageExtensions.includes(ext || '')) {
              imageUrl = firstRef.path;
            }
          }
        });
      }

      // Step 8: Convert to ICRC3 metadata format
      const metadata = convertToIcrc3Metadata(apps, args.formData, {
        name: args.name,
        description: args.description,
        imageUrl,
      });

      // Step 9: Mint via ClaimLink proxy
      // Cast metadata from ORIGYN ICRC3Value to ClaimLink ICRC3Value_1
      // They have the same runtime shape, just different TS type definitions
      const claimlinkMetadata = metadata as unknown as Array<[string, ICRC3Value_1]>;

      const tokenIds = await ClaimlinkMintingService.mintNfts(
        authenticatedAgent,
        mintRequestId,
        [{
          tokenOwner: { owner: Principal.fromText(principalId), subaccount: [] },
          metadata: claimlinkMetadata,
        }],
      );

      return tokenIds[0]; // Return first (only) token ID
    },
    onSuccess: (tokenId) => {
      console.log('[useMintCertificateWithTemplate] Successfully minted certificate with token ID:', tokenId);

      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: certificatesKeys.all,
      });
      queryClient.invalidateQueries({ queryKey: ['collections'] });

      options?.onSuccess?.(tokenId);
    },
    onError: options?.onError,
  });
};

/**
 * Args for updating certificate with full template support
 */
interface UpdateCertificateWithTemplateArgs extends MintCertificateWithTemplateArgs {
  /** The token ID to update */
  tokenId: bigint;
}

/**
 * Hook for updating certificates with full ORIGYN template support
 *
 * This hook:
 * 1. Uploads any new files to the canister
 * 2. Builds the complete ORIGYN __apps structure using buildOrigynApps
 * 3. Converts to ICRC3 format
 * 4. Updates the certificate metadata
 *
 * Note: Most certificate fields are immutable after minting in ORIGYN NFT.
 * This hook is provided for completeness but may have limited functionality.
 */
export const useUpdateCertificateWithTemplate = (options?: UseMintCertificateOptions) => {
  const { authenticatedAgent, principalId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: UpdateCertificateWithTemplateArgs) => {
      if (!authenticatedAgent || !principalId) {
        throw new Error('Not authenticated');
      }

      // Step 1: Upload any new files (skip URLs from existing files)
      const uploadedFiles = new Map<string, FileReference[]>();

      if (args.files && args.files.size > 0) {
        for (const [fieldId, files] of args.files) {
          const refs: FileReference[] = [];

          for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Skip if it's already a URL string (existing file reference)
            if (typeof file === 'string') {
              refs.push({ id: file, path: file });
              continue;
            }

            // Upload new file with progress tracking
            const uploadedUrl = await CertificatesService.uploadCertificateFile(
              authenticatedAgent,
              args.collectionCanisterId,
              file,
              (progress) => {
                const overallProgress = ((i + progress / 100) / files.length) * 100;
                options?.onUploadProgress?.(fieldId, overallProgress);
              }
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

      // Step 3: Find certificate image URL from uploaded files
      // Prefer certificate image fields over logo fields
      const certificateImageFieldIds = ['product_images', 'certificate_image', 'main_image', 'primary_image', 'gallery_images', 'detail_images', 'files-media'];
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

      let imageUrl: string | undefined;

      // First, try to find an image from certificate image fields
      for (const fieldId of certificateImageFieldIds) {
        const refs = uploadedFiles.get(fieldId);
        if (refs && refs.length > 0) {
          const firstRef = refs[0];
          const ext = firstRef.path.split('.').pop()?.toLowerCase();
          if (imageExtensions.includes(ext || '')) {
            imageUrl = firstRef.path;
            break;
          }
        }
      }

      // Fallback: if no certificate image found, use first image that's NOT a logo
      if (!imageUrl) {
        const logoFieldIds = ['company_logo', 'logo', 'brand_logo'];
        uploadedFiles.forEach((refs, fieldId) => {
          if (!imageUrl && !logoFieldIds.includes(fieldId) && refs.length > 0) {
            const firstRef = refs[0];
            const ext = firstRef.path.split('.').pop()?.toLowerCase();
            if (imageExtensions.includes(ext || '')) {
              imageUrl = firstRef.path;
            }
          }
        });
      }

      // Step 4: Convert to ICRC3 metadata format
      const metadata = convertToIcrc3Metadata(apps, args.formData, {
        name: args.name,
        description: args.description,
        imageUrl,
      });

      // Step 5: Update the certificate
      await CertificatesService.updateCertificate(
        authenticatedAgent,
        args.collectionCanisterId,
        args.tokenId,
        metadata
      );

      return args.tokenId;
    },
    onSuccess: (tokenId, variables) => {
      console.log('[useUpdateCertificateWithTemplate] Successfully updated certificate with token ID:', tokenId);

      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: certificatesKeys.detail(`${variables.collectionCanisterId}:${tokenId}`),
      });
      queryClient.invalidateQueries({ queryKey: certificatesKeys.all });
      queryClient.invalidateQueries({ queryKey: ['collections'] });

      options?.onSuccess?.(tokenId);
    },
    onError: options?.onError,
  });
};

interface UseUploadCertificateImageReturn {
  uploadCertificateImage: (file: File, canisterId: string) => Promise<string>;
  isUploading: boolean;
  progress: number;
}

/**
 * Hook for uploading certificate images with progress tracking
 */
export const useUploadCertificateImage = (): UseUploadCertificateImageReturn => {
  const { authenticatedAgent } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadCertificateImage = async (file: File, canisterId: string): Promise<string> => {
    if (!authenticatedAgent) {
      throw new Error('Not authenticated');
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const imageUrl = await CertificatesService.uploadCertificateFile(
        authenticatedAgent,
        canisterId,
        file,
        (progressPercent) => {
          setProgress(progressPercent);
        }
      );

      setProgress(100);
      return imageUrl;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadCertificateImage, isUploading, progress };
};

/**
 * Return type for useCertificate hook
 * Includes both the display certificate data and the parsed ORIGYN metadata with templates
 */
export interface CertificateWithParsedMetadata {
  certificate: Certificate;
  parsedMetadata: ParsedOrigynMetadata;
}

interface UseCertificateOptions {
  enabled?: boolean;
}

/**
 * Fetch a single certificate by collection ID and token ID
 * Returns certificate data and parsed ORIGYN metadata with templates
 */
export const useCertificate = (
  collectionId: string,
  tokenId: string,
  options?: UseCertificateOptions
) => {
  const { unauthenticatedAgent } = useAuth();
  const externalEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: certificatesKeys.detail(`${collectionId}:${tokenId}`),
    queryFn: async (): Promise<CertificateWithParsedMetadata> => {
      if (!unauthenticatedAgent) {
        throw new Error('Agent not available');
      }

      console.log('[useCertificate] Fetching certificate:', {
        collectionId,
        tokenId,
      });

      // Fetch metadata for this specific token
      const metadataResults = await CertificatesService.getCertificateMetadata(
        unauthenticatedAgent,
        collectionId,
        [BigInt(tokenId)]
      );

      if (metadataResults.length === 0 || metadataResults[0].length === 0) {
        throw new Error(`Certificate not found: ${tokenId}`);
      }

      const rawMetadata = metadataResults[0];

      console.log('[useCertificate] Metadata fetched:', {
        fields: rawMetadata.map(([key]) => key),
      });

      // Parse ORIGYN metadata with templates
      const parsedMetadata = parseOrigynMetadata(rawMetadata, collectionId, tokenId);

      console.log('[useCertificate] Parsed ORIGYN metadata:', {
        hasTemplates: !!parsedMetadata.templates.certificateTemplate || !!parsedMetadata.templates.template,
        metadataFields: Object.keys(parsedMetadata.metadata),
        libraryCount: parsedMetadata.library.length,
      });

      // Fetch collection info for collection name
      const collectionPrincipal = Principal.fromText(collectionId);
      const collectionInfo = await CollectionsService.getCollectionInfo(
        unauthenticatedAgent,
        collectionPrincipal
      );

      const certificateTitle = getCertificateTitle(rawMetadata, BigInt(tokenId));
      const certificateImage = getCertificateImageUrl(rawMetadata);

      const certificate: Certificate = {
        id: tokenId,
        title: certificateTitle,
        collectionName: collectionInfo?.title ?? 'Unknown Collection',
        imageUrl: certificateImage,
        status: 'Minted',
        date: extractMetadataValue(rawMetadata, 'minted_at') || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        canisterId: collectionId,
        tokenId: tokenId,
      };

      console.log('[useCertificate] Certificate transformed:', certificate);

      return { certificate, parsedMetadata };
    },
    enabled: externalEnabled && !!unauthenticatedAgent && !!collectionId && !!tokenId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

/**
 * Fetch a single certificate by collection ID and token ID using UNAUTHENTICATED agent
 * Used for public certificate page (/certificate/:certificateId)
 * Returns certificate data and parsed ORIGYN metadata with templates
 *
 * Key differences from useCertificate:
 * - Uses unauthenticatedAgent (works without login)
 * - Skips collection name lookup (may require auth)
 * - Has fallback values for missing data
 */
export const usePublicCertificate = (collectionId: string, tokenId: string) => {
  const { unauthenticatedAgent } = useAuth();

  return useQuery({
    queryKey: [...certificatesKeys.detail(`${collectionId}:${tokenId}`), 'public'],
    queryFn: async (): Promise<CertificateWithParsedMetadata> => {
      if (!unauthenticatedAgent) {
        throw new Error('Unauthenticated agent not available');
      }

      console.log('[usePublicCertificate] Fetching certificate (public):', {
        collectionId,
        tokenId,
      });

      // Fetch metadata using public ICRC-7 query (no auth needed)
      const metadataResults = await CertificatesService.getCertificateMetadata(
        unauthenticatedAgent,
        collectionId,
        [BigInt(tokenId)]
      );

      if (metadataResults.length === 0 || metadataResults[0].length === 0) {
        throw new Error(`Certificate not found: ${tokenId}`);
      }

      const rawMetadata = metadataResults[0];

      console.log('[usePublicCertificate] Metadata fetched:', {
        fields: rawMetadata.map(([key]) => key),
      });

      // Parse ORIGYN metadata with templates
      const parsedMetadata = parseOrigynMetadata(rawMetadata, collectionId, tokenId);

      console.log('[usePublicCertificate] Parsed ORIGYN metadata:', {
        hasTemplates: !!parsedMetadata.templates.certificateTemplate || !!parsedMetadata.templates.template,
        metadataFields: Object.keys(parsedMetadata.metadata),
        libraryCount: parsedMetadata.library.length,
      });

      const certificateTitle = getCertificateTitle(rawMetadata, BigInt(tokenId));
      const certificateImage = getCertificateImageUrl(rawMetadata);

      const certificate: Certificate = {
        id: tokenId,
        title: certificateTitle,
        collectionName: collectionId,  // Fallback to canister ID (collection lookup may require auth)
        imageUrl: certificateImage,
        status: 'Minted',  // Default for public view
        date: extractMetadataValue(rawMetadata, 'minted_at') || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        canisterId: collectionId,
        tokenId: tokenId,
        certifiedBy: 'ORIGYN',
      };

      console.log('[usePublicCertificate] Certificate transformed:', certificate);

      return { certificate, parsedMetadata };
    },
    enabled: !!unauthenticatedAgent && !!collectionId && !!tokenId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

interface CertificateTransactionHistoryResult {
  eventsData: CertificateEventsData;
  ledgerData: CertificateLedgerData;
}

/**
 * Hook to fetch and parse ICRC3 transaction history for a certificate
 * Returns both events and ledger data
 *
 * This fetches:
 * 1. ICRC3 transaction history (mint, transfer, burn, update)
 * 2. Custom events stored in NFT metadata (appraisal, service, etc.)
 */
export const useCertificateTransactionHistory = (
  collectionCanisterId: string,
  tokenId: string,
  /** Optional agent override. When omitted, falls back to unauthenticatedAgent. */
  agentOverride?: HttpAgent
) => {
  const { unauthenticatedAgent } = useAuth();
  const agent = agentOverride || unauthenticatedAgent;

  return useQuery({
    queryKey: ['certificate-transaction-history', collectionCanisterId, tokenId],
    queryFn: async (): Promise<CertificateTransactionHistoryResult> => {
      if (!agent) {
        return {
          eventsData: { events: [] },
          ledgerData: { transactions: [] },
        };
      }

      console.log('[useCertificateTransactionHistory] Fetching history for token:', {
        collectionCanisterId,
        tokenId,
      });

      // Fetch both transaction history and NFT metadata in parallel
      const [blocksResult, metadataResults] = await Promise.all([
        CertificatesService.getTransactionHistory(
          agent,
          collectionCanisterId,
          0n,
          100n
        ),
        CertificatesService.getCertificateMetadata(
          agent,
          collectionCanisterId,
          [BigInt(tokenId)]
        ),
      ]);

      console.log('[useCertificateTransactionHistory] Blocks fetched:', {
        total_blocks: blocksResult.blocks.length,
        log_length: blocksResult.log_length.toString(),
      });

      // Parse blocks into events and transactions
      const events: CertificateEventsData['events'] = [];
      const transactions: LedgerTransaction[] = [];

      // First, extract custom events from NFT metadata
      const metadata = metadataResults[0] || [];
      for (const [key, value] of metadata) {
        // Look for event_* keys (custom events added via the form)
        if (key.startsWith('event_') && 'Map' in value) {
          const eventMap = new Map(value.Map);
          const eventDate = extractText(eventMap.get('date'));
          const eventCategory = extractText(eventMap.get('category'));
          const eventDescription = extractText(eventMap.get('description'));
          const eventTimestamp = extractNat(eventMap.get('timestamp'));
          const attachmentUrl = extractText(eventMap.get('attachment_url'));
          const attachmentFilename = extractText(eventMap.get('attachment_filename'));

          if (eventDescription) {
            const categoryLabel = eventCategory
              ? eventCategory.charAt(0).toUpperCase() + eventCategory.slice(1)
              : 'Event';

            events.push({
              date: formatEventDate(eventDate) || (eventTimestamp ? formatTimestamp(eventTimestamp * 1000000n) : 'Unknown date'),
              dateTimestamp: eventTimestamp ? Number(eventTimestamp) : undefined,
              category: eventCategory as any,
              description: `${categoryLabel}: ${eventDescription}`,
              attachmentUrl: attachmentUrl || undefined,
              attachmentFilename: attachmentFilename || undefined,
            });
          }
        }
      }

      for (const blockWithId of blocksResult.blocks) {
        const block = blockWithId.block;
        const blockId = blockWithId.id;

        // Parse block as Map
        if ('Map' in block) {
          const blockMap = new Map(block.Map);

          // Extract transaction details
          const txType = extractText(blockMap.get('btype'));
          const timestamp = extractNat(blockMap.get('ts'));
          const tx = blockMap.get('tx');

          // Only process blocks related to this token
          let relatedToToken = false;
          let fromPrincipal = '';
          let toPrincipal = '';
          let tokenIdInBlock = '';

          if (tx && 'Map' in tx) {
            const txMap = new Map(tx.Map);
            const tid = txMap.get('tid');

            if (tid) {
              tokenIdInBlock = extractNat(tid)?.toString() || '';
              relatedToToken = tokenIdInBlock === tokenId;
            }

            // Extract from/to
            const from = txMap.get('from');
            const to = txMap.get('to');

            if (from && 'Map' in from) {
              const fromMap = new Map(from.Map);
              const owner = fromMap.get('owner');
              if (owner && 'Blob' in owner) {
                fromPrincipal = blobToPrincipalText(owner.Blob);
              }
            }

            if (to && 'Map' in to) {
              const toMap = new Map(to.Map);
              const owner = toMap.get('owner');
              if (owner && 'Blob' in owner) {
                toPrincipal = blobToPrincipalText(owner.Blob);
              }
            }
          }

          if (!relatedToToken) continue;

          const date = timestamp ? formatTimestamp(timestamp) : formatTimestamp(BigInt(Date.now()) * 1000000n);
          const dateRelative = timestamp ? formatRelativeTime(timestamp) : 'Recently';

          // Create event description based on transaction type
          let eventDescription = '';
          let shouldIncludeInEvents = true;

          if (txType === '7mint') {
            eventDescription = toPrincipal
              ? `Certificate minted to ${shortenPrincipal(toPrincipal)}`
              : 'Certificate minted';
          } else if (txType === '7transfer') {
            eventDescription = `Transferred from ${shortenPrincipal(fromPrincipal || 'Unknown')} to ${shortenPrincipal(toPrincipal || 'Unknown')}`;
          } else if (txType === '7burn') {
            eventDescription = `Certificate burned by ${shortenPrincipal(fromPrincipal || 'Owner')}`;
          } else if (txType === '7update_token' || txType === '37update') {
            eventDescription = 'Certificate metadata updated';
          } else if (txType) {
            // Skip unknown transaction types from events (but keep in ledger)
            eventDescription = `Transaction: ${txType.replace(/^7/, '')}`;
            shouldIncludeInEvents = false;
          } else {
            shouldIncludeInEvents = false;
          }

          // Only add meaningful events (skip raw transaction types)
          if (shouldIncludeInEvents && eventDescription) {
            events.push({
              date,
              dateTimestamp: timestamp ? Number(timestamp / 1000000n) : undefined,
              description: eventDescription,
            });
          }

          // Create transaction for ledger
          let transactionType: LedgerTransaction['type'] = 'Transferred';
          if (txType === '7mint') {
            transactionType = 'Minted';
          } else if (txType === '7burn') {
            transactionType = 'Burned';
          }

          transactions.push({
            from: fromPrincipal || 'System',
            fromShort: shortenPrincipal(fromPrincipal || 'System'),
            fromVerified: false,
            to: toPrincipal || 'System',
            toShort: shortenPrincipal(toPrincipal || 'System'),
            toVerified: false,
            type: transactionType,
            hash: blockId.toString(),
            date: dateRelative,
          });
        }
      }

      console.log('[useCertificateTransactionHistory] Parsed data:', {
        events_count: events.length,
        transactions_count: transactions.length,
      });

      // Sort events by timestamp (most recent first)
      events.sort((a, b) => {
        const tsA = a.dateTimestamp || 0;
        const tsB = b.dateTimestamp || 0;
        return tsB - tsA;
      });

      // Reverse transactions to show most recent first
      transactions.reverse();

      return {
        eventsData: { events },
        ledgerData: { transactions },
      };
    },
    enabled: !!agent && !!collectionCanisterId && !!tokenId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Helper functions for transaction parsing

function extractText(value: ICRC3Value | undefined): string {
  if (!value) return '';
  if ('Text' in value) return value.Text;
  return '';
}

function extractNat(value: ICRC3Value | undefined): bigint | null {
  if (!value) return null;
  if ('Nat' in value) return value.Nat;
  return null;
}

function blobToPrincipalText(blob: Uint8Array | number[]): string {
  try {
    // Convert blob to Principal using @dfinity/principal
    const bytes = blob instanceof Uint8Array ? blob : new Uint8Array(blob);
    const principal = Principal.fromUint8Array(bytes);
    return principal.toText();
  } catch (e) {
    console.warn('[blobToPrincipalText] Failed to decode principal:', e);
    return '';
  }
}

function shortenPrincipal(principal: string): string {
  if (principal.length <= 20) return principal;
  return `${principal.slice(0, 10)}...${principal.slice(-10)}`;
}

function formatEventDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatTimestamp(nanoseconds: bigint): string {
  // ICRC3 timestamps are in nanoseconds
  const milliseconds = Number(nanoseconds / 1000000n);
  return new Date(milliseconds).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatRelativeTime(nanoseconds: bigint): string {
  const milliseconds = Number(nanoseconds / 1000000n);
  const now = Date.now();
  const diffMs = now - milliseconds;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}

// ============================================================================
// Add Certificate Event
// ============================================================================

import type { EventCategory } from '../components/detail/certificate-events';

interface AddCertificateEventInput {
  canisterId: string;
  tokenId: string;
  event: {
    date: string;
    category: EventCategory;
    description: string;
    file?: File;
  };
}

interface UseAddCertificateEventOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for adding an event to a certificate's history
 *
 * This stores the event in the certificate's metadata by:
 * 1. Fetching existing metadata
 * 2. Adding the new event to it
 * 3. Updating with the merged metadata
 *
 * This ensures we don't overwrite existing certificate data.
 */
export const useAddCertificateEvent = (options?: UseAddCertificateEventOptions) => {
  const { authenticatedAgent } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddCertificateEventInput) => {
      if (!authenticatedAgent) {
        throw new Error('Not authenticated');
      }

      // Step 1: Fetch existing metadata to preserve it
      const existingMetadata = await CertificatesService.getCertificateMetadata(
        authenticatedAgent,
        input.canisterId,
        [BigInt(input.tokenId)]
      );

      console.log('[useAddCertificateEvent] Existing metadata fields:',
        existingMetadata[0]?.map(([key]) => key) || []
      );

      let attachmentUrl: string | undefined;
      let attachmentFilename: string | undefined;

      // Upload file if provided
      if (input.event.file) {
        attachmentUrl = await CertificatesService.uploadCertificateFile(
          authenticatedAgent,
          input.canisterId,
          input.event.file
        );
        attachmentFilename = input.event.file.name;
      }

      // Build event metadata in ICRC3 format
      const eventRecord: Array<[string, ICRC3Value]> = [
        ['date', { Text: input.event.date }],
        ['category', { Text: input.event.category }],
        ['description', { Text: input.event.description }],
        ['timestamp', { Nat: BigInt(Date.now()) }],
      ];

      if (attachmentUrl) {
        eventRecord.push(['attachment_url', { Text: attachmentUrl }]);
      }
      if (attachmentFilename) {
        eventRecord.push(['attachment_filename', { Text: attachmentFilename }]);
      }

      // Step 2: Merge existing metadata with new event
      const eventKey = `event_${Date.now()}`;
      const mergedMetadata: Array<[string, ICRC3Value]> = [
        ...(existingMetadata[0] || []),
        [eventKey, { Map: eventRecord }],
      ];

      console.log('[useAddCertificateEvent] Updating with merged metadata, total fields:', mergedMetadata.length);

      // Step 3: Update with the full merged metadata
      await CertificatesService.updateCertificate(
        authenticatedAgent,
        input.canisterId,
        BigInt(input.tokenId),
        mergedMetadata
      );

      return { success: true };
    },
    onSuccess: (_, variables) => {
      console.log('[useAddCertificateEvent] Successfully added event');

      // Invalidate certificate queries to refetch with new event
      queryClient.invalidateQueries({
        queryKey: certificatesKeys.detail(`${variables.canisterId}:${variables.tokenId}`),
      });
      queryClient.invalidateQueries({
        queryKey: ['certificate-transaction-history', variables.canisterId, variables.tokenId],
      });

      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('[useAddCertificateEvent] Failed to add event:', error);
      options?.onError?.(error);
    },
  });
};
