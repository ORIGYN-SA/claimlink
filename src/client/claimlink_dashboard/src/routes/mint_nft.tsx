import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mint_nft')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/mint_nft"!</div>
}
