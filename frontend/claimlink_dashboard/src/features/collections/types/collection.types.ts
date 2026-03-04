/**
 * Backend collection status - represents the actual state of the collection
 * in the IC canister lifecycle.
 *
 * Flow: Queued → Created → Installed → TemplateUploaded
 *       Failed states: Failed → ReimbursingQueued → QuarantinedReimbursement → Reimbursed
 */
export type BackendCollectionStatus =
  | 'Queued'
  | 'Created'
  | 'Installed'
  | 'TemplateUploaded'
  | 'Failed'
  | 'ReimbursingQueued'
  | 'QuarantinedReimbursement'
  | 'Reimbursed';

/**
 * Simplified status for filtering and high-level display
 */
export type SimpleCollectionStatus = 'Active' | 'Inactive' | 'Draft';

export interface Collection {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  itemCount: number;
  /** Simplified status for filtering */
  status: SimpleCollectionStatus;
  /** Raw backend status for detailed display */
  backendStatus: BackendCollectionStatus;
  createdDate: string;
  lastModified: string;
  creator: string;
}

export type ViewMode = 'grid' | 'list';

export type CollectionStatus = 'all' | 'Active' | 'Inactive' | 'Draft';
