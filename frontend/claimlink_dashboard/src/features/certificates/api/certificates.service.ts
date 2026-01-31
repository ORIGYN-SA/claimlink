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
   * Sanitize a filename to be safe for use in file paths.
   * Removes special characters, spaces, and normalizes the name.
   */
  private static sanitizeFilename(filename: string): string {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '_')  // Replace special chars with underscore
      .replace(/_+/g, '_')             // Remove consecutive underscores
      .replace(/^_|_$/g, '');          // Remove leading/trailing underscores
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
    // If URL is relative (starts with /), prepend the canister base URL
    if (url.startsWith('/')) {
      const baseUrl = buildCanisterUrl(canisterId);
      return `${baseUrl}${url}`;
    }

    // If URL is already absolute, check if it needs domain correction
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // For production, ensure we're using .raw.icp0.io for direct asset access
      if (!isLocalReplica()) {
        // Convert icp0.io to raw.icp0.io if needed
        if (url.includes('.icp0.io') && !url.includes('.raw.icp0.io')) {
          return url.replace('.icp0.io', '.raw.icp0.io');
        }
        // Convert ic0.app to raw.icp0.io
        if (url.includes('.ic0.app')) {
          return url.replace('.ic0.app', '.raw.icp0.io');
        }
      }
      // URL is already in correct format
      return url;
    }

    // URL doesn't start with / or http - treat as relative path
    const baseUrl = buildCanisterUrl(canisterId);
    return `${baseUrl}/${url}`;
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
    // Prefix filename with timestamp and sanitize to avoid conflicts (same pattern as NFT repo)
    const sanitizedName = this.sanitizeFilename(file.name);
    const filePath = `${Date.now()}_${sanitizedName}`;
    const fileSize = BigInt(file.size);

    // Calculate file hash (SHA-256)
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fileHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Initialize upload
    await this.initUpload(agent, canisterId, filePath, fileHash, fileSize, BigInt(CHUNK_SIZE));

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
    }

    // Finalize and get URL
    const rawUrl = await this.finalizeUpload(agent, canisterId, filePath);

    // Normalize the URL for the current environment
    return this.normalizeAssetUrl(rawUrl, canisterId);
  }

  /**
   * Update certificate metadata
   *
   * Calls update_nft_metadata on the ORIGYN NFT canister to update token metadata.
   *
   * @param agent - Authenticated agent
   * @param canisterId - Collection canister ID
   * @param tokenId - Token ID to update
   * @param metadata - New metadata values
   * @returns The token ID on success
   * @throws Error if update fails
   */
  static async updateCertificate(
    agent: Agent,
    canisterId: string,
    tokenId: bigint,
    metadata: Array<[string, ICRC3Value]>
  ): Promise<bigint> {
    const actor = this.createActor(agent, canisterId);

    const result = await actor.update_nft_metadata({
      token_id: tokenId,
      metadata,
    });

    if ('Err' in result) {
      throw new Error(`Update failed: ${Object.keys(result.Err)[0]}`);
    }

    return result.Ok;
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
    return actor.icrc3_get_blocks([request]);
  }
}
