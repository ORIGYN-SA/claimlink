import { Actor, type Agent } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";
import { idlFactory } from "../idlFactory";
import type { _SERVICE, ICRC3Value, GetBlocksRequest, GetBlocksResult } from "../interfaces";

export class OrigynNftService {
  private static createActor(agent: Agent, canisterId: string): _SERVICE {
    return Actor.createActor<_SERVICE>(idlFactory, {
      agent,
      canisterId,
    });
  }

  /**
   * Mint NFT
   * Request structure based on IDL Args_2: { metadata, token_owner, memo }
   */
  static async mint(
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

    const result = await actor.mint(mintRequest);

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
   * Upload a complete file with chunked upload
   * Helper that combines initUpload, storeChunk, and finalizeUpload
   *
   * @param agent - Authenticated agent
   * @param canisterId - Canister to upload to
   * @param file - File to upload
   * @param onProgress - Optional progress callback
   * @returns URL of the uploaded file
   */
  static async uploadFile(
    agent: Agent,
    canisterId: string,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
    const filePath = file.name;
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

      await this.storeChunk(agent, canisterId, filePath, BigInt(i), chunkData);

      // Report progress
      if (onProgress) {
        onProgress(((i + 1) / totalChunks) * 100);
      }
    }

    // Finalize and get URL
    return await this.finalizeUpload(agent, canisterId, filePath);
  }

  /**
   * Get tokens owned by account (from reference App.js:121-125)
   * Used to fetch user's NFTs in a collection
   */
  static async getTokensOf(
    agent: Agent,
    canisterId: string,
    account: { owner: Principal; subaccount: [] },
  ): Promise<bigint[]> {
    const actor = this.createActor(agent, canisterId);
    return await actor.icrc7_tokens_of(account, [], []);
  }

  /**
   * Get token metadata (from reference App.js:131-140)
   * Returns metadata as array of [key, ICRC3Value] tuples
   */
  static async getTokenMetadata(
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
   * Get ICRC3 transaction blocks
   * Used for fetching transaction history and events
   */
  static async getTransactionBlocks(
    agent: Agent,
    canisterId: string,
    start: bigint,
    length: bigint,
  ): Promise<GetBlocksResult> {
    const actor = this.createActor(agent, canisterId);
    const request: GetBlocksRequest = { start, length };

    console.log('[OrigynNftService.getTransactionBlocks] Fetching blocks:', {
      canisterId,
      start: start.toString(),
      length: length.toString(),
    });

    const result = await actor.icrc3_get_blocks([request]);

    console.log('[OrigynNftService.getTransactionBlocks] Fetched blocks:', {
      log_length: result.log_length.toString(),
      blocks_count: result.blocks.length,
      archived_blocks_count: result.archived_blocks.length,
    });

    return result;
  }
}
