import { TokenGridView } from "@/components/common/token-grid-view";
import type { Certificate } from "../types/certificate.types";

interface CertificateGridViewProps {
  certificates: Certificate[];
  onCertificateClick: (certificate: Certificate) => void;
  onAddCertificate: () => void;
}

// CertificateGridView now uses the shared TokenGridView component
export function CertificateGridView({
  certificates,
  onCertificateClick,
  onAddCertificate
}: CertificateGridViewProps) {
  return (
    <TokenGridView
      tokens={certificates}
      showCertifiedBadge={true} // Certificates show ORIGYN badge
      onTokenClick={onCertificateClick}
      onAddToken={onAddCertificate}
      addButtonText="Create a certificate"
      addButtonDescription="Create a campaign to distribute your NFTs via claim links"
    />
  );
}
