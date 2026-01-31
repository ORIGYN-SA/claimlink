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
    if (pathname.startsWith('/templates/new')) return 'New Template';
    if (pathname.startsWith('/collections')) return 'Collections';
    if (pathname.startsWith('/mint_certificate')) return 'Mint Certificate';
    if (pathname.startsWith('/mint_nft')) return 'NFTs';
    if (pathname.startsWith('/account/new')) return 'Create user';
    if (pathname.startsWith('/account/edit_company')) return 'Edit company information';
    if (pathname.startsWith('/account/edit_user')) return 'Edit profile';
    if (pathname.startsWith('/account')) return 'Account';
    if (pathname.startsWith('/create_certificate')) return 'Create Certificate';
    return 'Dashboard';
  };

  // Map route paths to page subtitles
  const getPageSubtitle = (pathname: string): string | undefined => {
    if (pathname.startsWith('/mint_nft')) return "You can manage your organization's collections that hosts your certificates";
    if (pathname.startsWith('/account/new')) return "Create and manage your organization's user roles and permissions";
    if (pathname.startsWith('/account/edit_company')) return "Create and manage your organization's user roles and permissions";
    if (pathname.startsWith('/account/edit_user')) return "Create and manage your organization's user roles and permissions";
    if (pathname.startsWith('/templates/new')) return "Create a new certificate template in 3 simple steps";
    return undefined;
  };

  // Determine if back button should be shown and where to navigate
  const getBackNavigation = (pathname: string) => {
    if (pathname.startsWith('/mint_certificate/new')) {
      return { showBackButton: true, backTo: '/mint_certificate' };
    }
    if (pathname.startsWith('/mint_nft/new')) {
      return { showBackButton: true, backTo: '/mint_nft' };
    }
    if (pathname.startsWith('/collections/new')) {
      return { showBackButton: true, backTo: '/collections' };
    }
    // Collection detail page (e.g., /collections/1, /collections/2)
    if (pathname.startsWith('/collections/') && pathname !== '/collections/new') {
      return { showBackButton: true, backTo: '/collections' };
    }
    if (pathname.startsWith('/templates/new')) {
      return { showBackButton: true, backTo: '/templates' };
    }
    if (pathname.startsWith('/account/new')) {
      return { showBackButton: true, backTo: '/account' };
    }
    if (pathname.startsWith('/account/edit_company')) {
      return { showBackButton: true, backTo: '/account' };
    }
    if (pathname.startsWith('/account/edit_user')) {
      return { showBackButton: true, backTo: '/account' };
    }
    return { showBackButton: false, backTo: undefined };
  };

  const { showBackButton, backTo } = getBackNavigation(location.pathname);

  return (
    <div className="min-h-screen bg-[#222526] relative">
      {/* Blur background overlay */}
      <div className="absolute backdrop-blur-[100px] backdrop-filter bg-[rgba(19,19,19,0.4)] h-full w-full" />
      <div className="relative flex">
        {/* Desktop Sidebar Container - Only visible on desktop, for layout purposes */}
        <div className="w-0 lg:w-[250px]">
          <div className="sticky top-0 h-screen p-0">
            <Sidebar />
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6 min-w-0">
          <div className="bg-[#fcfafa] rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] p-4 sm:p-5 lg:p-[24px] w-full max-w-none min-h-[calc(100vh-24px)] lg:min-h-[calc(100vh-48px)]">
            <HeaderBar
              title={getPageTitle(location.pathname)}
              subtitle={getPageSubtitle(location.pathname)}
              showBackButton={showBackButton}
              backTo={backTo}
            />
            <div className="mt-4 sm:mt-5 lg:mt-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
