export type CertificateStatus = 'Minted' | 'Transferred' | 'Waiting' | 'Burned';

export interface Certificate {
  id: string;
  title: string;
  collectionName: string;
  imageUrl: string;
  status: CertificateStatus;
  date: string;
  thumbnail?: string;
}

export interface CertificateGridProps {
  certificates?: Certificate[];
  isLoading?: boolean;
}

export interface CertificateCardProps {
  certificate: Certificate;
  onClick?: (certificate: Certificate) => void;
}

export interface AddCertificateCardProps {
  onClick?: () => void;
}
