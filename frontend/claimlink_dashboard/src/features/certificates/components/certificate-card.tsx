import { TokenCard } from "@/components/common/token-card";
import type { CertificateCardProps } from "../types/certificate.types";

// CertificateCard now uses the shared TokenCard component
export function CertificateCard({ certificate, onClick }: CertificateCardProps) {
  return (
    <TokenCard
      token={certificate}
      showCertifiedBadge={true} // Certificates always show ORIGYN badge
      onClick={onClick}
    />
  );
}
