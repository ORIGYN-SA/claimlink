import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Menu } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AccountMenu } from "@/components/common/account-menu";
import { useAuth } from "@/features/auth";
import icon from "@/assets/icon.svg";
import { useFetchLedgerBalance } from "@/shared";
import { OGY_LEDGER_CANISTER_ID } from "@/shared/constants";
import { useAtom } from "jotai";
import { mobileMenuOpenAtom } from "@/shared/stores/ui-atoms";

interface HeaderBarProps {
  title?: string;
  subtitle?: string;
  className?: string;
  showBackButton?: boolean;
  backTo?: string;
}

export function HeaderBar({
  title = "Dashboard",
  subtitle,
  className,
  showBackButton = false,
  backTo,
}: HeaderBarProps) {
  const navigate = useNavigate();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useAtom(mobileMenuOpenAtom);
  const { isConnected, principalId, unauthenticatedAgent } = useAuth();

  const ogyBalance = useFetchLedgerBalance(
    OGY_LEDGER_CANISTER_ID,
    unauthenticatedAgent,
    {
      ledger: "OGY",
      owner: principalId,
      enabled: !!unauthenticatedAgent && isConnected,
    },
  );

  // console.log("ogy", ogyBalance);

  const handleBack = () => {
    if (backTo) {
      navigate({ to: backTo });
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 sm:px-6 py-0 gap-2 sm:gap-4",
        className,
      )}
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden w-8 h-8 text-[#222526] hover:bg-[#f0f0f0] shrink-0"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 text-[#222526] hover:bg-[#f0f0f0] shrink-0"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div className="flex flex-col min-w-0">
          <h1 className="font-sans font-medium text-[#222526] text-xl sm:text-2xl truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="font-sans font-light text-[#69737c] text-sm sm:text-base truncate mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {/* Wallet Button */}
        {isConnected ? (
          <div className="bg-white box-border content-stretch flex gap-2 items-center justify-start px-4 py-2 relative rounded-[100px] h-[47px] shrink-0">
            <div
              aria-hidden="true"
              className="absolute border border-[#e1e1e1] border-solid inset-0 pointer-events-none rounded-[100px]"
            />
            <div className="relative shrink-0 size-4">
              <img src={icon} alt="logo" className="w-full h-full" />
            </div>
            <div className="text-sm whitespace-nowrap">
              {ogyBalance?.isLoading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#69737c]" />
                  <span className="text-[#69737c] hidden sm:inline">
                    Loading...
                  </span>
                </div>
              ) : ogyBalance?.isError ? (
                <span className="text-red-500">Error</span>
              ) : (
                <>
                  <span className="font-medium text-[#061937]">
                    {ogyBalance?.data?.balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || ""}
                  </span>
                  <span className="text-[#69737c] ml-1">OGY</span>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white hidden sm:flex gap-2 items-center px-4 py-2 rounded-[100px] h-[47px] border border-[#e1e1e1]">
            <div className="relative shrink-0 size-4">
              <div className="w-full h-full bg-[#615bff] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">O</span>
              </div>
            </div>
            <div className="text-sm whitespace-nowrap">
              <span className="font-medium text-[#061937]">Connect</span>
              <span className="text-[#69737c] ml-1">Wallet</span>
            </div>
          </div>
        )}

        {/* Account Button */}
        <AccountMenu
          isOpen={isAccountMenuOpen}
          onOpenChange={setIsAccountMenuOpen}
          trigger={
            <button className="bg-white flex gap-2 h-[47px] cursor-pointer items-center px-2 sm:px-4 py-2 rounded-[100px] border border-[#e1e1e1]">
              <div className="relative size-[39px] shrink-0">
                <div className="w-full h-full bg-gray-300 rounded-full"></div>
                <div className="absolute bottom-0 right-0 size-4">
                  <div className="w-full h-full bg-[#69737c] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">C</span>
                  </div>
                </div>
              </div>
              <div className="text-sm whitespace-nowrap hidden md:block">
                <span className="font-medium text-[#061937]">My Account:</span>
                <span className="text-[#69737c] ml-1">
                  {principalId
                    ? `${principalId.slice(0, 6)}...${principalId.slice(-4)}`
                    : "Connected"}
                </span>
              </div>
            </button>
          }
        />
      </div>
    </div>
  );
}
