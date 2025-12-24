import { Actor } from '@dfinity/agent';
import type { Agent } from '@dfinity/agent';
import type { Principal } from '@dfinity/principal';
import { idlFactory } from '@canisters/claimlink';
import type {
  _SERVICE,
  CollectionInfo,
  CollectionsResult,
  CreateCollectionArgs,
  Result,
} from '@canisters/claimlink';
import type { Collection } from '../types/collection.types';
import {
  transformCollectionInfo,
  transformPaginationArgs,
  formatCreateCollectionError,
} from './transformers';

const CLAIMLINK_CANISTER_ID =
  import.meta.env.VITE_CLAIMLINK_CANISTER_ID || '';

/**
 * Create a ClaimLink canister actor
 */
function createActor(agent: Agent): _SERVICE {
  if (!CLAIMLINK_CANISTER_ID) {
    throw new Error('VITE_CLAIMLINK_CANISTER_ID not set in environment');
  }

  return Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId: CLAIMLINK_CANISTER_ID,
  });
}

export class CollectionsService {
  /**
   * List collections owned by the calling principal
   */
  static async listMyCollections(
    agent: Agent,
    offset?: number,
    limit?: number
  ): Promise<{ collections: Collection[]; totalCount: number }> {
    const actor = createActor(agent);
    const paginationArgs = transformPaginationArgs(offset, limit);

    const result: CollectionsResult = await actor.list_my_collections(paginationArgs);

    return {
      collections: result.collections.map((info) =>
        transformCollectionInfo(info, 0)
      ),
      totalCount: Number(result.total_count),
    };
  }

  /**
   * List all collections in the system
   */
  static async listAllCollections(
    agent: Agent,
    offset?: number,
    limit?: number
  ): Promise<{ collections: Collection[]; totalCount: number }> {
    const actor = createActor(agent);
    const paginationArgs = transformPaginationArgs(offset, limit);

    const result: CollectionsResult = await actor.list_all_collections(paginationArgs);

    return {
      collections: result.collections.map((info) =>
        transformCollectionInfo(info, 0)
      ),
      totalCount: Number(result.total_count),
    };
  }

  /**
   * Get collections by owner principal
   */
  static async getCollectionsByOwner(
    agent: Agent,
    owner: Principal,
    offset?: number,
    limit?: number
  ): Promise<{ collections: Collection[]; totalCount: number }> {
    const actor = createActor(agent);
    const paginationArgs = transformPaginationArgs(offset, limit);

    const result: CollectionsResult = await actor.get_collections_by_owner({
      owner,
      pagination: paginationArgs,
    });

    return {
      collections: result.collections.map((info) =>
        transformCollectionInfo(info, 0)
      ),
      totalCount: Number(result.total_count),
    };
  }

  /**
   * Get detailed information about a specific collection
   */
  static async getCollectionInfo(
    agent: Agent,
    canisterId: Principal
  ): Promise<Collection | null> {
    const actor = createActor(agent);

    const result: [] | [CollectionInfo] = await actor.get_collection_info({
      canister_id: canisterId,
    });

    if (result.length === 0) {
      return null;
    }

    return transformCollectionInfo(result[0], 0);
  }

  /**
   * Check if a collection exists
   */
  static async collectionExists(
    agent: Agent,
    canisterId: Principal
  ): Promise<boolean> {
    const actor = createActor(agent);

    return await actor.collection_exists({
      canister_id: canisterId,
    });
  }

  /**
   * Get total count of collections
   */
  static async getCollectionCount(agent: Agent): Promise<number> {
    const actor = createActor(agent);

    const count = await actor.get_collection_count(null);
    return Number(count);
  }

  /**
   * Create a new collection
   * @throws Error with user-friendly message if creation fails
   */
  static async createCollection(
    agent: Agent,
    args: CreateCollectionArgs
  ): Promise<string> {
    const actor = createActor(agent);

    const result: Result = await actor.create_collection(args);

    if ('Err' in result) {
      throw new Error(formatCreateCollectionError(result.Err));
    }

    return result.Ok.origyn_nft_canister_id.toText();
  }

  /**
   * Get list of NFT token IDs in a collection
   *
   * Note: Uses "NFT" terminology to match the IC canister API (get_collection_nfts).
   * In ClaimLink, NFTs are the technical implementation - these tokens represent
   * Certificates from a user/business perspective.
   *
   * @param agent - Authenticated IC agent
   * @param canisterId - Principal of the collection canister
   * @param prev - Optional previous token ID for pagination
   * @param take - Optional number of tokens to fetch
   * @returns Array of token IDs (bigint)
   */
  static async getCollectionNfts(
    agent: Agent,
    canisterId: Principal,
    prev?: bigint,
    take?: bigint
  ): Promise<bigint[]> {
    const actor = createActor(agent);

    return await actor.get_collection_nfts({
      canister_id: canisterId,
      prev: prev !== undefined ? [prev] : [],
      take: take !== undefined ? [take] : [],
    });
  }

  /**
   * Upload logo directly to collection canister
   *
   * Uses ORIGYN NFT upload API to store logo in the collection's own canister.
   * The uploaded file will be accessible at: https://{canisterId}.raw.icp0.io/{filename}
   *
   * @param agent - Authenticated IC agent
   * @param collectionCanisterId - Collection canister ID to upload to
   * @param file - Logo image file
   * @param onProgress - Optional progress callback (0-100)
   * @returns URL of the uploaded logo
   */
  static async uploadLogoToCollection(
    agent: Agent,
    collectionCanisterId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const { CertificatesService } = await import('@/features/certificates/api/certificates.service');

    return await CertificatesService.uploadCertificateFile(
      agent,
      collectionCanisterId,
      file,
      onProgress
    );
  }

  /**
   * Update collection metadata directly on ORIGYN NFT canister
   *
   * Calls the collection canister's update_collection_metadata method to update
   * metadata fields like logo, name, description, etc.
   *
   * @param agent - Authenticated IC agent
   * @param collectionCanisterId - Collection canister ID
   * @param updates - Fields to update (logo, description, name, symbol)
   * @throws Error if update fails
   */
  static async updateCollectionMetadata(
    agent: Agent,
    collectionCanisterId: string,
    updates: {
      logo?: string;
      description?: string;
      name?: string;
      symbol?: string;
    }
  ): Promise<void> {
    // Import ORIGYN NFT IDL factory dynamically to avoid circular dependencies
    const { idlFactory } = await import('@canisters/origyn_nft');

    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: collectionCanisterId,
    });

    const result = await actor.update_collection_metadata({
      logo: updates.logo ? [updates.logo] : [],
      description: updates.description ? [updates.description] : [],
      name: updates.name ? [updates.name] : [],
      symbol: updates.symbol ? [updates.symbol] : [],
      supply_cap: [],
      max_query_batch_size: [],
      max_update_batch_size: [],
      max_take_value: [],
      default_take_value: [],
      max_memo_size: [],
      atomic_batch_transfers: [],
      tx_window: [],
      permitted_drift: [],
      max_canister_storage_threshold: [],
      collection_metadata: [],
    });

    if ('Err' in result) {
      const errorKey = Object.keys(result.Err)[0];
      throw new Error(`Failed to update collection metadata: ${errorKey}`);
    }
  }
}
