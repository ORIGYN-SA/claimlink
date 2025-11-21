import type { BaseToken, TokenStatus } from "@/components/common/token-card";

// Certificate extends BaseToken to maintain compatibility while adding certificate-specific fields
export interface Certificate extends BaseToken {
  // Certificate-specific fields
  issuer?: string;
  verificationCode?: string;
  certifiedBy?: 'ORIGYN';
  integratorId?: string;
  campaignId?: string;
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

// Re-export TokenStatus for backward compatibility
export type CertificateStatus = TokenStatus;
