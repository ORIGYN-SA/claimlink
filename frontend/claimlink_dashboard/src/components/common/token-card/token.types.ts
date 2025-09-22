export type TokenStatus = 'Minted' | 'Transferred' | 'Waiting' | 'Burned';

export interface BaseToken {
  id: string;
  title: string;
  collectionName: string;
  imageUrl: string;
  status: TokenStatus;
  date: string;
  thumbnail?: string;
}

export interface TokenCardProps {
  token: BaseToken;
  showCertifiedBadge?: boolean;
  onClick?: (token: BaseToken) => void;
  className?: string;
}
