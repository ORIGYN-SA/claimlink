import { Card, CardContent } from "@/components/ui/card"
import { WalletConnectionSection } from "./wallet-connection-section"
import { IntegratorLoginSection } from "./integrator-login-section"
import { LoginFooter } from "./login-footer"

export function LoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
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
          // Hide video on error to show fallback background
          e.currentTarget.style.display = 'none';
        }}
      >
        <source 
          src="https://pub-1832d2c733894370a7282135b65cc177.r2.dev/claimlink_login_bg_video.mp4" 
          type="video/mp4" 
        />
        {/* Fallback message for browsers that don't support video */}
        Your browser does not support the video tag.
      </video>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Gradient overlay for enhanced visual depth */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-indigo-900/20 to-purple-900/20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 105, 180, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(0, 191, 255, 0.2) 0%, transparent 50%)
          `
        }}
      />
      
      {/* Glassmorphism container */}
      <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
        <Card className="w-full max-w-lg bg-white/8 backdrop-blur-2xl border-white/15 shadow-2xl">
          <CardContent className="p-12">
            {/* Logo */}
            <div className="flex justify-center mb-10">
              <div className="text-white font-light text-2xl tracking-wider">
                □ ORIGYN
              </div>
            </div>
            
            {/* Title */}
            <div className="text-center mb-10">
              <h1 className="text-white text-4xl font-light leading-tight">
                <span className="italic font-extralight">Welcome to</span>
                <br />
                <span className="font-normal">minting studio</span>
              </h1>
            </div>
            
            {/* Wallet Connection Section */}
            <WalletConnectionSection />
            
            {/* Integrator Login Section */}
            <IntegratorLoginSection />
            
            {/* Footer */}
            <LoginFooter />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
