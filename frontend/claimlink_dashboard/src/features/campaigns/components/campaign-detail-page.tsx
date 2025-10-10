import { useParams, useNavigate } from '@tanstack/react-router'
import { CampaignStats } from '@/features/campaigns/components/campaign-detail/campaign-stats'
import { CampaignContent } from '@/features/campaigns/components/campaign-detail/campaign-content'
import { CertificateDisplay } from '@/features/campaigns/components/campaign-detail/certificate-display'
import { mockCampaigns } from '@/shared/data/campaigns'
import { Button } from '@/components/ui/button'

export function CampaignDetailPage() {
  const { campaigns: campaignId } = useParams({ strict: false })
  const navigate = useNavigate()

  // Find the campaign from mockCampaigns based on the route parameter
  const campaign = mockCampaigns.find(c => c.id === campaignId)

  // Handle case when campaign is not found
  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#222526] mb-2">Campaign Not Found</h2>
          <p className="text-[#69737c] mb-6">The campaign you're looking for doesn't exist or has been removed.</p>
          <Button
            onClick={() => navigate({ to: '/campaigns' })}
            className="bg-[#222526] hover:bg-[#222526]/90"
          >
            Back to Campaigns
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-none">
      {/* Campaign Statistics Section */}
      <CampaignStats campaign={campaign} />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Campaign content */}
        <CampaignContent campaign={campaign} />

        {/* Right side - Certificate display */}
        <CertificateDisplay campaign={campaign} />
      </div>
    </div>
  )
}
