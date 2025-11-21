export interface Collection {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  itemCount: number;
  status: 'Active' | 'Inactive' | 'Draft';
  createdDate: string;
  lastModified: string;
  creator: string;
}

export type ViewMode = 'grid' | 'list';

export type CollectionStatus = 'all' | 'Active' | 'Inactive' | 'Draft';
