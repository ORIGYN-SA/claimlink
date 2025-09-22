import type { Collection } from '@/features/collections/types/collection.types';

// Mock collections data - shared across the application
export const mockCollections: Collection[] = [
  {
    id: "1",
    title: "Digital Art Collection",
    description: "A curated collection of digital artworks featuring various styles and mediums",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    itemCount: 25,
    status: "Active",
    createdDate: "20 Feb, 2024",
    lastModified: "25 Feb, 2024",
    creator: "Artist Studio"
  },
  {
    id: "2",
    title: "NFT Photography Series",
    description: "Professional photography collection showcasing urban landscapes and street art",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    itemCount: 15,
    status: "Active",
    createdDate: "18 Feb, 2024",
    lastModified: "22 Feb, 2024",
    creator: "Photo Studio"
  },
  {
    id: "3",
    title: "Abstract Generative Art",
    description: "Algorithmically generated abstract art pieces with unique patterns",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    itemCount: 8,
    status: "Draft",
    createdDate: "15 Feb, 2024",
    lastModified: "20 Feb, 2024",
    creator: "AI Artist"
  },
  {
    id: "4",
    title: "Music Festival Moments",
    description: "Captured moments from various music festivals around the world",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    itemCount: 32,
    status: "Active",
    createdDate: "10 Feb, 2024",
    lastModified: "18 Feb, 2024",
    creator: "Event Photography"
  },
  {
    id: "5",
    title: "Vintage Car Collection",
    description: "Rare vintage cars from the 1960s and 1970s, digitally restored",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    itemCount: 12,
    status: "Inactive",
    createdDate: "05 Feb, 2024",
    lastModified: "15 Feb, 2024",
    creator: "Auto Enthusiast"
  },
  {
    id: "6",
    title: "Nature Photography",
    description: "Stunning nature photography from national parks and wilderness areas",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    itemCount: 45,
    status: "Active",
    createdDate: "01 Feb, 2024",
    lastModified: "12 Feb, 2024",
    creator: "Nature Photographer"
  },
  {
    id: "7",
    title: "Urban Architecture",
    description: "Modern architectural designs and cityscapes from around the globe",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    itemCount: 28,
    status: "Active",
    createdDate: "28 Jan, 2024",
    lastModified: "08 Feb, 2024",
    creator: "Architecture Studio"
  },
  {
    id: "8",
    title: "Fantasy Art Gallery",
    description: "Imaginative fantasy artwork featuring mythical creatures and magical landscapes",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    itemCount: 20,
    status: "Draft",
    createdDate: "25 Jan, 2024",
    lastModified: "05 Feb, 2024",
    creator: "Fantasy Artist"
  }
];

// Helper functions for working with collections
export const getCollectionById = (id: string): Collection | undefined => {
  return mockCollections.find(collection => collection.id === id);
};

export const getCollectionsByStatus = (status: Collection['status']): Collection[] => {
  return mockCollections.filter(collection => collection.status === status);
};

export const getActiveCollections = (): Collection[] => {
  return getCollectionsByStatus('Active');
};
