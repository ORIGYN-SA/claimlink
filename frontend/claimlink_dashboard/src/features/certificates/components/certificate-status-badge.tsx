import { TokenStatusBadge } from "@/components/common/token-status-badge";
import type { CertificateStatus } from "../types/certificate.types";

interface CertificateStatusBadgeProps {
  status: CertificateStatus;
  className?: string;
}

// CertificateStatusBadge now uses the shared TokenStatusBadge component
export function CertificateStatusBadge({ status, className }: CertificateStatusBadgeProps) {
  return (
    <TokenStatusBadge status={status} className={className} />
  );
}
