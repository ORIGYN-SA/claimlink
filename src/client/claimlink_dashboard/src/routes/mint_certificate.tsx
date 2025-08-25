import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mint_certificate')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/mint_certificate"!</div>
}
