export type CertificateTab = "certificate" | "informations" | "events" | "ledger";

interface CertificateTabsProps {
  activeTab: CertificateTab;
  onTabChange: (tab: CertificateTab) => void;
}

export function CertificateTabs({ activeTab, onTabChange }: CertificateTabsProps) {
  const tabs: { id: CertificateTab; label: string }[] = [
    { id: "certificate", label: "Certificate" },
    { id: "informations", label: "Informations" },
    { id: "events", label: "Events" },
    { id: "ledger", label: "Ledger" },
  ];

  return (
    <div className="bg-[#222526] flex gap-16 items-center justify-center pt-10 pb-0 px-0 rounded-tl-[24px] rounded-tr-[24px] w-full">
      <nav className="bg-[#2e3233] border border-[#434849] rounded-full p-1 flex gap-1 items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                px-4 py-4 rounded-full flex items-center justify-center gap-2.5
                text-[14px] font-medium leading-[23px] tracking-[0.7px] uppercase whitespace-nowrap
                transition-colors
                ${
                  isActive
                    ? "bg-[#fcfafa] text-[#061937]"
                    : "bg-transparent text-[#e1e1e1] hover:text-white font-light"
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

