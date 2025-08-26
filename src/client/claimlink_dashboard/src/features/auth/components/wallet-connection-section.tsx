import { Card, CardContent } from "@/components/ui/card"
import { NFIDIcon, InternetIdentityIcon, OISYIcon, PlugIcon, InfoIcon } from "./wallet-icons"

export function WalletConnectionSection() {
  return (
    <div className="mb-10">
      {/* Section divider */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-px bg-white/30" />
        <span className="text-gray-300 text-sm font-medium px-2">
          Connect with your Wallet
        </span>
        <InfoIcon />
        <div className="flex-1 h-px bg-white/30" />
      </div>
      
      {/* NFID - Primary wallet option */}
      <div className="mb-2">
        <Card className="bg-white border-2 border-purple-400 hover:border-purple-500 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-start gap-4">
            <NFIDIcon />
            <div className="flex-1">
              <h3 className="text-gray-900 font-semibold text-lg leading-6">NFID</h3>
              <p className="text-gray-600 text-sm leading-relaxed mt-1">
                Quickly sign in or create an anonymous, self-sovereign wallet with your email address or passkey.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Other wallet options */}
      <div className="space-y-2">
        <Card className="bg-white border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <InternetIdentityIcon />
            <span className="text-gray-900 font-semibold">Internet Identity</span>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <OISYIcon />
            <span className="text-gray-900 font-semibold">OISY</span>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <PlugIcon />
            <span className="text-gray-900 font-semibold">Plug Wallet</span>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
