import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import {
  isStoredDelegationExpired,
  clearDelegationFromStorage,
  hasStoredSession,
} from "@/features/auth/utils/delegation-storage";

/**
 * Layout route that protects all child routes.
 *
 * The `_` prefix makes this a "pathless" layout route:
 * - Child routes like `_authenticated/dashboard.tsx` have URL `/dashboard` (not `/_authenticated/dashboard`)
 * - This layout's beforeLoad runs for ALL children
 *
 * Pattern: Single guard protects all protected routes.
 * Individual routes don't need their own beforeLoad auth checks.
 */
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    // FIRST: Check if authenticated via router context
    // This is the source of truth - AuthGate sets this when NFID confirms auth
    // For fresh logins, delegation storage may not be populated yet (useEffect timing)
    if (context.auth.isConnected && context.auth.principalId) {
      return { auth: context.auth };
    }

    // NOT authenticated via context
    // Check if there was a stored session that expired (for "session expired" UX)
    if (hasStoredSession() && isStoredDelegationExpired()) {
      console.log("[Auth Guard] Session expired, redirecting to login");
      clearDelegationFromStorage();
      throw redirect({
        to: "/login",
        search: {
          returnTo: location.href,
          reason: "session_expired" as const,
        },
      });
    }

    // Not authenticated and no expired session - normal auth redirect
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
