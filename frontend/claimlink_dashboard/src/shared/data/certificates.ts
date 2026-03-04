import type { Certificate } from "@/features/certificates";
import type { Collection } from "@/features/collections/types/collection.types";

// Mock certificates data - shared across the application
export const mockCertificates: Certificate[] = [
  {
    id: "1",
    title: "The midsummer Night Dream",
    collectionName: "Digital Art Collection",
    imageUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    status: "Minted",
    date: "20 Feb, 2024",
  },
  {
    id: "2",
    title: "Urban Landscape Series #1",
    collectionName: "NFT Photography Series",
    imageUrl:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop",
    status: "Transferred",
    date: "19 Feb, 2024",
  },
  {
    id: "3",
    title: "Abstract Generative Pattern",
    collectionName: "Abstract Generative Art",
    imageUrl:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
    status: "Waiting",
    date: "18 Feb, 2024",
  },
  {
    id: "4",
    title: "Summer Music Festival",
    collectionName: "Music Festival Moments",
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    status: "Waiting",
    date: "17 Feb, 2024",
  },
  {
    id: "5",
    title: "Vintage Car Restoration",
    collectionName: "Vintage Car Collection",
    imageUrl:
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=400&fit=crop",
    status: "Waiting",
    date: "16 Feb, 2024",
  },
  {
    id: "6",
    title: "Mountain Wilderness",
    collectionName: "Nature Photography",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    status: "Minted",
    date: "15 Feb, 2024",
  },
  {
    id: "7",
    title: "Modern Architecture Design",
    collectionName: "Urban Architecture",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop",
    status: "Minted",
    date: "14 Feb, 2024",
  },
  {
    id: "8",
    title: "Fantasy Character Portrait",
    collectionName: "Fantasy Art Gallery",
    imageUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    status: "Minted",
    date: "13 Feb, 2024",
  },
  {
    id: "9",
    title: "Digital Art Masterpiece",
    collectionName: "Digital Art Collection",
    imageUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    status: "Minted",
    date: "12 Feb, 2024",
  },
  {
    id: "10",
    title: "Street Photography Moment",
    collectionName: "NFT Photography Series",
    imageUrl:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop",
    status: "Transferred",
    date: "11 Feb, 2024",
  },
  {
    id: "11",
    title: "Geometric Art Pattern",
    collectionName: "Abstract Generative Art",
    imageUrl:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
    status: "Transferred",
    date: "10 Feb, 2024",
  },
  {
    id: "12",
    title: "Concert Crowd Energy",
    collectionName: "Music Festival Moments",
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    status: "Minted",
    date: "09 Feb, 2024",
  },
  {
    id: "13",
    title: "Classic Car Detail",
    collectionName: "Vintage Car Collection",
    imageUrl:
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=400&fit=crop",
    status: "Waiting",
    date: "08 Feb, 2024",
  },
  {
    id: "14",
    title: "Forest Path",
    collectionName: "Nature Photography",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    status: "Minted",
    date: "07 Feb, 2024",
  },
  {
    id: "15",
    title: "Skyscraper Silhouette",
    collectionName: "Urban Architecture",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop",
    status: "Minted",
    date: "06 Feb, 2024",
  },
  {
    id: "16",
    title: "Mythical Creature Study",
    collectionName: "Fantasy Art Gallery",
    imageUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    status: "Burned",
    date: "05 Feb, 2024",
  },
];

// Helper functions for working with certificates
export const getCertificateById = (id: string): Certificate | undefined => {
  return mockCertificates.find((certificate) => certificate.id === id);
};

export const getCertificatesByCollection = (
  collectionName: string,
): Certificate[] => {
  return mockCertificates.filter(
    (certificate) => certificate.collectionName === collectionName,
  );
};

export const getCertificatesByStatus = (
  status: Certificate["status"],
): Certificate[] => {
  return mockCertificates.filter(
    (certificate) => certificate.status === status,
  );
};

export const getMintedCertificates = (): Certificate[] => {
  return getCertificatesByStatus("Minted");
};

export const getCertificatesForCollection = (
  collectionId: string,
  mockCollections: Collection[],
): Certificate[] => {
  // Find the collection by ID to get its name
  const collection = mockCollections.find((col) => col.id === collectionId);
  if (!collection) return [];

  // Return certificates that belong to this collection
  return getCertificatesByCollection(collection.title);
};
