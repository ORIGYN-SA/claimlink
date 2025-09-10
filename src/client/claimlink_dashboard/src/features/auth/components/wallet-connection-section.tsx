// wallet-connection-section.tsx
import { NFIDIcon, InternetIdentityIcon, OISYIcon, PlugIcon, InfoIcon } from "./wallet-icons"
import { useAuth } from "../hooks/useAuth"

export function WalletConnectionSection() {
  const { connect, isInitializing, isConnected } = useAuth();

  if (isInitializing) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-white text-sm">Initializing wallet connection...</div>
        </div>
      </div>
    );
  }

  if (isConnected) {
    return null; // Hide wallet section when already connected
  }

  return (
    <div className="mb-6">
      {/* Section divider */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-px bg-white/30" />
        <span className="text-gray-300 text-xs font-medium px-2 whitespace-nowrap">
          Connect with your Wallet
        </span>
        <div className="w-3 h-3 text-gray-300">
          <InfoIcon />
        </div>
        <div className="flex-1 h-px bg-white/30" />
      </div>

      {/* NFID - Primary wallet option */}
      <button
        onClick={connect}
        className="w-full bg-white rounded-xl p-3 mb-2 border-2 border-purple-400 hover:border-purple-500 transition-colors text-left"
      >
        <div className="flex items-start gap-3">
          <NFIDIcon />
          <div className="flex-1">
            <h3 className="text-gray-900 font-semibold text-sm">NFID</h3>
            <p className="text-gray-600 text-xs leading-relaxed mt-0.5">
              Quickly sign in or create an anonymous, self-sovereign wallet with your email address or passkey.
            </p>
          </div>
        </div>
      </button>

      {/* Other wallet options */}
      <div className="space-y-2">
        <button
          onClick={connect}
          className="w-full bg-white rounded-lg p-3 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <InternetIdentityIcon />
            <span className="text-gray-900 font-medium text-sm">Internet Identity</span>
          </div>
        </button>

        <button
          onClick={connect}
          className="w-full bg-white rounded-lg p-3 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <OISYIcon />
            <span className="text-gray-900 font-medium text-sm">OISY</span>
          </div>
        </button>

        <button
          onClick={connect}
          className="w-full bg-white rounded-lg p-3 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <PlugIcon />
            <span className="text-gray-900 font-medium text-sm">Plug Wallet</span>
          </div>
        </button>
      </div>
    </div>
  )
}