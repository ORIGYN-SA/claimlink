import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/create_collection')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/create_collection"!</div>
}
