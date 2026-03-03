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
import { createCanisterActor, getCanisterId, retryWithBackoff } from '@/shared/canister';
import { buildCanisterUrl, getNonRawUrl } from '@/features/template-renderer/utils/url-resolver';
import {
  serializeTemplateForOrigyn,
  deserializeTemplateFromOrigyn,
} from '@/features/templates/utils/template-serializer';
import { TemplateService } from '@/features/templates';
import {
  CURRENT_TEMPLATE_VERSION,
  TEMPLATE_VERSION_KEY,
} from '@/features/template-renderer/version';

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
   * Wait for collection to be installed (WASM ready)
   *
   * Polls the backend until the collection reaches 'Installed' or 'TemplateUploaded' status.
   * This must be called before uploading files to the collection canister.
   *
   * Collection status flow: Queued → Created → Installed → TemplateUploaded
   *
   * @param agent - IC agent
   * @param collectionId - Collection ID to wait for
   * @param onStatusChange - Optional callback for status updates
   * @param maxWaitMs - Maximum time to wait (default 120 seconds - WASM install can take time)
   * @param pollIntervalMs - Polling interval (default 3 seconds)
   * @returns Object with canister ID and final status
   * @throws Error if timeout, collection not found, or collection failed
   */
  static async waitForCollectionInstalled(
    agent: Agent,
    collectionId: bigint,
    onStatusChange?: (status: string, canisterId?: string) => void,
    maxWaitMs: number = 120000,
    pollIntervalMs: number = 3000
  ): Promise<{ canisterId: string; status: string }> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitMs) {
      const collection = await this.getCollectionInfoById(agent, collectionId);

      if (!collection) {
        throw new Error('Collection not found');
      }

      const { backendStatus, id } = collection;
      const hasCanisterId = id.length > 10; // Canister IDs are longer than numeric collection IDs

      // Notify about status change
      onStatusChange?.(backendStatus, hasCanisterId ? id : undefined);

      // Check for failure states
      if (backendStatus === 'Failed') {
        throw new Error('Collection creation failed. Please try again.');
      }
      if (backendStatus === 'ReimbursingQueued' || backendStatus === 'QuarantinedReimbursement' || backendStatus === 'Reimbursed') {
        throw new Error(`Collection creation was cancelled. Status: ${backendStatus}`);
      }

      // Check for success state - collection must reach TemplateUploaded before proxy logo upload
      if (backendStatus === 'TemplateUploaded') {
        if (!hasCanisterId) {
          throw new Error('Collection installed but canister ID not available');
        }
        return { canisterId: id, status: backendStatus };
      }

      // Wait before polling again
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }

    throw new Error('Timeout waiting for collection to be installed. Please check the collection status later.');
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
   * Upload logo through ClaimLink proxy
   *
   * Routes the chunked upload through the ClaimLink canister, which validates
   * collection ownership and readiness before forwarding to the ORIGYN canister.
   * Max file size: 5MB (enforced by backend).
   *
   * @param agent - Authenticated IC agent
   * @param collectionCanisterId - Collection canister ID to upload to
   * @param file - Logo image file
   * @param onProgress - Optional progress callback (0-100)
   * @returns URL of the uploaded logo
   */
  static async proxyUploadLogo(
    agent: Agent,
    collectionCanisterId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const CHUNK_SIZE = 1024 * 1024; // 1MB chunks - DO NOT INCREASE (IC message size limit)
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

    const actor = createActor(agent);
    const collectionPrincipal = PrincipalClass.fromText(collectionCanisterId);

    // Initialize upload
    const initResult = await actor.proxy_logo_init_upload({
      collection_canister_id: collectionPrincipal,
      file_path: filePath,
      file_hash: fileHash,
      file_size: BigInt(file.size),
      chunk_size: [BigInt(CHUNK_SIZE)],
    });

    if ('Err' in initResult) {
      throw new Error(`Logo upload init failed: ${this.formatProxyLogoError(initResult.Err)}`);
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
          const storeResult = await actor.proxy_logo_store_chunk({
            collection_canister_id: collectionPrincipal,
            file_path: filePath,
            chunk_id: BigInt(i),
            chunk_data: chunkData,
          });

          if ('Err' in storeResult) {
            throw new Error(`Logo chunk upload failed: ${this.formatProxyLogoError(storeResult.Err)}`);
          }
        },
        { maxRetries: 3, operationName: `Logo chunk ${i + 1}/${totalChunks}` },
      );

      if (onProgress) {
        onProgress(((i + 1) / totalChunks) * 100);
      }
    }

    // Finalize upload
    const finalizeResult = await actor.proxy_logo_finalize_upload({
      collection_canister_id: collectionPrincipal,
      file_path: filePath,
    });

    if ('Err' in finalizeResult) {
      throw new Error(`Logo upload finalize failed: ${this.formatProxyLogoError(finalizeResult.Err)}`);
    }

    // Normalize URL for the current environment
    const rawUrl = finalizeResult.Ok;
    if (rawUrl.startsWith('/')) {
      return `${buildCanisterUrl(collectionCanisterId)}${rawUrl}`;
    }
    // Convert .raw.icp0.io to .icp0.io for reliable chunked asset loading
    return getNonRawUrl(rawUrl) ?? rawUrl;
  }

  /**
   * Format ProxyLogoUploadError into a human-readable string
   */
  private static formatProxyLogoError(error: import('@canisters/claimlink').ProxyLogoUploadError): string {
    if ('CollectionNotFound' in error) return 'Collection not found';
    if ('Unauthorized' in error) return 'Not authorized to upload to this collection';
    if ('CollectionNotReady' in error) return 'Collection is not ready for uploads yet';
    if ('FileTooLarge' in error) {
      const maxMb = Number(error.FileTooLarge.max_bytes) / (1024 * 1024);
      return `File too large (max ${maxMb}MB)`;
    }
    if ('UploadError' in error) return error.UploadError;
    return 'Unknown upload error';
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
      collection_metadata: [[
        serializedTemplate,
        [TEMPLATE_VERSION_KEY, { Text: CURRENT_TEMPLATE_VERSION }],
      ]],
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
   * Get collection logo from ORIGYN NFT canister metadata
   *
   * Fetches the logo URL stored in the ORIGYN NFT canister's ICRC7 collection metadata.
   * This is separate from ClaimLink backend metadata.
   *
   * @param agent - IC agent (can be unauthenticated for reads)
   * @param collectionCanisterId - The collection's canister ID
   * @returns Logo URL string, or empty string if not found
   */
  static async getCollectionLogo(
    agent: Agent,
    collectionCanisterId: string
  ): Promise<string> {
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

      // Find the logo field in metadata
      // ICRC7 metadata is an array of [string, ICRC3Value] tuples
      for (const [key, value] of metadata) {
        if (key === 'icrc7:logo' || key === 'logo') {
          // Logo can be stored as Text directly or in a nested structure
          if ('Text' in value) {
            // Convert .raw.icp0.io to .icp0.io for reliable chunked asset loading
            return getNonRawUrl(value.Text) ?? value.Text;
          }
        }
      }

      return '';
    } catch (error) {
      console.warn('Failed to fetch collection logo from ORIGYN metadata:', error);
      return '';
    }
  }

  /**
   * Get collection name and description from ORIGYN canister
   *
   * ORIGYN is the authoritative source for editable collection metadata.
   * ClaimLink backend stores registry data (owner, status, dates) but
   * name/description should always be read from ORIGYN.
   *
   * @param agent - IC agent (can be unauthenticated for reads)
   * @param collectionCanisterId - The collection's canister ID
   * @returns Object with name and description (may be undefined if not set)
   */
  static async getOrigynCollectionInfo(
    agent: Agent,
    collectionCanisterId: string
  ): Promise<{ name?: string; description?: string }> {
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

      let name: string | undefined;
      let description: string | undefined;

      // Parse name and description from metadata
      // ICRC7 metadata is an array of [string, ICRC3Value] tuples
      for (const [key, value] of metadata) {
        if ((key === 'icrc7:name' || key === 'name') && 'Text' in value) {
          name = value.Text;
        }
        if ((key === 'icrc7:description' || key === 'description') && 'Text' in value) {
          description = value.Text;
        }
      }

      return { name, description };
    } catch (error) {
      console.warn('Failed to fetch collection info from ORIGYN metadata:', error);
      return {};
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
