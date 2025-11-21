import { useState } from "react";
import { CertificateTabs, type CertificateTab } from "./certificate-tabs";
import { CertificateDisplay } from "./certificate-display";
import {
  CertificateInformation,
  type CertificateInformationData,
} from "./certificate-information";
import {
  CertificateEvents,
  type CertificateEventsData,
} from "./certificate-events";
import {
  CertificateLedger,
  type CertificateLedgerData,
} from "./certificate-ledger";

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
  // Information tab data
  informationData?: CertificateInformationData;
  // Events tab data
  eventsData?: CertificateEventsData;
  // Ledger tab data
  ledgerData?: CertificateLedgerData;
  className?: string;
}

export function CertificateViewer(props: CertificateViewerProps) {
  const [activeTab, setActiveTab] = useState<CertificateTab>("certificate");

  const renderTabContent = () => {
    switch (activeTab) {
      case "certificate":
        return <CertificateDisplay {...props} />;
      case "informations":
        if (props.informationData) {
          return <CertificateInformation data={props.informationData} />;
        }
        return (
          <div className="bg-[#222526] px-16 py-10 rounded-bl-[24px] rounded-br-[24px] w-full min-h-[400px] flex items-center justify-center">
            <p className="text-[#e1e1e1] text-xl">No information data available</p>
          </div>
        );
      case "events":
        if (props.eventsData) {
          return <CertificateEvents data={props.eventsData} />;
        }
        return (
          <div className="bg-[#222526] px-16 py-10 rounded-bl-[24px] rounded-br-[24px] w-full min-h-[400px] flex items-center justify-center">
            <p className="text-[#e1e1e1] text-xl">No events data available</p>
          </div>
        );
      case "ledger":
        if (props.ledgerData) {
          return <CertificateLedger data={props.ledgerData} />;
        }
        return (
          <div className="bg-[#222526] px-16 py-10 rounded-bl-[24px] rounded-br-[24px] w-full min-h-[400px] flex items-center justify-center">
            <p className="text-[#e1e1e1] text-xl">No ledger data available</p>
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

