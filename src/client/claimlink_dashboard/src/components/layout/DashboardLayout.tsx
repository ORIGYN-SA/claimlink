import { HeaderBar } from "@/components/layout";
import { Sidebar } from "@/components/layout";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fcfafa]">
      <div className="flex">
        <div className="w-[250px] bg-transparent">
          <div className="sticky top-0 h-screen p-0">
            <Sidebar />
          </div>
        </div>
        <main className="flex-1 px-0 py-3">
          <HeaderBar />
          {children}
        </main>
      </div>
    </div>
  );
}
