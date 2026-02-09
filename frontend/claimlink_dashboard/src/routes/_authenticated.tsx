import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

/**
 * Layout route that protects all child routes.
 *
 * The `_` prefix makes this a "pathless" layout route:
 * - Child routes like `_authenticated/dashboard.tsx` have URL `/dashboard` (not `/_authenticated/dashboard`)
 * - This layout's beforeLoad runs for ALL children
 *
 * Auth check uses router context (set by AuthGate) as the single source of truth.
 * NFID IdentityKit handles session persistence and expiry natively.
 */
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (context.auth.isConnected && context.auth.principalId) {
      return { auth: context.auth };
    }

    // Not authenticated - redirect to login
    console.log("[Auth Guard] Not authenticated, redirecting to login");
    throw redirect({
      to: "/login",
      search: {
        returnTo: location.href,
      },
    });
  },
  component: AuthenticatedLayout,
});

/**
 * Layout component - just renders children.
 * DashboardLayout is applied in individual route components.
 */
function AuthenticatedLayout() {
  return <Outlet />;
}
