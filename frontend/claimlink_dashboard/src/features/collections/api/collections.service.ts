/**
 * Collections Service Layer
 *
 * Abstracts collection data access for easy backend swap.
 * Currently uses mock data from shared/data/collections.ts.
 * TODO: Replace with ClaimLink backend API when ready.
 */

import type { Collection } from '../types/collection.types';
import { mockCollections } from '@/shared/data/collections';

export interface CreateCollectionRequest {
  title: string;
  description: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateCollectionRequest {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface CollectionFilters {
  status?: string;
  search?: string;
}

export class CollectionsService {
  /**
   * Get all collections
   */
  static async getCollections(
    filters?: CollectionFilters
  ): Promise<Collection[]> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.get_collections(filters);

    let collections = [...mockCollections];

    // Apply filters
    if (filters?.status) {
      collections = collections.filter((coll) => coll.status === filters.status);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      collections = collections.filter(
        (coll) =>
          coll.title.toLowerCase().includes(searchLower) ||
          coll.description.toLowerCase().includes(searchLower)
      );
    }

    return Promise.resolve(collections);
  }

  /**
   * Get a collection by its ID
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async getCollectionById(id: string): Promise<Collection | undefined> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.get_collection(id);

    const collection = mockCollections.find((coll) => coll.id === id);
    return Promise.resolve(collection);
  }

  /**
   * Create a new collection
   */
  static async createCollection(
    request: CreateCollectionRequest
  ): Promise<Collection> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.create_collection(request);

    // Mock implementation
    return Promise.resolve({
      id: `coll-${Date.now()}`,
      title: request.title,
      description: request.description,
      imageUrl:
        request.imageUrl ||
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
      itemCount: 0,
      status: 'Draft',
      createdDate: new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      lastModified: new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      creator: 'Current User',
    });
  }

  /**
   * Update an existing collection
   */
  static async updateCollection(
    request: UpdateCollectionRequest
  ): Promise<Collection> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.update_collection(request);

    // Mock implementation
    const existing = await this.getCollectionById(request.id);
    if (!existing) {
      throw new Error('Collection not found');
    }

    return Promise.resolve({
      ...existing,
      title: request.title || existing.title,
      description: request.description || existing.description,
      imageUrl: request.imageUrl || existing.imageUrl,
      lastModified: new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });
  }

  /**
   * Delete a collection
   */
  static async deleteCollection(_id: string): Promise<void> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.delete_collection(id);

    // Mock implementation
    return Promise.resolve();
  }

  /**
   * Get collection statistics
   */
  static async getCollectionStats(): Promise<{
    total: number;
    active: number;
    draft: number;
  }> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.get_collection_stats();

    const collections = mockCollections;
    return Promise.resolve({
      total: collections.length,
      active: collections.filter((c) => c.status === 'Active').length,
      draft: collections.filter((c) => c.status === 'Draft').length,
    });
  }
}
