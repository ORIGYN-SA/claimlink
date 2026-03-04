import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { RouterContext } from "@/features/auth/types/router-context";
import { Toaster } from "@/components/ui/sonner";

/**
 * Root route with typed context.
 *
 * The context is passed from main.tsx via RouterProvider:
 * - auth.isConnected: Whether user is authenticated
 * - auth.principalId: User's IC principal ID
 * - auth.authenticatedAgent: Agent for authenticated calls
 * - auth.unauthenticatedAgent: Agent for public queries
 *
 * Child routes access this via context parameter in beforeLoad.
 */
export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}
