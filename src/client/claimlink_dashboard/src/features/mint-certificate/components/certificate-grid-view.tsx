import { CertificateCard } from "./certificate-card";
import { AddCertificateCard } from "./add-certificate-card";
import type { Certificate } from "../types/certificate.types";

interface CertificateGridViewProps {
  certificates: Certificate[];
  onCertificateClick: (certificate: Certificate) => void;
  onAddCertificate: () => void;
}

export function CertificateGridView({
  certificates,
  onCertificateClick,
  onAddCertificate
}: CertificateGridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* Add Certificate Card - always first */}
      <AddCertificateCard onClick={onAddCertificate} />

      {/* Certificate Cards */}
      {certificates.map((certificate) => (
        <CertificateCard
          key={certificate.id}
          certificate={certificate}
          onClick={onCertificateClick}
        />
      ))}
    </div>
  );
}
