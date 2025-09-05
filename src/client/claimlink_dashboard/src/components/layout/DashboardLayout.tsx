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
    if (pathname === '/collections/new') return 'Create Collection';
    if (pathname.startsWith('/templates')) return 'Templates';
    if (pathname.startsWith('/collections')) return 'Collections';
    if (pathname.startsWith('/mint_certificate')) return 'Mint Certificate';
    if (pathname.startsWith('/mint_nft')) return 'Mint NFT';
    if (pathname.startsWith('/account')) return 'Account';
    if (pathname.startsWith('/create_certificate')) return 'Create Certificate';
    return 'Dashboard';
  };

  // Determine if back button should be shown and where to navigate
  const getBackNavigation = (pathname: string) => {
    if (pathname.startsWith('/create_certificate')) {
      return { showBackButton: true, backTo: '/mint_certificate' };
    }
    return { showBackButton: false, backTo: undefined };
  };

  const { showBackButton, backTo } = getBackNavigation(location.pathname);

  return (
    <div className="min-h-screen bg-[#222526] relative">
      {/* Blur background overlay */}
      <div className="absolute backdrop-blur-[100px] backdrop-filter bg-[rgba(19,19,19,0.4)] h-full w-full" />
      <div className="relative flex">
        <div className="w-[250px]">
          <div className="sticky top-0 h-screen p-0">
            <Sidebar />
          </div>
        </div>
        <main className="flex-1 px-6 py-6 min-w-0">
          <div className="bg-[#fcfafa] rounded-[20px] p-[24px] w-full max-w-none">
            <HeaderBar
              title={getPageTitle(location.pathname)}
              showBackButton={showBackButton}
              backTo={backTo}
            />
            <div className="mt-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
