import { HeaderBar } from "@/components/layout";
import { Sidebar } from "@/components/layout";
import { useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  
  // Map route paths to page titles
  const getPageTitle = (pathname: string): string => {
    if (pathname === '/') return 'Dashboard';
    if (pathname.startsWith('/templates')) return 'Templates';
    if (pathname.startsWith('/collections')) return 'Collections';
    if (pathname.startsWith('/mint_certificate')) return 'Mint Certificate';
    if (pathname.startsWith('/mint_nft')) return 'Mint NFT';
    if (pathname.startsWith('/account')) return 'Account';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-[#fcfafa]">
      <div className="flex">
        <div className="w-[250px] bg-transparent">
          <div className="sticky top-0 h-screen p-0">
            <Sidebar />
          </div>
        </div>
        <main className="flex-1 px-0 py-3">
          <HeaderBar title={getPageTitle(location.pathname)} />
          {children}
        </main>
      </div>
    </div>
  );
}
