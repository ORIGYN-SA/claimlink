import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

const NFIDIcon = () => (
  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
    ID
  </div>
)

const InternetIdentityIcon = () => (
  <div className="w-6 h-6 rounded bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
    II
  </div>
)

const OISYIcon = () => (
  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
    O
  </div>
)

const PlugIcon = () => (
  <div className="w-6 h-6 rounded bg-yellow-500 flex items-center justify-center text-white text-xs font-bold">
    P
  </div>
)

const InfoIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
  </svg>
)

function LoginPage() {
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
            
            {/* Connect with Wallet Section */}
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
            
            {/* Connect with Integrator ID Section */}
            <div className="mb-10">
              {/* Section divider */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 h-px bg-white/30" />
                <span className="text-gray-300 text-sm font-medium px-2">
                  Connect with your Integrator ID
                </span>
                <InfoIcon />
                <div className="flex-1 h-px bg-white/30" />
              </div>
              
              {/* Email and Password inputs */}
              <div className="space-y-2 mb-4">
                <Input 
                  type="email"
                  placeholder="Email"
                  className="bg-white/15 border-white/30 text-white placeholder:text-gray-300 rounded-full px-6 py-3"
                />
                <Input 
                  type="password"
                  placeholder="Password"
                  className="bg-white/15 border-white/30 text-white placeholder:text-gray-300 rounded-full px-6 py-3"
                />
              </div>
              
              {/* Login button */}
              <div className="space-y-2">
                <Button 
                  className="w-full bg-white text-gray-900 hover:bg-gray-100 rounded-2xl h-14 text-base font-normal tracking-wide shadow-lg flex items-center justify-center gap-2"
                >
                  Log in
                  <ArrowRightIcon />
                </Button>
                
                <div className="text-center">
                  <button className="text-gray-300 text-sm hover:text-white transition-colors">
                    Forgot your password?
                  </button>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="text-center">
              <p className="text-gray-400 text-xs leading-relaxed">
                <span className="text-gray-300">BY USING THIS PRODUCT YOU AGREE TO OUR</span>
                <br />
                <button className="text-gray-300 underline hover:text-white transition-colors uppercase tracking-wider">
                  TERMS AND CONDITIONS AND PRIVACY POLICY
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
