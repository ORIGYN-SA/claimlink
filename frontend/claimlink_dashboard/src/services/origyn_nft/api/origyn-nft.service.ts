import { Actor, type Agent } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";
import { idlFactory } from "../idlFactory";
import type { _SERVICE, ICRC3Value } from "../interfaces";

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

    const mintRequest = {
      metadata,
      token_owner: tokenOwner,
      memo: memo ? [memo] : [],
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

    const result = await actor.init_upload({
      file_path: filePath,
      file_hash: fileHash,
      file_size: fileSize,
      chunk_size: chunkSize ? [chunkSize] : [],
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
}
