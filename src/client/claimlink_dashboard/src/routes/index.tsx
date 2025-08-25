import { createFileRoute } from "@tanstack/react-router";
import SideNav from "@shared/app-layout/sidebar";

export const Route = createFileRoute("/")({
  component: App,
});

function StatCard({
  title,
  value,
  trend,
  trendColor,
}: {
  title: string;
  value: string;
  trend: string;
  trendColor: "green" | "red";
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#f2f2f2] shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]">
      <div className="text-[14px] text-[#000]">{title}</div>
      <div className="mt-2 flex items-center gap-2">
        <div className="text-[48px] leading-[56px] text-[#222526]">{value}</div>
        <div
          className={
            trendColor === "green"
              ? "bg-[#50be8f] text-white border border-[#50be8f]"
              : "bg-[#e84c25] text-white"
          }
        >
          <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-1 text-[10px] leading-none">
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}

function WelcomeCard() {
  return (
    <div className="rounded-2xl p-8 shadow-[0_2px_4px_0_rgba(0,0,0,0.15),0_2px_4px_0_rgba(0,0,0,0.05)] bg-[radial-gradient(120%_120%_at_0%_0%,#061937_0%,#0b2d6a_60%,#1e3a8a_100%)] text-white">
      <div>
        <span className="uppercase tracking-[1px] text-[10px] text-[#061937] bg-[#85f1ff] rounded-full px-2 py-1 inline-block mb-4">
          welcome back
        </span>
      </div>
      <h3 className="text-[40px] leading-[48px]">What do you want to mint?</h3>
      <p className="text-[16px] leading-6 opacity-80 mt-2">
        Today is a good day to mint some great stuff.
      </p>
      <div className="mt-6">
        <button className="bg-white text-[#222526] h-14 px-6 rounded-[20px] shadow-[0_4px_24px_0_rgba(0,0,0,0.15)] flex items-center gap-3">
          <span className="text-[14px]">NFT</span>
          <span className="inline-block h-8 w-8 rounded-full bg-[#061937]" />
        </button>
      </div>
    </div>
  );
}

function SearchPill({ placeholder }: { placeholder: string }) {
  return (
    <div className="bg-white rounded-full px-4 py-3 border border-[#e1e1e1] flex items-center justify-between text-[13px] text-[#69737c]">
      <span>{placeholder}</span>
      <span className="h-4 w-4 rounded" />
    </div>
  );
}

function FeedCard({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="relative">
        <div className="h-10 w-10 rounded-lg bg-[#061937]" />
        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white" />
      </div>
      <div>
        <div className="text-[16px] leading-6 text-[#061937]">{title}</div>
        <div className="text-[13px] text-[#69737c] leading-none">
          65d32901f244eeb354d4b2df
        </div>
      </div>
    </div>
  );
}

function MintCard({
  title,
  status,
}: {
  title: string;
  status: "Minted" | "Transferred" | "Waiting";
}) {
  const chip =
    status === "Minted"
      ? { dot: "#50be8f", bg: "#c7f2e0" }
      : status === "Transferred"
        ? { dot: "#615bff", bg: "#ddddff" }
        : { dot: "#e84c25", bg: "#ffcec2" };

  return (
    <div className="bg-white rounded-2xl p-3 border border-[#e8e8e8]">
      <div className="h-[201px] rounded-lg bg-[#060606]" />
      <div className="px-1 pt-1 pb-2">
        <div className="text-[18px] text-[#222526] leading-6">{title}</div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-[13px] text-[#69737c]">20 Feb, 2024</div>
          <div className="bg-white rounded-full px-2 py-1 flex items-center gap-2 border border-[#e1e1e1]">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: chip.dot }}
            />
            <span className="text-[12px] text-[#222526]">{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderBar() {
  return (
    <div className="flex items-center justify-between px-6 py-0">
      <h1 className="text-[24px] leading-8 text-[#222526]">Dashboard</h1>
      <div className="flex items-center gap-2">
        <button className="bg-white h-[47px] rounded-full px-4 flex items-center gap-2 border border-[#e1e1e1]">
          <span className="h-4 w-4 rounded bg-[#061937]" />
          <span className="text-[14px] text-[#061937]">1’256</span>
          <span className="text-[14px] text-[#69737c] tracking-[0.7px]">
            OGY
          </span>
        </button>
        <button className="bg-white h-[47px] rounded-full pl-1 pr-4 flex items-center gap-2 border border-[#e1e1e1]">
          <span className="h-10 w-10 rounded-full bg-[#061937]" />
          <span className="text-[14px] text-[#061937]">My Account:</span>
          <span className="text-[14px] text-[#69737c] tracking-[0.7px]">
            55vo...3dfa
          </span>
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-[#fcfafa]">
      <div className="flex">
        <div className="w-[250px] bg-transparent">
          <div className="sticky top-0 h-screen p-0">
            <SideNav />
          </div>
        </div>
        <main className="flex-1 px-0 py-3">
          <div className="mx-auto max-w-[1158px] bg-[#fcfafa] rounded-[20px]">
            <HeaderBar />

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

            <div className="px-6 py-6 flex gap-6">
              <div className="w-[346px] flex flex-col gap-6">
                <WelcomeCard />

                <section className="rounded-2xl border border-[#f2f2f2] overflow-hidden shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] bg-white">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[14px] text-[#222526]">
                          Last Certicate Owners
                        </div>
                        <div className="text-[13px] text-[#69737c]">
                          Last 7 days
                        </div>
                      </div>
                      <button className="text-[13px] text-[#615bff]">
                        View all
                      </button>
                    </div>
                    <div className="mt-2">
                      <SearchPill placeholder="Search for an item" />
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <FeedCard title="John Doe" />
                    <FeedCard title="John Doe" />
                    <FeedCard title="John Doe" />
                  </div>
                </section>

                <section className="rounded-2xl border border-[#f2f2f2] overflow-hidden shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] bg-white">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[14px] text-[#222526]">
                          Last Sent certificates
                        </div>
                        <div className="text-[13px] text-[#69737c]">
                          Last 7 days
                        </div>
                      </div>
                      <button className="text-[13px] text-[#615bff]">
                        View all
                      </button>
                    </div>
                    <div className="mt-2">
                      <SearchPill placeholder="Search for an item" />
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="py-2">
                      <div className="flex items-center gap-4 p-2">
                        <div className="h-20 w-20 rounded-2xl bg-center bg-cover bg-no-repeat bg-[#eee]" />
                        <div className="flex-1">
                          <div className="text-[16px] text-[#061937]">
                            The midsummer Night Dream
                          </div>
                          <div className="flex items-center gap-2 text-[13px] text-[#69737c]">
                            20 Feb, 2024
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <div className="flex items-center gap-4 p-2">
                        <div className="h-20 w-20 rounded-2xl bg-center bg-cover bg-no-repeat bg-[#eee]" />
                        <div className="flex-1">
                          <div className="text-[16px] text-[#061937]">
                            Night Dream
                          </div>
                          <div className="flex items-center gap-2 text-[13px] text-[#69737c]">
                            20 Feb, 2024
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <section className="flex-1 bg-white rounded-2xl p-4 border border-[#f2f2f2] shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[14px] text-[#222526]">
                      Last minted Certificate
                    </div>
                    <div className="text-[13px] text-[#69737c]">
                      Last 30 days
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-[13px] text-[#615bff]">
                      View all
                    </button>
                    <div className="bg-[#fcfafa] border border-[#e1e1e1] rounded-full p-1">
                      <div className="flex gap-1">
                        <button className="bg-[#061937] text-white rounded-[21.5px] px-1.5 py-1 text-[12px]">
                          Grid
                        </button>
                        <button className="bg-[#fcfafa] rounded-[21.5px] px-1.5 py-1 text-[12px]">
                          Line
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <MintCard
                    title="The midsummer Night Dream"
                    status="Waiting"
                  />
                  <MintCard
                    title="The midsummer Night Dream"
                    status="Transferred"
                  />
                  <MintCard title="The midsummer Night Dream" status="Minted" />
                  <MintCard title="Night Dream" status="Minted" />
                  <MintCard title="Fratelli" status="Transferred" />
                  <MintCard title="The midsummer" status="Waiting" />
                  <MintCard
                    title="The midsummer Night Dream"
                    status="Waiting"
                  />
                  <MintCard
                    title="The midsummer Night Dream"
                    status="Waiting"
                  />
                  <MintCard title="The midsummer Night Dream" status="Minted" />
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
