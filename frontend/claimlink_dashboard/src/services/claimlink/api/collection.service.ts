import { Actor } from '@dfinity/agent';
import type { Agent } from '@dfinity/agent';
import type { Principal } from '@dfinity/principal';
// @ts-ignore - JavaScript IDL factory file
import { idlFactory } from '../idlFactory';
import type {
  _SERVICE,
  CollectionInfo,
  CollectionsResult,
  CreateCollectionArgs,
  Result,
} from '../interfaces';
import type { Collection } from '@/features/collections/types/collection.types';
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

export class CollectionService {
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
}
