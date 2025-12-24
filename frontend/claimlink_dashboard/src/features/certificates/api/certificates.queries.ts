/**
 * Certificates Query Hooks
 *
 * React Query hooks for certificate data fetching using real ORIGYN NFT canister integration.
 * Certificates are NFTs with ORIGYN badge - technically the same, just presented differently.
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Principal } from '@dfinity/principal';
import { useAuth } from '@/features/auth';
import { CertificatesService } from './certificates.service';
import { getCertificateTitle, getCertificateImageUrl, extractMetadataValue } from './transformers';
import type { ICRC3Value } from '@canisters/origyn_nft';
import type { Certificate } from '../types/certificate.types';
import type { TemplateStructure, CertificateFormData } from '@/features/templates/types/template.types';
import type { FileReference } from '@/features/template-renderer/types';
import { buildOrigynApps, convertToIcrc3Metadata, parseOrigynMetadata, type ParsedOrigynMetadata } from '@/features/template-renderer';
import { CollectionsService } from '@/features/collections';
import type { CertificateEventsData } from '../components/certificate-events';
import type { CertificateLedgerData, LedgerTransaction } from '../components/certificate-ledger';

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

/**
 * Fetch certificates for a specific collection
 */
export const useCollectionCertificates = (collectionCanisterId: string) => {
  const { authenticatedAgent, principalId } = useAuth();

  return useQuery({
    queryKey: certificatesKeys.collection(collectionCanisterId),
    queryFn: async (): Promise<Certificate[]> => {
      if (!authenticatedAgent || !principalId) return [];

      // Step 1: Get token IDs
      const account = { owner: Principal.fromText(principalId), subaccount: [] as [] };
      const tokenIds = await CertificatesService.getCertificatesOf(
        authenticatedAgent,
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
        authenticatedAgent,
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
          date: extractMetadataValue(metadata, 'minted_at') || new Date().toLocaleDateString(),
          canisterId: collectionCanisterId,
          tokenId: tokenId.toString(),
        } as Certificate;
      });
    },
    enabled: !!authenticatedAgent && !!principalId && !!collectionCanisterId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
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
  /** Files to upload (field ID -> File array) */
  files?: Map<string, File[]>;
  /** Override name (optional, extracted from formData if not provided) */
  name?: string;
  /** Override description (optional, extracted from formData if not provided) */
  description?: string;
}

/**
 * Hook for minting certificates with full ORIGYN template support
 *
 * This hook:
 * 1. Uploads any files to the canister
 * 2. Builds the complete ORIGYN __apps structure using buildOrigynApps
 * 3. Converts to ICRC3 format
 * 4. Mints the certificate with embedded template views
 */
export const useMintCertificateWithTemplate = (options?: UseMintCertificateOptions) => {
  const { authenticatedAgent, principalId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: MintCertificateWithTemplateArgs) => {
      if (!authenticatedAgent || !principalId) {
        throw new Error('Not authenticated');
      }

      // Step 1: Upload files and build file references
      const uploadedFiles = new Map<string, FileReference[]>();

      if (args.files && args.files.size > 0) {
        for (const [fieldId, files] of args.files) {
          const refs: FileReference[] = [];

          for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Upload file with progress tracking
            const uploadedUrl = await CertificatesService.uploadCertificateFile(
              authenticatedAgent,
              args.collectionCanisterId,
              file,
              (progress) => {
                // Report overall progress for this field
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

      // Step 5: Mint the certificate
      const tokenId = await CertificatesService.mintCertificate(
        authenticatedAgent,
        args.collectionCanisterId,
        { owner: Principal.fromText(principalId), subaccount: [] },
        metadata
      );

      return tokenId;
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

      // Step 3: Find first uploaded image URL for the image field
      let imageUrl: string | undefined;
      uploadedFiles.forEach((refs) => {
        if (!imageUrl && refs.length > 0) {
          const firstRef = refs[0];
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

/**
 * Fetch a single certificate by collection ID and token ID
 * Returns certificate data and parsed ORIGYN metadata with templates
 */
export const useCertificate = (collectionId: string, tokenId: string) => {
  const { authenticatedAgent } = useAuth();

  return useQuery({
    queryKey: certificatesKeys.detail(`${collectionId}:${tokenId}`),
    queryFn: async (): Promise<CertificateWithParsedMetadata> => {
      if (!authenticatedAgent) {
        throw new Error('User not authenticated');
      }

      console.log('[useCertificate] Fetching certificate:', {
        collectionId,
        tokenId,
      });

      // Fetch metadata for this specific token
      const metadataResults = await CertificatesService.getCertificateMetadata(
        authenticatedAgent,
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
        authenticatedAgent,
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
        date: extractMetadataValue(rawMetadata, 'minted_at') || new Date().toLocaleDateString(),
        canisterId: collectionId,
        tokenId: tokenId,
      };

      console.log('[useCertificate] Certificate transformed:', certificate);

      return { certificate, parsedMetadata };
    },
    enabled: !!authenticatedAgent && !!collectionId && !!tokenId,
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
 */
export const useCertificateTransactionHistory = (
  collectionCanisterId: string,
  tokenId: string
) => {
  const { authenticatedAgent } = useAuth();

  return useQuery({
    queryKey: ['certificate-transaction-history', collectionCanisterId, tokenId],
    queryFn: async (): Promise<CertificateTransactionHistoryResult> => {
      if (!authenticatedAgent) {
        return {
          eventsData: { events: [] },
          ledgerData: { transactions: [] },
        };
      }

      console.log('[useCertificateTransactionHistory] Fetching history for token:', {
        collectionCanisterId,
        tokenId,
      });

      // Fetch last 100 blocks (adjust as needed)
      const blocksResult = await CertificatesService.getTransactionHistory(
        authenticatedAgent,
        collectionCanisterId,
        0n,
        100n
      );

      console.log('[useCertificateTransactionHistory] Blocks fetched:', {
        total_blocks: blocksResult.blocks.length,
        log_length: blocksResult.log_length.toString(),
      });

      // Parse blocks into events and transactions
      const events: CertificateEventsData['events'] = [];
      const transactions: LedgerTransaction[] = [];

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

          const date = timestamp ? formatTimestamp(timestamp) : 'Unknown date';
          const dateRelative = timestamp ? formatRelativeTime(timestamp) : 'Unknown time';

          // Create event
          let eventDescription = '';
          if (txType === '7mint') {
            eventDescription = `Certificate minted to ${shortenPrincipal(toPrincipal)}`;
          } else if (txType === '7transfer') {
            eventDescription = `Transferred from ${shortenPrincipal(fromPrincipal)} to ${shortenPrincipal(toPrincipal)}`;
          } else if (txType === '7burn') {
            eventDescription = `Certificate burned by ${shortenPrincipal(fromPrincipal)}`;
          } else {
            eventDescription = `Transaction: ${txType}`;
          }

          events.push({
            date,
            description: eventDescription,
          });

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

      // Reverse to show most recent first
      events.reverse();
      transactions.reverse();

      return {
        eventsData: { events },
        ledgerData: { transactions },
      };
    },
    enabled: !!authenticatedAgent && !!collectionCanisterId && !!tokenId,
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
    // Convert blob to principal text representation
    const bytes = blob instanceof Uint8Array ? blob : new Uint8Array(blob);
    // Simple hex representation for now
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (e) {
    return 'Unknown';
  }
}

function shortenPrincipal(principal: string): string {
  if (principal.length <= 20) return principal;
  return `${principal.slice(0, 10)}...${principal.slice(-10)}`;
}

function formatTimestamp(nanoseconds: bigint): string {
  // ICRC3 timestamps are in nanoseconds
  const milliseconds = Number(nanoseconds / 1000000n);
  return new Date(milliseconds).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
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
};
