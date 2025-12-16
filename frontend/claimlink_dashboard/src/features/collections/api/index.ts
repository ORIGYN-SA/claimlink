/**
 * Collections API Layer
 * Exports service and query hooks
 */

export { CollectionsService } from './collections.service';
export type {
  CreateCollectionRequest,
  UpdateCollectionRequest,
  CollectionFilters,
} from './collections.service';

export {
  collectionsKeys,
  useCollections,
  useCollection,
  useCollectionStats,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
} from './collections.queries';
