import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InfoIcon, ArrowRightIcon } from "./wallet-icons"

export function IntegratorLoginSection() {
  return (
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
  )
}
