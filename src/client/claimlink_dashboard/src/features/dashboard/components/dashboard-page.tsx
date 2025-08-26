import { StatCard } from "./stat-card";
import { WelcomeCard } from "./welcome-card";
import { FeedCard } from "./feed-card";
import { MintCard } from "./mint-card";
import { CertificateListCard } from "./certificate-list-card";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
        "mx-auto max-w-[1158px] bg-[#fcfafa] rounded-[20px]",
        className,
      )}
    >
      {/* Stats Grid */}
      <div className="px-6 py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Minted Certificates"
            value="235"
            trend="56%"
            trendColor="green"
          />
          <StatCard
            title="Awaiting Certificates"
            value="235"
            trend="56%"
            trendColor="green"
          />
          <StatCard
            title="Certificate in my wallet"
            value="235"
            trend="11%"
            trendColor="red"
          />
          <StatCard
            title="Transferred Certificates"
            value="235"
            trend="56%"
            trendColor="green"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 flex gap-6">
        {/* Left Sidebar */}
        <div className="w-[346px] flex flex-col gap-6">
          <WelcomeCard />

          {/* Last Certificate Owners */}
          <Card className="shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] overflow-hidden">
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-[14px] text-[#222526] font-normal">
                    Last Certificate Owners
                  </CardTitle>
                  <CardDescription className="text-[13px] text-[#69737c]">
                    Last 7 days
                  </CardDescription>
                </div>
                <Button
                  variant="link"
                  className="text-[13px] text-[#615bff] hover:text-[#615bff]/80 p-0 h-auto"
                >
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {certificateOwners.map((owner, index) => (
                <FeedCard key={index} title={owner.title} />
              ))}
            </CardContent>
          </Card>

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
        <Card className="flex-1 shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]">
          <CardHeader className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-[14px] text-[#222526] font-normal">
                  Last minted Certificate
                </CardTitle>
                <CardDescription className="text-[13px] text-[#69737c]">
                  Last 30 days
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="link"
                  className="text-[13px] text-[#615bff] hover:text-[#615bff]/80 p-0 h-auto"
                >
                  View all
                </Button>
                <div className="bg-[#fcfafa] border border-[#e1e1e1] rounded-full p-1">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className="bg-[#061937] text-white rounded-[21.5px] px-1.5 py-1 text-[12px] h-auto hover:bg-[#061937]/90"
                    >
                      Grid
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-[#fcfafa] rounded-[21.5px] px-1.5 py-1 text-[12px] h-auto hover:bg-[#fcfafa]/80"
                    >
                      Line
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mintedCertificates.map((certificate, index) => (
                <MintCard
                  key={index}
                  title={certificate.title}
                  status={certificate.status}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
