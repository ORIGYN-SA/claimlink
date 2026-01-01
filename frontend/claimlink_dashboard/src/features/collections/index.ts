// ============================================================================
// Pages (Entry Points)
// ============================================================================

export { CollectionsPage } from './pages/collections-page'
export { CollectionDetailPage } from './pages/collection-detail-page'
export { NewCollectionPage } from './pages/new-collection-page'
export { EditCollectionPage } from './pages/edit-collection-page'

// ============================================================================
// Components
// ============================================================================

export { CollectionCard } from './components/collection-card'
export { AddCollectionCard } from './components/add-collection-card'
export { CollectionStatusBadge } from './components/collection-status-badge'

// Form components
export {
  CollectionFormSection,
  EditCollectionFormSection,
  EditCollectionSidebar,
  PricingSidebar,
} from './components/form'

// ============================================================================
// API Layer
// ============================================================================

export { CollectionsService } from './api/collections.service';

export {
  collectionKeys,
  useListMyCollections,
  useListAllCollections,
  useFetchCollectionInfo,
  useCollectionNfts,
  useAllUserNfts,
  useCreateCollection,
  useCollectionTemplate,
  useSetCollectionTemplate,
} from './api/collections.queries';

export * from './api/transformers';

// ============================================================================
// Types
// ============================================================================

export type { Collection, ViewMode, CollectionStatus } from './types/collection.types'
