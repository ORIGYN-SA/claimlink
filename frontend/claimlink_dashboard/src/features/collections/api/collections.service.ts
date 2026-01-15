import type { Agent } from '@dfinity/agent';
import type { Principal } from '@dfinity/principal';
import { Principal as PrincipalClass } from '@dfinity/principal';
import { idlFactory } from '@canisters/claimlink';
import type {
  _SERVICE,
  CollectionInfo,
  CollectionsResult,
  CreateCollectionArgs,
  Result,
} from '@canisters/claimlink';
import type { Collection } from '../types/collection.types';
import type { TemplateStructure } from '@/features/templates/types/template.types';
import {
  transformCollectionInfo,
  transformPaginationArgs,
  formatCreateCollectionError,
} from './transformers';
import { createCanisterActor, getCanisterId } from '@/shared/canister';
import {
  serializeTemplateForOrigyn,
  deserializeTemplateFromOrigyn,
} from '@/features/templates/utils/template-serializer';
import { TemplateService } from '@/features/templates';

/**
 * Create a ClaimLink canister actor
 */
function createActor(agent: Agent): _SERVICE {
  return createCanisterActor<_SERVICE>(agent, getCanisterId('claimlink'), idlFactory);
}

export class CollectionsService {
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
   * Get detailed information about a specific collection by canister ID
   */
  static async getCollectionInfo(
    agent: Agent,
    canisterId: Principal
  ): Promise<Collection | null> {
    const actor = createActor(agent);

    const searchParam: { CanisterId: Principal } = { CanisterId: canisterId };
    const result: [] | [CollectionInfo] = await actor.get_collection_info(searchParam);

    if (result.length === 0) {
      return null;
    }

    return transformCollectionInfo(result[0], 0);
  }

  /**
   * Get detailed information about a specific collection by collection ID
   */
  static async getCollectionInfoById(
    agent: Agent,
    collectionId: bigint
  ): Promise<Collection | null> {
    const actor = createActor(agent);

    const searchParam: { CollectionId: bigint } = { CollectionId: collectionId };
    const result: [] | [CollectionInfo] = await actor.get_collection_info(searchParam);

    if (result.length === 0) {
      return null;
    }

    return transformCollectionInfo(result[0], 0);
  }

  /**
   * Get total count of collections
   */
  static async getCollectionCount(agent: Agent): Promise<number> {
    const actor = createActor(agent);

    const count = await actor.get_collection_count();
    return Number(count);
  }

  /**
   * Create a new collection
   *
   * Note: The backend creates collections asynchronously. This method returns
   * the collection_id, and the actual canister will be created in the background.
   * Use `getCollectionInfoById` to poll for the collection status and canister_id.
   *
   * @param agent - Authenticated IC agent
   * @param args - Collection creation arguments (name, description, symbol, template_id)
   * @returns The collection ID (bigint converted to string)
   * @throws Error with user-friendly message if creation fails
   */
  static async createCollection(
    agent: Agent,
    args: CreateCollectionArgs
  ): Promise<bigint> {
    const actor = createActor(agent);

    const result: Result = await actor.create_collection(args);

    if ('Err' in result) {
      throw new Error(formatCreateCollectionError(result.Err));
    }

    return result.Ok;
  }

  /**
   * Wait for collection to be created and return the canister ID
   *
   * Polls the backend until the collection has a canister_id or times out.
   *
   * @param agent - IC agent
   * @param collectionId - Collection ID to wait for
   * @param maxWaitMs - Maximum time to wait (default 60 seconds)
   * @param pollIntervalMs - Polling interval (default 2 seconds)
   * @returns The canister ID string
   * @throws Error if timeout or collection not found
   */
  static async waitForCollectionCanister(
    agent: Agent,
    collectionId: bigint,
    maxWaitMs: number = 60000,
    pollIntervalMs: number = 2000
  ): Promise<string> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitMs) {
      const collection = await this.getCollectionInfoById(agent, collectionId);

      if (!collection) {
        throw new Error('Collection not found');
      }

      // If we have a canister ID (not just the collection_id), return it
      // The transformer returns collection_id.toString() if canister_id is empty
      if (collection.id.length > 10) {
        // Canister IDs are longer than collection ID numbers
        return collection.id;
      }

      // Wait before polling again
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }

    throw new Error('Timeout waiting for collection canister to be created');
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
    // Import ORIGYN NFT IDL factory and types dynamically to avoid circular dependencies
    const { idlFactory: origynIdlFactory } = await import('@canisters/origyn_nft');
    type OrigynNftService = import('@canisters/origyn_nft')._SERVICE;

    const actor = createCanisterActor<OrigynNftService>(agent, collectionCanisterId, origynIdlFactory);

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

  /**
   * Store template structure in collection metadata
   *
   * Serializes and stores the TemplateStructure in the collection's
   * collection_metadata field for later retrieval during certificate editing.
   *
   * @param agent - Authenticated IC agent
   * @param collectionCanisterId - Collection canister ID
   * @param template - The template structure to store
   * @throws Error if storage fails
   */
  static async setCollectionTemplate(
    agent: Agent,
    collectionCanisterId: string,
    template: TemplateStructure
  ): Promise<void> {
    const { idlFactory: origynIdlFactory } = await import('@canisters/origyn_nft');
    type OrigynNftService = import('@canisters/origyn_nft')._SERVICE;

    const actor = createCanisterActor<OrigynNftService>(
      agent,
      collectionCanisterId,
      origynIdlFactory
    );

    const serializedTemplate = serializeTemplateForOrigyn(template);

    const result = await actor.update_collection_metadata({
      logo: [],
      description: [],
      name: [],
      symbol: [],
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
      collection_metadata: [[serializedTemplate]],
    });

    if ('Err' in result) {
      const errorKey = Object.keys(result.Err)[0];
      throw new Error(`Failed to store collection template: ${errorKey}`);
    }
  }

  /**
   * Get template structure for a collection
   *
   * Fetches the template linked to this collection from the claimlink backend.
   * The flow is:
   * 1. Get collection info by canister ID to find owner and template_id
   * 2. Fetch templates by owner
   * 3. Find the template matching the collection's template_id
   * 4. Return the template structure
   *
   * Falls back to ORIGYN metadata for backwards compatibility with older collections.
   *
   * @param agent - IC agent (can be unauthenticated for reads)
   * @param collectionCanisterId - The collection's canister ID
   * @returns The template structure, or null if not found
   */
  static async getCollectionTemplate(
    agent: Agent,
    collectionCanisterId: string
  ): Promise<TemplateStructure | null> {
    const actor = createActor(agent);

    try {
      // Step 1: Get collection info by canister ID
      const searchParam = { CanisterId: PrincipalClass.fromText(collectionCanisterId) };
      const collectionResult = await actor.get_collection_info(searchParam);

      if (collectionResult.length === 0) {
        console.warn(`Collection not found for canister ID: ${collectionCanisterId}`);
        // Fall back to ORIGYN metadata for legacy collections
        return this.getCollectionTemplateFromOrigyn(agent, collectionCanisterId);
      }

      const collectionInfo = collectionResult[0];
      const templateId = collectionInfo.metadata.template_id;
      const owner = collectionInfo.owner;

      // Step 2: Fetch templates by owner
      const { templates } = await TemplateService.getTemplatesByOwner(agent, owner, { limit: 100 });

      // Step 3: Find the template matching the collection's template_id
      const template = templates.find((t) => t.id === templateId.toString());

      if (!template) {
        console.warn(`Template not found for ID: ${templateId}, falling back to ORIGYN metadata`);
        return this.getCollectionTemplateFromOrigyn(agent, collectionCanisterId);
      }

      // Step 4: Return the template structure
      return template.structure || null;
    } catch (error) {
      console.warn('Failed to fetch template from backend, falling back to ORIGYN:', error);
      return this.getCollectionTemplateFromOrigyn(agent, collectionCanisterId);
    }
  }

  /**
   * Get template structure from ORIGYN collection metadata (legacy)
   *
   * Fetches the TemplateStructure stored in the collection's ORIGYN metadata.
   * Used for backwards compatibility with collections created before template linking.
   *
   * @param agent - IC agent (can be unauthenticated for reads)
   * @param collectionCanisterId - The collection's canister ID
   * @returns The template structure, or null if not found
   */
  static async getCollectionTemplateFromOrigyn(
    agent: Agent,
    collectionCanisterId: string
  ): Promise<TemplateStructure | null> {
    try {
      const { idlFactory: origynIdlFactory } = await import('@canisters/origyn_nft');
      type OrigynNftService = import('@canisters/origyn_nft')._SERVICE;

      const actor = createCanisterActor<OrigynNftService>(
        agent,
        collectionCanisterId,
        origynIdlFactory
      );

      // Fetch collection metadata via ICRC7
      const metadata = await actor.icrc7_collection_metadata();

      return deserializeTemplateFromOrigyn(metadata);
    } catch (error) {
      console.warn('Failed to fetch template from ORIGYN metadata:', error);
      return null;
    }
  }
}
