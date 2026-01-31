// wallet-connection-section.tsx
import { useAuth } from "../hooks/useAuth"

export function WalletConnectionSection() {
  const { connect, isInitializing, isConnected } = useAuth();

  if (isInitializing) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-center py-8">
          <div className="text-white text-sm">Initializing...</div>
        </div>
      </div>
    );
  }

  if (isConnected) {
    return null; // Hide wallet section when already connected
  }

  return (
    <div className="mb-8">
      {/* Single Login Button - Opens NFID/II wallet selection modal */}
      <button
        onClick={connect}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl py-4 font-medium hover:opacity-90 transition-opacity cursor-pointer"
      >
        Login
      </button>
      <p className="text-center text-gray-400 text-xs mt-3">
        Connect with NFID, Internet Identity, or Plug Wallet
      </p>
    </div>
  )
}