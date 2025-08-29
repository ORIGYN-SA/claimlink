import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CertificateStatusBadge } from "./certificate-status-badge";
import type { Certificate } from "../types/certificate.types";

interface CertificateListViewProps {
  certificates: Certificate[];
  onCertificateClick: (certificate: Certificate) => void;
  onAddCertificate: () => void;
}

export function CertificateListView({
  certificates,
  onCertificateClick,
  onAddCertificate
}: CertificateListViewProps) {
  return (
    <Card className="bg-white border border-[#e1e1e1] rounded-[25px] overflow-hidden shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)]">
      {/* Table Header */}
      <div className="bg-[#222526] border-b border-[#e1e1e1] px-6 py-4">
        <div className="grid grid-cols-[50px_100px_1fr_1fr_150px_150px_40px] gap-4 items-center">
          <div className="text-[13px] font-medium text-white">Ref</div>
          <div className="text-[13px] font-medium text-white">Date</div>
          <div className="text-[13px] font-medium text-white">Name</div>
          <div className="text-[13px] font-medium text-white">Collection</div>
          <div className="text-[13px] font-medium text-white">Token ID</div>
          <div className="text-[13px] font-medium text-white">Status</div>
          <div className="flex justify-center">
            {/* More actions header - empty for now */}
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-[#e1e1e1]">
        {certificates.map((certificate, index) => (
          <div
            key={certificate.id}
            className="px-6 py-4 hover:bg-[#f9f9f9] cursor-pointer transition-colors"
            onClick={() => onCertificateClick(certificate)}
          >
            <div className="grid grid-cols-[50px_100px_1fr_1fr_150px_150px_40px] gap-4 items-center">
              {/* Reference Number */}
              <div className="text-[14px] font-normal text-[#69737c]">
                #{String(index + 1).padStart(3, '0')}
              </div>

              {/* Date */}
              <div className="text-[14px] font-normal text-[#69737c]">
                {certificate.date}
              </div>

              {/* Name with Image */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-[16px] overflow-hidden bg-[#f0f0f0] flex-shrink-0">
                  <img
                    src={certificate.imageUrl}
                    alt={certificate.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] font-medium text-[#222526] truncate">
                    {certificate.title}
                  </div>
                </div>
              </div>

              {/* Collection */}
              <div className="text-[14px] font-medium text-[#69737c] truncate">
                {certificate.collectionName}
              </div>

              {/* Token ID */}
              <div className="text-[14px] font-normal text-[#69737c] font-mono">
                {certificate.id.length > 12
                  ? `${certificate.id.slice(0, 12)}...`
                  : certificate.id
                }
              </div>

              {/* Status */}
              <div className="flex items-center">
                <CertificateStatusBadge status={certificate.status} />
              </div>

              {/* More Actions */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-full hover:bg-[#f0f0f0]"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle more actions
                    console.log('More actions for certificate:', certificate.id);
                  }}
                >
                  <MoreHorizontal className="w-4 h-4 text-[#69737c]" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {certificates.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="text-[#69737c] text-[14px]">
            No certificates found.{' '}
            <button
              onClick={onAddCertificate}
              className="text-[#061937] font-medium hover:underline"
            >
              Add your first certificate
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
