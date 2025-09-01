import { StatCard } from "./stat-card";
import { WelcomeCard } from "./welcome-card";
import { FeedCard } from "./feed-card";
import { MintCard } from "./mint-card";
import { CertificateListCard } from "./certificate-list-card";
import { 
  MintedCertificatesIcon, 
  AwaitingCertificatesIcon, 
  WalletCertificatesIcon, 
  TransferredCertificatesIcon,
  SearchIcon,
  GridIcon,
  LineIcon
} from "./icons";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardPageProps {
  className?: string;
}

export function DashboardPage({ className }: DashboardPageProps) {
  const certificateOwners = [
    { title: "John Doe", date: "20 Feb, 2024" },
    { title: "Jane Smith", date: "19 Feb, 2024" },
    { title: "Bob Johnson", date: "18 Feb, 2024" },
  ];

  const sentCertificates = [
    { title: "The midsummer Night Dream", date: "20 Feb, 2024" },
    { title: "Night Dream", date: "19 Feb, 2024" },
  ];

  const mintedCertificates = [
    { title: "The midsummer Night Dream", status: "Waiting" as const },
    { title: "The midsummer Night Dream", status: "Transferred" as const },
    { title: "The midsummer Night Dream", status: "Minted" as const },
    { title: "Night Dream", status: "Minted" as const },
    { title: "Fratelli", status: "Transferred" as const },
    { title: "The midsummer", status: "Waiting" as const },
    { title: "The midsummer Night Dream", status: "Waiting" as const },
    { title: "The midsummer Night Dream", status: "Waiting" as const },
    { title: "The midsummer Night Dream", status: "Minted" as const },
  ];

  return (
    <div
      className={cn(
        "bg-[#fcfafa] rounded-[20px] flex flex-col items-start justify-start py-6 px-0 w-full max-w-none",
        className,
      )}
    >
      {/* Header - Using existing HeaderBar component */}

      {/* Stats Section */}
      <div className="flex flex-col gap-4 items-start justify-start p-6 w-full">
        <Card className="bg-white border border-[#f2f2f2] rounded-2xl shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] p-4 w-full">
          <div className="font-['General_Sans'] font-medium text-black text-sm leading-4 mb-4">
            Total certificate status
          </div>
          <div className="flex gap-4 items-start justify-start shadow-[0_3px_4px_0_rgba(0,0,0,0.05)] w-full">
            <StatCard
              title="Minted Certificates"
              value="235"
              trend="56%"
              trendColor="green"
              icon={<MintedCertificatesIcon />}
              className="flex-1"
            />
            <StatCard
              title="Awaiting Certificates"
              value="235"
              trend="56%"
              trendColor="green"
              icon={<AwaitingCertificatesIcon />}
              className="flex-1"
            />
            <StatCard
              title="Certificate in my wallet"
              value="235"
              trend="11%"
              trendColor="red"
              icon={<WalletCertificatesIcon />}
              className="flex-1"
            />
            <StatCard
              title="Transferred Certificates"
              value="235"
              trend="56%"
              trendColor="green"
              icon={<TransferredCertificatesIcon />}
              className="flex-1"
            />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 items-start justify-start px-6 py-0 w-full flex-1 min-w-0">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-6 items-start justify-start w-[346px] flex-shrink-0">
          <WelcomeCard />

          {/* Last Certificate Owners */}
          <div className="flex flex-col shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]">
            <Card className="bg-white border-[#f2f2f2] border-t border-l border-r border-b-0 rounded-t-2xl rounded-b-none p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex flex-col gap-1">
                  <div className="font-['General_Sans'] font-medium text-[#222526] text-sm leading-4">
                    Last Certificate Owners
                  </div>
                  <div className="font-['General_Sans'] font-normal text-[#69737c] text-[13px] leading-normal">
                    Last 7 days
                  </div>
                </div>
                <button className="font-['General_Sans'] font-medium text-[#615bff] text-[13px] leading-normal pb-1">
                  View all
                </button>
              </div>
              <div className="bg-white border border-[#e1e1e1] rounded-full px-4 py-3 flex items-center justify-between">
                <span className="font-['General_Sans'] font-light text-[#69737c] text-[13px] leading-normal">
                  Search for an item
                </span>
                <div className="w-4 h-4">
                  <SearchIcon />
                </div>
              </div>
            </Card>
            <div className="bg-white border-[#f2f2f2] border-l border-r border-b rounded-bl-2xl rounded-br-2xl px-4 pb-4">
              {certificateOwners.map((owner, index) => (
                <FeedCard key={index} title={owner.title} />
              ))}
            </div>
          </div>

          {/* Last Sent Certificates */}
          <CertificateListCard
            title="Last Sent certificates"
            subtitle="Last 7 days"
            items={sentCertificates}
            searchPlaceholder="Search for an item"
            onViewAll={() => console.log("View all sent certificates")}
          />
        </div>

        {/* Main Content Area */}
        <Card className="bg-white border border-[#f2f2f2] rounded-2xl shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] p-4 flex-1 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col gap-1">
              <div className="font-['General_Sans'] font-medium text-[#222526] text-sm leading-4">
                Last minted Certificate
              </div>
              <div className="font-['General_Sans'] font-normal text-[#69737c] text-[13px] leading-normal">
                Last 30 days
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button className="font-['General_Sans'] font-medium text-[#615bff] text-[13px] leading-normal pb-1">
                View all
              </button>
              <div className="bg-[#fcfafa] border border-[#e1e1e1] rounded-full p-1 flex gap-0.5">
                <div className="bg-[#061937] rounded-[21.5px] p-1 flex items-center justify-center gap-2.5">
                  <div className="w-4 h-4 text-white">
                    <GridIcon />
                  </div>
                </div>
                <div className="bg-[#fcfafa] rounded-[21.5px] p-1 flex items-center justify-center gap-2.5">
                  <div className="w-4 h-4 text-[#69737c]">
                    <LineIcon />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {/* First Row */}
            <div className="flex gap-4 items-start justify-start w-full">
              <MintCard
                title={mintedCertificates[0]?.title}
                status={mintedCertificates[0]?.status}
                className="basis-0 grow min-w-0"
              />
              <MintCard
                title={mintedCertificates[1]?.title}
                status={mintedCertificates[1]?.status}
                className="basis-0 grow min-w-0"
              />
              <MintCard
                title={mintedCertificates[2]?.title}
                status={mintedCertificates[2]?.status}
                className="basis-0 grow min-w-0"
              />
            </div>
            {/* Second Row */}
            <div className="flex gap-4 items-start justify-start w-full">
              <MintCard
                title={mintedCertificates[3]?.title}
                status={mintedCertificates[3]?.status}
                className="basis-0 grow min-w-0"
              />
              <MintCard
                title={mintedCertificates[4]?.title}
                status={mintedCertificates[4]?.status}
                className="basis-0 grow min-w-0"
              />
              <MintCard
                title={mintedCertificates[5]?.title}
                status={mintedCertificates[5]?.status}
                className="basis-0 grow min-w-0"
              />
            </div>
            {/* Third Row */}
            <div className="flex gap-4 items-start justify-start w-full">
              <MintCard
                title={mintedCertificates[6]?.title}
                status={mintedCertificates[6]?.status}
                className="basis-0 grow min-w-0"
              />
              <MintCard
                title={mintedCertificates[7]?.title}
                status={mintedCertificates[7]?.status}
                className="basis-0 grow min-w-0"
              />
              <MintCard
                title={mintedCertificates[8]?.title}
                status={mintedCertificates[8]?.status}
                className="basis-0 grow min-w-0"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
