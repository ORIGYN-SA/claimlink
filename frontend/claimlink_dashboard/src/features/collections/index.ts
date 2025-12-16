// ============================================================================
// Components
// ============================================================================

export { CollectionsPage } from './components/collections-page'
export { CollectionDetailPage } from './components/collection-detail-page'
export { CollectionCard } from './components/collection-card'
export { AddCollectionCard } from './components/add-collection-card'
export { CollectionStatusBadge } from './components/collection-status-badge'
export { NewCollectionPage } from './components/new-collection-page'
export { CollectionFormSection } from './components/collection-form-section'
export { PricingSidebar } from './components/pricing-sidebar'
export { EditCollectionPage } from './components/edit-collection-page'
export { EditCollectionFormSection } from './components/edit-collection-form-section'
export { EditCollectionSidebar } from './components/edit-collection-sidebar'

// ============================================================================
// API Layer
// ============================================================================

export { CollectionsService } from './api/collections.service';
export type {
  CreateCollectionRequest,
  UpdateCollectionRequest,
  CollectionFilters,
} from './api/collections.service';

export {
  collectionsKeys,
  useCollections,
  useCollection,
  useCollectionStats,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
} from './api/collections.queries';

// ============================================================================
// Types
// ============================================================================

export type { Collection, ViewMode, CollectionStatus } from './types/collection.types'
