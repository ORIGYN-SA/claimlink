import { useState } from "react";
import { CertificateTabs, type CertificateTab } from "./certificate-tabs";
import { CertificateDisplay } from "./certificate-display";

interface CertificateViewerProps {
  // Certificate data props
  companyLogo: string;
  tokenId: string;
  certificateTitle: string;
  companyName: string;
  certifiedBy: string;
  validUntil: string;
  vatNumber: string;
  signatureImage: string;
  signerName: string;
  signerTitle: string;
  stampContent?: React.ReactNode;
  className?: string;
}

export function CertificateViewer(props: CertificateViewerProps) {
  const [activeTab, setActiveTab] = useState<CertificateTab>("certificate");

  const renderTabContent = () => {
    switch (activeTab) {
      case "certificate":
        return <CertificateDisplay {...props} />;
      case "informations":
        return (
          <div className="bg-[#222526] px-16 py-10 rounded-bl-4 rounded-br-4 w-full min-h-[400px] flex items-center justify-center">
            <p className="text-[#e1e1e1] text-xl">Informations content coming soon</p>
          </div>
        );
      case "events":
        return (
          <div className="bg-[#222526] px-16 py-10 rounded-bl-4 rounded-br-4 w-full min-h-[400px] flex items-center justify-center">
            <p className="text-[#e1e1e1] text-xl">Events content coming soon</p>
          </div>
        );
      case "ledger":
        return (
          <div className="bg-[#222526] px-16 py-10 rounded-bl-4 rounded-br-4 w-full min-h-[400px] flex items-center justify-center">
            <p className="text-[#e1e1e1] text-xl">Ledger content coming soon</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`w-full ${props.className || ""}`}>
      <CertificateTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {renderTabContent()}
    </div>
  );
}

