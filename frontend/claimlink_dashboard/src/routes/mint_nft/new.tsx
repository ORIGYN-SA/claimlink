import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mint_nft/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/mint_nft/new"!</div>
}
