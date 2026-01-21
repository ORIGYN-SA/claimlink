import type { Agent } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";
import { idlFactory } from "@canisters/origyn_nft";
import type { _SERVICE, ICRC3Value, GetBlocksRequest, GetBlocksResult } from "@canisters/origyn_nft";
import { createCanisterActor, retryWithBackoff } from "@/shared/canister";
import { buildCanisterUrl, isLocalReplica } from "@/features/template-renderer/utils/url-resolver";

/**
 * Certificates Service
 *
 * Handles certificate operations using the ORIGYN NFT canister.
 * Certificates are NFTs with ORIGYN badge - technically the same as NFTs.
 */
export class CertificatesService {
  private static createActor(agent: Agent, canisterId: string): _SERVICE {
    return createCanisterActor<_SERVICE>(agent, canisterId, idlFactory);
  }

  /**
   * Normalize an asset URL returned by the backend to the correct format.
   *
   * The backend may return URLs in various formats:
   * - Relative path: "/filename.jpg" → needs canister base URL prepended
   * - Wrong domain: "https://canister.icp0.io/..." → needs ".raw" subdomain
   * - Already correct: pass through
   *
   * @param url - URL returned by finalizeUpload
   * @param canisterId - Canister ID for building the base URL
   * @returns Normalized URL in the correct format for the environment
   */
  private static normalizeAssetUrl(url: string, canisterId: string): string {
    console.log('[Upload Debug] normalizeAssetUrl input:', { url, canisterId });

    // If URL is relative (starts with /), prepend the canister base URL
    if (url.startsWith('/')) {
      const baseUrl = buildCanisterUrl(canisterId);
      const normalized = `${baseUrl}${url}`;
      console.log('[Upload Debug] Normalized relative URL:', { original: url, normalized });
      return normalized;
    }

    // If URL is already absolute, check if it needs domain correction
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // For production, ensure we're using .raw.icp0.io for direct asset access
      if (!isLocalReplica()) {
        // Convert icp0.io to raw.icp0.io if needed
        if (url.includes('.icp0.io') && !url.includes('.raw.icp0.io')) {
          const normalized = url.replace('.icp0.io', '.raw.icp0.io');
          console.log('[Upload Debug] Added .raw to domain:', { original: url, normalized });
          return normalized;
        }
        // Convert ic0.app to raw.icp0.io
        if (url.includes('.ic0.app')) {
          const normalized = url.replace('.ic0.app', '.raw.icp0.io');
          console.log('[Upload Debug] Converted ic0.app to raw.icp0.io:', { original: url, normalized });
          return normalized;
        }
      }
      // URL is already in correct format
      console.log('[Upload Debug] URL already in correct format:', url);
      return url;
    }

    // URL doesn't start with / or http - treat as relative path
    const baseUrl = buildCanisterUrl(canisterId);
    const normalized = `${baseUrl}/${url}`;
    console.log('[Upload Debug] Normalized path URL:', { original: url, normalized });
    return normalized;
  }

  /**
   * Mint a certificate (NFT with ORIGYN badge)
   * Request structure based on IDL Args_2: { mint_requests: [{ metadata, token_owner, memo }] }
   */
  static async mintCertificate(
    agent: Agent,
    canisterId: string,
    tokenOwner: { owner: Principal; subaccount: [] | [Uint8Array | number[]] },
    metadata: Array<[string, ICRC3Value]>,
    memo?: Uint8Array | number[],
  ): Promise<bigint> {
    const actor = this.createActor(agent, canisterId);

    // Type-safe memo value
    const memoValue: [] | [Uint8Array | number[]] = memo ? [memo] : [];

    const mintRequest = {
      metadata,
      token_owner: tokenOwner,
      memo: memoValue,
    };

    // Wrap in mint_requests array (batch minting interface)
    const result = await actor.mint({ mint_requests: [mintRequest] });

    if ("Err" in result) {
      throw new Error(`Minting failed: ${Object.keys(result.Err)[0]}`);
    }

    return result.Ok; // Return token ID
  }

  /**
   * Initialize chunked upload (from reference MintingForm.js:193-206)
   */
  static async initUpload(
    agent: Agent,
    canisterId: string,
    filePath: string,
    fileHash: string,
    fileSize: bigint,
    chunkSize?: bigint,
  ): Promise<void> {
    const actor = this.createActor(agent, canisterId);

    // Type-safe chunk_size value
    const chunkSizeValue: [] | [bigint] = chunkSize ? [chunkSize] : [];

    const result = await actor.init_upload({
      file_path: filePath,
      file_hash: fileHash,
      file_size: fileSize,
      chunk_size: chunkSizeValue,
    });

    if ("Err" in result) {
      throw new Error(`Init upload failed: ${Object.keys(result.Err)[0]}`);
    }
  }

  /**
   * Store chunk (from reference MintingForm.js:216-220)
   */
  static async storeChunk(
    agent: Agent,
    canisterId: string,
    filePath: string,
    chunkId: bigint,
    chunkData: number[],
  ): Promise<void> {
    const actor = this.createActor(agent, canisterId);

    const result = await actor.store_chunk({
      file_path: filePath,
      chunk_id: chunkId,
      chunk_data: chunkData,
    });

    if ("Err" in result) {
      throw new Error(`Store chunk failed: ${Object.keys(result.Err)[0]}`);
    }
  }

  /**
   * Finalize upload (from reference MintingForm.js:235-238)
   */
  static async finalizeUpload(
    agent: Agent,
    canisterId: string,
    filePath: string,
  ): Promise<string> {
    const actor = this.createActor(agent, canisterId);

    const result = await actor.finalize_upload({
      file_path: filePath,
    });

    if ("Err" in result) {
      throw new Error(`Finalize upload failed: ${Object.keys(result.Err)[0]}`);
    }

    return result.Ok.url;
  }

  /**
   * Upload a complete certificate file with chunked upload
   * Helper that combines initUpload, storeChunk, and finalizeUpload
   *
   * @param agent - Authenticated agent
   * @param canisterId - Canister to upload to
   * @param file - File to upload
   * @param onProgress - Optional progress callback
   * @returns URL of the uploaded file (normalized for the current environment)
   */
  static async uploadCertificateFile(
    agent: Agent,
    canisterId: string,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    const CHUNK_SIZE = 1024 * 1024; // 1MB chunks - DO NOT INCREASE (IC message size limit)
    // Prefix filename with timestamp to avoid conflicts (same pattern as NFT repo)
    const filePath = `${Date.now()}_${file.name}`;
    const fileSize = BigInt(file.size);

    console.log('[Upload Debug] Starting upload:', {
      fileName: file.name,
      filePath,
      fileType: file.type,
      fileSize: file.size,
      canisterId,
      totalChunks: Math.ceil(file.size / CHUNK_SIZE),
    });

    // Calculate file hash (SHA-256)
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fileHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    console.log('[Upload Debug] File hash calculated:', fileHash.substring(0, 16) + '...');

    // Initialize upload
    await this.initUpload(agent, canisterId, filePath, fileHash, fileSize, BigInt(CHUNK_SIZE));
    console.log('[Upload Debug] initUpload successful');

    // Upload chunks
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunkData = Array.from(uint8Array.slice(start, end));

      // Upload chunk with retry on failure
      await retryWithBackoff(
        async () => {
          await this.storeChunk(agent, canisterId, filePath, BigInt(i), chunkData);
        },
        { maxRetries: 3, operationName: `Chunk ${i + 1}/${totalChunks}` }
      );

      // Report progress
      if (onProgress) {
        onProgress(((i + 1) / totalChunks) * 100);
      }

      console.log(`[Upload Debug] Chunk ${i + 1}/${totalChunks} uploaded`);
    }

    // Finalize and get URL
    const rawUrl = await this.finalizeUpload(agent, canisterId, filePath);

    console.log('[Upload Debug] finalizeUpload returned:', {
      rawUrl,
      canisterId,
      filePath,
      isAbsolute: rawUrl.startsWith('http'),
      hasRawDomain: rawUrl.includes('.raw.'),
    });

    // Enhanced debug logging for multi-chunk analysis
    console.log('[Upload Debug] Multi-chunk analysis:', {
      fileName: file.name,
      fileSize: file.size,
      totalChunks,
      isMultiChunk: totalChunks > 1,
      rawUrlFromFinalize: rawUrl,
      urlPattern: rawUrl.includes('/-/') ? 'token-asset' : rawUrl.includes('/collection/-/') ? 'collection-asset' : 'unknown',
      chunkSize: CHUNK_SIZE,
      expectedChunkCount: Math.ceil(file.size / CHUNK_SIZE),
    });

    // Normalize the URL for the current environment
    const normalizedUrl = this.normalizeAssetUrl(rawUrl, canisterId);

    console.log('[Upload Debug] Final normalized URL:', normalizedUrl);

    return normalizedUrl;
  }

  /**
   * Update certificate metadata
   *
   * Note: This method attempts to update token metadata on ORIGYN NFT canister.
   * The actual capability depends on the ORIGYN NFT implementation.
   * Some fields may be immutable after minting.
   *
   * @param agent - Authenticated agent
   * @param canisterId - Collection canister ID
   * @param tokenId - Token ID to update
   * @param metadata - New metadata values
   * @throws Error if update is not supported or fails
   */
  static async updateCertificate(
    agent: Agent,
    canisterId: string,
    tokenId: bigint,
    metadata: Array<[string, ICRC3Value]>
  ): Promise<void> {
    const actor = this.createActor(agent, canisterId);

    // Attempt to call update_token_metadata if available
    // Note: This may not be supported by all ORIGYN NFT versions
    try {
      // @ts-ignore - update_token_metadata may not be in types
      const result = await actor.update_token_metadata?.({
        token_id: tokenId,
        metadata: metadata,
      });

      if (result && 'Err' in result) {
        throw new Error(`Update failed: ${Object.keys(result.Err)[0]}`);
      }
    } catch (error) {
      console.error('[CertificatesService.updateCertificate] Update not supported:', error);
      throw new Error(
        'Certificate metadata update is not supported by this collection. ' +
        'Most fields are immutable after minting.'
      );
    }
  }

  /**
   * Get certificates owned by account
   * Used to fetch user's certificates in a collection
   */
  static async getCertificatesOf(
    agent: Agent,
    canisterId: string,
    account: { owner: Principal; subaccount: [] },
  ): Promise<bigint[]> {
    const actor = this.createActor(agent, canisterId);
    return await actor.icrc7_tokens_of(account, [], []);
  }

  /**
   * Get certificate metadata
   * Returns metadata as array of [key, ICRC3Value] tuples
   */
  static async getCertificateMetadata(
    agent: Agent,
    canisterId: string,
    tokenIds: bigint[],
  ): Promise<Array<Array<[string, ICRC3Value]>>> {
    const actor = this.createActor(agent, canisterId);
    const result = await actor.icrc7_token_metadata(tokenIds);
    return result.map((opt) => opt[0] || []);
  }

  /**
   * Get collection metadata (ICRC7 standard)
   */
  static async getCollectionMetadata(
    agent: Agent,
    canisterId: string,
  ): Promise<Array<[string, ICRC3Value]>> {
    const actor = this.createActor(agent, canisterId);
    return await actor.icrc7_collection_metadata();
  }

  /**
   * Get ICRC3 transaction history
   * Used for fetching transaction history and events
   */
  static async getTransactionHistory(
    agent: Agent,
    canisterId: string,
    start: bigint,
    length: bigint,
  ): Promise<GetBlocksResult> {
    const actor = this.createActor(agent, canisterId);
    const request: GetBlocksRequest = { start, length };

    console.log('[CertificatesService.getTransactionHistory] Fetching blocks:', {
      canisterId,
      start: start.toString(),
      length: length.toString(),
    });

    const result = await actor.icrc3_get_blocks([request]);

    console.log('[CertificatesService.getTransactionHistory] Fetched blocks:', {
      log_length: result.log_length.toString(),
      blocks_count: result.blocks.length,
      archived_blocks_count: result.archived_blocks.length,
    });

    return result;
  }
}
