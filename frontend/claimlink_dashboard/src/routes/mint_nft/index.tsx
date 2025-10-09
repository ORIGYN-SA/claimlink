import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout'
import { MintNFTPage } from '@/features/mint-nft/components/mint-nft-page'

export const Route = createFileRoute('/mint_nft/')({
  component: MintNFTRoute,
})

function MintNFTRoute() {
  return (
    <DashboardLayout>
      <MintNFTPage />
    </DashboardLayout>
  )
}
