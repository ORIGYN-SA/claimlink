import { AddTokenCard } from "@/components/common/add-token-card";
import type { AddCertificateCardProps } from "../types/certificate.types";

// AddCertificateCard now uses the shared AddTokenCard component
export function AddCertificateCard({ onClick }: AddCertificateCardProps) {
  return (
    <AddTokenCard
      onClick={onClick}
      title="Add a certificate"
      description="Create a campaign to distribute your NFTs via claim links"
    />
  );
}
