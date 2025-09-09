import type { BaseToken, TokenStatus } from "@/components/common/token-card";

export interface NFT extends BaseToken {
  // NFT-specific fields
  creator: string; // Principal ID of creator
  edition?: number;
  rarity?: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  series?: string;
  attributes?: Record<string, string | number>;
  // IC-specific fields
  canisterId?: string;
  tokenId?: string;
}

export interface NFTCardProps {
  nft: NFT;
  onClick?: (nft: NFT) => void;
  showCreator?: boolean;
  className?: string;
}

export interface NFTGridProps {
  nfts?: NFT[];
  isLoading?: boolean;
}

export interface NFTListProps {
  nfts?: NFT[];
  isLoading?: boolean;
}

export interface NFTMintData {
  title: string;
  description: string;
  collectionId: string;
  imageUrl: string;
  attributes?: Record<string, string | number>;
  royaltyPercentage?: number;
}
