// new-password-page.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "@tanstack/react-router"

export function NewPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }
    
    // TODO: Implement password reset logic
    console.log("New password:", password)
  }

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
              <span className="italic font-extralight text-2xl block">New</span>
              <span className="font-normal text-3xl">password</span>
            </h1>
          </div>
          
          {/* Form Section */}
          <div className="space-y-6">
            {/* Section Title with Lines */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-white" />
              <p className="text-[#e1e1e1] text-sm font-medium px-2">
                Enter your new password
              </p>
              <div className="flex-1 h-px bg-white" />
            </div>
            
            {/* Password Form */}
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Password Input */}
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/15 border-white/50 text-white placeholder:text-white/70 rounded-full px-6 py-3 text-sm font-medium"
                required
              />
              
              {/* Confirm Password Input */}
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/15 border-white/50 text-white placeholder:text-white/70 rounded-full px-6 py-3 text-sm font-medium"
                required
              />
              
              {/* Confirm Button */}
              <Button
                type="submit"
                className="w-full bg-white text-[#222526] hover:bg-white/90 rounded-[20px] h-14 px-6 py-3 text-sm font-normal shadow-[0px_4px_24px_0px_rgba(0,0,0,0.15)]"
              >
                Confirm password
              </Button>
            </form>
          </div>
          
          {/* Back to Login Link */}
          <div className="text-center mt-6">
            <Link 
              to="/login" 
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
