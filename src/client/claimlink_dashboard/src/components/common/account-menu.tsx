// AccountMenu.tsx
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Copy, LogOut, RefreshCw } from "lucide-react"
import { WithdrawDialog } from "./withdraw-dialog"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useMultiTokenBalance, SUPPORTED_TOKENS } from "@/shared"

interface AccountMenuProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  trigger?: React.ReactNode
}

export function AccountMenu({ isOpen, onOpenChange, trigger }: AccountMenuProps) {
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)
  const { disconnect, principalId, authenticatedAgent } = useAuth()

  // Fetch balances for all supported tokens
  const { balances, summary, refetchAll } = useMultiTokenBalance(
    SUPPORTED_TOKENS,
    authenticatedAgent,
    principalId || "",
    {
      enabled: !!principalId && !!authenticatedAgent,
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  )

  // Get OGY balance specifically for display
  const ogyBalance = balances.find(({ token }) => token.id === "ogy")?.balance

  const handleCopyAccountId = () => {
    navigator.clipboard.writeText(principalId || "55vo5-45mf9-...1234d-erpra")
    // TODO: Add toast notification
  }

  const handleSignOut = () => {
    disconnect()
  }

  const handleWithdrawClick = () => {
    setWithdrawDialogOpen(true)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        side="right"
        className="w-[502px] sm:w-[502px] p-0 border-0 h-full"
        style={{
          backgroundColor: '#051936',
        }}
      >
        {/* Remove the nested relative div and simplify structure */}
        <div className="h-full overflow-y-auto">
          {/* Background with blur effect */}
          <div className="min-h-full bg-[#051936]/95 backdrop-blur-xl">
            <div className="flex flex-col h-full p-10 gap-8">
              {/* Sign out and refresh buttons */}
              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => refetchAll()}
                  disabled={summary.loadingCount > 0}
                  className="text-[#e8e8e8] hover:bg-[#e8e8e8]/10 rounded-full"
                >
                  <RefreshCw className={`w-5 h-5 ${summary.loadingCount > 0 ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="text-[#e8e8e8] hover:bg-[#e8e8e8]/10 rounded-full"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>

              {/* User profile section */}
              <div className="flex items-center gap-6">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#222526]">JD</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[#85f1ff] text-sm font-normal tracking-[0.8px] mb-1">
                        Welcome back
                      </p>
                      <h2 className="text-white text-xl font-semibold">
                        Jane Doe
                      </h2>
                    </div>
                    <div className="bg-[#85f1ff] px-3 py-1 rounded-full">
                      <span className="text-[#061937] text-xs font-semibold uppercase">
                        Admin (all)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content sections */}
              <div className="flex flex-col gap-6">
                {/* Wallet Balance Section */}
                <div className="flex flex-col rounded-[20px] overflow-hidden">
                  <div className="bg-[#fcfafa] border border-[#e1e1e1] border-b-0 px-6 py-3">
                    <h3 className="text-[#69737c] text-base font-medium text-center">
                      Wallet Balance
                    </h3>
                  </div>
                  <div className="bg-white border-x border-b border-[#e1e1e1] px-5 py-6">
                    <div className="flex flex-col items-center gap-6">
                      {/* Balance */}
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <div className="w-7 h-7 bg-[#615bff] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">O</span>
                          </div>
                          {ogyBalance?.isLoading ? (
                            <div className="flex items-center gap-2">
                              <RefreshCw className="w-6 h-6 animate-spin text-[#69737c]" />
                              <span className="text-[#69737c] text-lg">Loading...</span>
                            </div>
                          ) : ogyBalance?.isError ? (
                            <div className="flex items-center gap-2">
                              <span className="text-red-500 text-lg">Error</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => refetchAll()}
                                className="p-1 h-auto"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <span className="text-[#222526] text-3xl font-semibold">
                                {ogyBalance?.data?.balance.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }) || "0.00"}
                              </span>
                              <span className="text-[#69737c] text-lg font-normal tracking-[1px] ml-1">
                                OGY
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-[#69737c] text-sm tracking-[0.8px]">
                          {ogyBalance?.data?.balance_usd ? (
                            `$${ogyBalance.data.balance_usd.toFixed(4)}`
                          ) : (
                            ogyBalance?.isLoading ? "Loading..." : "Price unavailable"
                          )}
                        </p>
                      </div>

                      {/* Account ID */}
                      <div className="bg-[#fcfafa] border border-[#e8e8e8] rounded-full px-4 py-2.5 flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-[#222526] text-xs font-bold">IC</span>
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#69737c] rounded-full flex items-center justify-center">
                              <span className="text-white text-[8px]">C</span>
                            </div>
                          </div>
                          <div className="text-xs">
                            <span className="text-[#69737c] font-normal">Account ID: </span>
                            <span className="text-[#222526] font-semibold">
                              {principalId || "55vo5-45mf9-...1234d-erpra"}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCopyAccountId}
                          className="w-6 h-6 p-0 text-[#69737c] hover:text-[#222526] hover:bg-transparent"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      {/* Withdraw button */}
                      <Button
                        onClick={handleWithdrawClick}
                        className="bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full px-6 py-2.5 w-full text-sm font-medium"
                      >
                        Withdraw
                      </Button>

                      <button className="text-[#69737c] text-xs hover:text-[#222526] transition-colors">
                        How to top up?
                      </button>
                    </div>
                  </div>
                  <div className="bg-[#fcfafa] border-x border-b border-[#e1e1e1] px-4 py-3">
                    <p className="text-[#69737c] text-xs text-center">
                      <span className="font-normal">Current rate:</span>{" "}
                      <span className="font-medium">1 OGY = 0.01072 USD</span>
                    </p>
                  </div>
                </div>

                {/* Portfolio Summary */}
                <div className="flex flex-col rounded-[20px] overflow-hidden">
                  <div className="bg-[#fcfafa] border border-[#e1e1e1] border-b-0 px-6 py-3">
                    <h3 className="text-[#69737c] text-sm font-medium">
                      Portfolio Summary
                    </h3>
                  </div>
                  <div className="bg-white border-x border-b border-[#e1e1e1] px-5 py-4">
                    <div className="text-center">
                      <div className="text-[#222526] text-lg font-semibold mb-1">
                        Total Value
                      </div>
                      <div className="text-[#69737c] text-sm">
                        {summary.totalUsdValue > 0 ? (
                          `$${summary.totalUsdValue.toFixed(2)} USD`
                        ) : summary.loadingCount > 0 ? (
                          "Loading..."
                        ) : (
                          "No balances available"
                        )}
                      </div>
                      {summary.errorCount > 0 && (
                        <div className="text-red-500 text-xs mt-1">
                          {summary.errorCount} token(s) failed to load
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Last Transaction Section */}
                <div className="flex flex-col rounded-[20px] overflow-hidden">
                  <div className="bg-[#fcfafa] border border-[#e1e1e1] border-b-0 px-6 py-3">
                    <h3 className="text-[#69737c] text-sm font-medium">
                      Last transaction
                    </h3>
                  </div>
                  <div className="bg-white border-x border-b border-[#e1e1e1] px-5 py-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex flex-col gap-2">
                        <div>
                          <h4 className="text-[#222526] text-sm font-semibold">
                            Collection Name
                          </h4>
                          <p className="text-[#69737c] text-xs">
                            20 Feb, 2024
                          </p>
                        </div>
                        <div className="bg-[#edf8f4] px-2 py-0.5 rounded-full w-fit">
                          <span className="text-[#50be8f] text-[10px] font-medium tracking-[0.5px] uppercase">
                            Deployment
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-0.5">
                          <div className="w-3.5 h-3.5 bg-[#615bff] rounded-full flex items-center justify-center">
                            <span className="text-white text-[8px] font-bold">O</span>
                          </div>
                          <span className="text-[#222526] text-sm font-semibold">
                            1325 OGY
                          </span>
                        </div>
                        <p className="text-[#69737c] text-xs">
                          (15$)
                        </p>
                      </div>
                    </div>

                    <Button className="bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full px-6 py-2.5 w-full text-sm font-medium">
                      See all transactions
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>

      {/* Withdraw Dialog */}
      <WithdrawDialog
        isOpen={withdrawDialogOpen}
        onOpenChange={setWithdrawDialogOpen}
      />
    </Sheet>
  )
}