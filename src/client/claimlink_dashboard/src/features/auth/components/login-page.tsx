// login-page.tsx
import { WalletConnectionSection } from "./wallet-connection-section"
import { IntegratorLoginSection } from "./integrator-login-section"
import { LoginFooter } from "./login-footer"

export function LoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Fallback background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 105, 180, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(0, 191, 255, 0.3) 0%, transparent 50%)
          `
        }}
      />
      
      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      >
        <source 
          src="https://pub-1832d2c733894370a7282135b65cc177.r2.dev/claimlink_login_bg_video.mp4" 
          type="video/mp4" 
        />
      </video>
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Glassmorphism card - Fixed sizing */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="text-white font-light text-xl tracking-wider">
              □ ORIGYN
            </div>
          </div>
          
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-white">
              <span className="italic font-extralight text-2xl block">Welcome to</span>
              <span className="font-normal text-3xl">minting studio</span>
            </h1>
          </div>
          
          {/* Wallet Connection Section */}
          <WalletConnectionSection />
          
          {/* Integrator Login Section */}
          <IntegratorLoginSection />
          
          {/* Footer */}
          <LoginFooter />
        </div>
      </div>
    </div>
  )
}