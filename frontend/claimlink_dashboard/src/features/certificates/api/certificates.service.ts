import type { Agent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory } from "@canisters/origyn_nft";
import type { _SERVICE, ICRC3Value, GetBlocksRequest, GetBlocksResult, TransferError } from "@canisters/origyn_nft";
import { idlFactory as claimlinkIdlFactory } from "@canisters/claimlink";
import type {
  _SERVICE as ClaimlinkService,
  MintCostEstimate,
  OgyPriceData,
  ICRC3Value_1,
} from "@canisters/claimlink";
import { createCanisterActor, retryWithBackoff, getCanisterId } from "@/shared/canister";
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

    // If URL is already absolute, normalize domain
    if (url.startsWith('http://') || url.startsWith('https://')) {
      if (!isLocalReplica()) {
        // Convert .raw.icp0.io to .icp0.io (raw fails for chunked assets >2MB)
        if (url.includes('.raw.icp0.io')) {
          return url.replace('.raw.icp0.io', '.icp0.io');
        }
        // Convert ic0.app to icp0.io
        if (url.includes('.ic0.app')) {
          return url.replace('.ic0.app', '.icp0.io');
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
   * Transfer a certificate to a new owner
   *
   * Calls icrc7_transfer on the ORIGYN NFT canister.
   * The authenticated user's agent signs the call, so only the actual token owner can transfer.
   *
   * @param agent - Authenticated agent (must be the token owner)
   * @param canisterId - Collection canister ID
   * @param tokenId - Token ID to transfer
   * @param recipientPrincipal - Principal ID of the recipient
   * @returns Transaction index on success
   * @throws Error with user-friendly message on failure
   */
  static async transferCertificate(
    agent: Agent,
    canisterId: string,
    tokenId: string,
    recipientPrincipal: string,
  ): Promise<bigint> {
    // Validate principal before making the canister call
    let recipient: Principal;
    try {
      recipient = Principal.fromText(recipientPrincipal);
    } catch {
      throw new Error('Invalid recipient principal ID. Please check the format and try again.');
    }

    const actor = this.createActor(agent, canisterId);

    const transferArg = {
      to: { owner: recipient, subaccount: [] as [] },
      token_id: BigInt(tokenId),
      memo: [] as [],
      from_subaccount: [] as [],
      created_at_time: [] as [],
    };

    const results = await actor.icrc7_transfer([transferArg]);

    // Unwrap the single result from the batch response
    const result = results[0];
    if (!result || result.length === 0) {
      throw new Error('Transfer returned no result. Please try again.');
    }

    const innerResult = result[0];
    if (!innerResult) {
      throw new Error('Transfer returned no result. Please try again.');
    }

    if ('Err' in innerResult) {
      throw new Error(this.formatTransferError(innerResult.Err));
    }

    return innerResult.Ok;
  }

  /**
   * Map TransferError variants to user-friendly messages
   */
  private static formatTransferError(error: TransferError): string {
    if ('Unauthorized' in error) {
      return 'You are not the owner of this certificate.';
    }
    if ('NonExistingTokenId' in error) {
      return 'Certificate not found.';
    }
    if ('InvalidRecipient' in error) {
      return 'Invalid recipient address.';
    }
    if ('Duplicate' in error) {
      return `Duplicate transfer. Already processed as transaction ${error.Duplicate.duplicate_of}.`;
    }
    if ('CreatedInFuture' in error) {
      return 'Transfer timestamp is in the future. Please try again.';
    }
    if ('TooOld' in error) {
      return 'Transfer request expired. Please try again.';
    }
    if ('GenericError' in error) {
      return error.GenericError.message || 'Transfer failed.';
    }
    if ('GenericBatchError' in error) {
      return error.GenericBatchError.message || 'Transfer failed.';
    }
    return 'Transfer failed. Please try again.';
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

/**
 * ClaimLink Minting Service
 *
 * Handles paid minting operations through the ClaimLink backend canister.
 * This replaces direct ORIGYN canister calls for new mints (edits still go direct).
 */
export class ClaimlinkMintingService {
  private static createActor(agent: Agent): ClaimlinkService {
    return createCanisterActor<ClaimlinkService>(
      agent,
      getCanisterId('claimlink'),
      claimlinkIdlFactory,
    );
  }

  /**
   * Estimate the cost of minting certificates
   */
  static async estimateMintCost(
    agent: Agent,
    collectionCanisterId: string,
    numMints: number,
    totalFileSizeBytes: number,
  ): Promise<MintCostEstimate> {
    const actor = this.createActor(agent);
    const result = await actor.estimate_mint_cost({
      collection_canister_id: Principal.fromText(collectionCanisterId),
      num_mints: BigInt(numMints),
      total_file_size_bytes: BigInt(totalFileSizeBytes),
    });

    if ('Err' in result) {
      const errKey = Object.keys(result.Err)[0];
      if (errKey === 'MintPricingNotConfigured') {
        throw new Error('Mint pricing is not configured on this canister.');
      }
      if (errKey === 'OgyPriceNotAvailable') {
        throw new Error('OGY price data is currently unavailable. Please try again later.');
      }
      throw new Error(`Estimate failed: ${errKey}`);
    }

    return result.Ok;
  }

  /**
   * Initialize a paid mint request
   * The backend collects OGY payment via ICRC-2 transfer_from
   */
  static async initializeMint(
    agent: Agent,
    collectionCanisterId: string,
    numMints: number,
    totalFileSizeBytes: number,
  ): Promise<bigint> {
    const actor = this.createActor(agent);
    const result = await actor.initialize_mint({
      collection_canister_id: Principal.fromText(collectionCanisterId),
      num_mints: BigInt(numMints),
      total_file_size_bytes: BigInt(totalFileSizeBytes),
    });

    if ('Err' in result) {
      const err = result.Err;
      if ('CallerNotCollectionOwner' in err) {
        throw new Error('You are not the owner of this collection.');
      }
      if ('CollectionNotFound' in err) {
        throw new Error('Collection not found.');
      }
      if ('CollectionNotReady' in err) {
        throw new Error('Collection is not ready for minting.');
      }
      if ('TransferFromError' in err) {
        const transferErr = err.TransferFromError;
        if ('InsufficientAllowance' in transferErr) {
          throw new Error('Insufficient OGY allowance. Please approve spending first.');
        }
        if ('InsufficientFunds' in transferErr) {
          throw new Error('Insufficient OGY balance.');
        }
        throw new Error(`OGY payment failed: ${Object.keys(transferErr)[0]}`);
      }
      if ('OgyPriceNotAvailable' in err) {
        throw new Error('OGY price data is currently unavailable.');
      }
      throw new Error(`Initialize mint failed: ${Object.keys(err)[0]}`);
    }

    return result.Ok;
  }

  /**
   * Upload a file through the ClaimLink proxy
   * Same chunked upload pattern but routed through ClaimLink canister
   */
  static async proxyUploadFile(
    agent: Agent,
    mintRequestId: bigint,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
    const sanitizedName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    const filePath = `${Date.now()}_${sanitizedName}`;

    // Calculate file hash (SHA-256)
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fileHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const actor = this.createActor(agent);

    // Initialize upload
    const initResult = await actor.proxy_init_upload({
      mint_request_id: mintRequestId,
      file_path: filePath,
      file_hash: fileHash,
      file_size: BigInt(file.size),
      chunk_size: [BigInt(CHUNK_SIZE)],
    });

    if ('Err' in initResult) {
      throw new Error(`Proxy init upload failed: ${this.formatProxyUploadError(initResult.Err)}`);
    }

    // Upload chunks
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunkData = Array.from(uint8Array.slice(start, end));

      await retryWithBackoff(
        async () => {
          const storeResult = await actor.proxy_store_chunk({
            mint_request_id: mintRequestId,
            file_path: filePath,
            chunk_id: BigInt(i),
            chunk_data: chunkData,
          });

          if ('Err' in storeResult) {
            throw new Error(`Proxy store chunk failed: ${this.formatProxyUploadError(storeResult.Err)}`);
          }
        },
        { maxRetries: 3, operationName: `Chunk ${i + 1}/${totalChunks}` },
      );

      if (onProgress) {
        onProgress(((i + 1) / totalChunks) * 100);
      }
    }

    // Finalize upload
    const finalizeResult = await actor.proxy_finalize_upload({
      mint_request_id: mintRequestId,
      file_path: filePath,
    });

    if ('Err' in finalizeResult) {
      throw new Error(`Proxy finalize upload failed: ${this.formatProxyUploadError(finalizeResult.Err)}`);
    }

    return finalizeResult.Ok;
  }

  /**
   * Mint NFTs through the ClaimLink proxy
   */
  static async mintNfts(
    agent: Agent,
    mintRequestId: bigint,
    mintItems: Array<{
      tokenOwner: { owner: Principal; subaccount: [] | [Uint8Array | number[]] };
      metadata: Array<[string, ICRC3Value_1]>;
      memo?: Uint8Array | number[];
    }>,
  ): Promise<bigint[]> {
    const actor = this.createActor(agent);

    const result = await actor.mint_nfts({
      mint_request_id: mintRequestId,
      mint_items: mintItems.map(item => ({
        token_owner: item.tokenOwner,
        metadata: item.metadata,
        memo: item.memo ? [item.memo] : [],
      })),
    });

    if ('Err' in result) {
      const err = result.Err;
      if ('MintError' in err) {
        throw new Error(`Minting failed: ${err.MintError}`);
      }
      if ('MintLimitExceeded' in err) {
        throw new Error(
          `Mint limit exceeded: requested ${err.MintLimitExceeded.requested}, ` +
          `already minted ${err.MintLimitExceeded.already_minted}, ` +
          `allowed ${err.MintLimitExceeded.allowed}`,
        );
      }
      throw new Error(`Mint failed: ${Object.keys(err)[0]}`);
    }

    return result.Ok;
  }

  /**
   * Get current OGY/USD price
   */
  static async getOgyUsdPrice(agent: Agent): Promise<OgyPriceData | null> {
    const actor = this.createActor(agent);
    const result = await actor.get_ogy_usd_price();
    return result.length > 0 ? (result[0] ?? null) : null;
  }

  private static formatProxyUploadError(err: { 'ByteLimitExceeded' : { 'requested' : bigint, 'allocated' : bigint, 'used' : bigint } } | { 'MintRequestNotFound' : null } | { 'UploadError' : string } | { 'Unauthorized' : null } | { 'MintRequestNotActive' : null }): string {
    if ('ByteLimitExceeded' in err) {
      return `File size exceeds allocated storage (used: ${err.ByteLimitExceeded.used}, allocated: ${err.ByteLimitExceeded.allocated})`;
    }
    if ('UploadError' in err) {
      return err.UploadError;
    }
    if ('MintRequestNotFound' in err) {
      return 'Mint request not found';
    }
    if ('Unauthorized' in err) {
      return 'Unauthorized';
    }
    if ('MintRequestNotActive' in err) {
      return 'Mint request is no longer active';
    }
    return 'Unknown upload error';
  }
}
