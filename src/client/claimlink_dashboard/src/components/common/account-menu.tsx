import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Copy, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccountMenuProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  trigger?: React.ReactNode
}

export function AccountMenu({ isOpen, onOpenChange, trigger }: AccountMenuProps) {
  const handleCopyAccountId = () => {
    navigator.clipboard.writeText("55vo5-45mf9-...1234d-erpra")
    // TODO: Add toast notification
  }

  const handleSignOut = () => {
    // TODO: Implement sign out logic
    console.log("Sign out")
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        side="right"
        className="w-[502px] p-0 bg-[#051936] border-l-0"
      >
        <div className="relative h-full">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-[#051936] opacity-40 backdrop-blur-[100px]" />

          {/* Main content */}
          <div className="relative flex flex-col h-full p-10 gap-12">
            {/* Sign out button */}
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-[#e8e8e8] hover:bg-[#e8e8e8]/10"
              >
                <LogOut className="w-6 h-6 rotate-45" />
              </Button>
            </div>

            {/* User profile section */}
            <div className="flex items-center gap-8">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                  {/* Avatar placeholder */}
                  <span className="text-2xl font-bold text-[#222526]">JD</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#85f1ff] text-base font-normal tracking-[0.8px] leading-6">
                      Welcome back
                    </p>
                    <h2 className="text-white text-2xl font-semibold leading-8">
                      Jane Doe
                    </h2>
                  </div>
                  <div className="bg-[#85f1ff] px-2 py-0.5 rounded-full">
                    <span className="text-[#061937] text-xs font-semibold">
                      Admin (all)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content sections */}
            <div className="flex flex-col gap-8">
              {/* Wallet Balance Section */}
              <div className="flex flex-col">
                <div className="bg-[#fcfafa] border border-[#e1e1e1] rounded-t-[20px] px-6 py-4">
                  <h3 className="text-[#69737c] text-lg font-medium text-center">
                    Wallet Balance
                  </h3>
                </div>
                <div className="bg-white border-x border-b border-[#e1e1e1] px-5 py-8">
                  <div className="flex flex-col items-center gap-10">
                    {/* Balance */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-[#615bff] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">O</span>
                        </div>
                        <span className="text-[#222526] text-4xl font-semibold">
                          3,800.02
                        </span>
                        <span className="text-[#69737c] text-xl font-normal tracking-[1.2px] ml-1">
                          OGY
                        </span>
                      </div>
                      <p className="text-[#69737c] text-lg tracking-[1.2px]">
                        ($0.1337)
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col items-center gap-4 w-full">
                      <div className="bg-[#fcfafa] border border-[#e8e8e8] rounded-full px-4 py-2 flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-[#222526] text-sm font-bold">IC</span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#69737c] rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">C</span>
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="text-[#69737c] font-normal">Account ID: </span>
                            <span className="text-[#222526] font-semibold">
                              55vo5-45mf9-...1234d-erpra
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCopyAccountId}
                          className="w-4 h-4 text-[#69737c] hover:text-[#222526]"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button className="bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full px-6 py-3 w-full">
                        Withdraw
                      </Button>

                      <p className="text-[#69737c] text-sm">
                        How to top up?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#fcfafa] border-x border-b border-[#e1e1e1] rounded-b-lg px-4 py-4">
                  <p className="text-[#69737c] text-sm text-center">
                    <span className="font-normal">Current rate:</span>{" "}
                    <span className="font-medium">1 OGY = 0.01072 USD</span>
                  </p>
                </div>
              </div>

              {/* Last Transaction Section */}
              <div className="flex flex-col">
                <div className="bg-[#fcfafa] border border-[#e1e1e1] rounded-t-lg px-6 py-4">
                  <h3 className="text-[#69737c] text-base font-medium">
                    Last transaction
                  </h3>
                </div>
                <div className="bg-white border-x border-b border-[#e1e1e1] rounded-b-lg px-6 py-4">
                  <div className="flex items-start justify-between p-2 mb-4">
                    <div className="flex flex-col gap-2">
                      <div>
                        <h4 className="text-[#222526] text-base font-semibold">
                          Collection Name
                        </h4>
                        <p className="text-[#69737c] text-sm">
                          20 Feb, 2024
                        </p>
                      </div>
                      <div className="bg-[#edf8f4] px-2 py-0.5 rounded-full w-fit">
                        <span className="text-[#50be8f] text-xs font-medium tracking-[0.5px] uppercase">
                          Deployment
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="w-4 h-4 bg-[#615bff] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">O</span>
                        </div>
                        <span className="text-[#222526] text-base font-semibold">
                          1325 OGY
                        </span>
                      </div>
                      <p className="text-[#69737c] text-sm">
                        (15$)
                      </p>
                    </div>
                  </div>

                  <Button className="bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full px-6 py-3 w-full">
                    See all transactions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
