import { createFileRoute } from "@tanstack/react-router";
import { HeaderBar } from "@/shared/components";
import { DashboardPage } from "@/features/dashboard";
import SideNav from "@/components/layout/Sidebar";

export const Route = createFileRoute("/")({
  component: App,
});

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
          <HeaderBar />
          <DashboardPage />
        </main>
      </div>
    </div>
  );
}
