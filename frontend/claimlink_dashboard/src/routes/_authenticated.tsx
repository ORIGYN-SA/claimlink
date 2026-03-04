import { useState } from "react";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useIsAuthorized } from "@/features/auth/hooks/useIsAuthorized";
import { UnauthorizedWarningDialog } from "@/components/common/unauthorized-warning-dialog/unauthorized-warning-dialog";

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
 * Layout component - renders children and shows authorization warning if needed.
 * DashboardLayout is applied in individual route components.
 */
function AuthenticatedLayout() {
  const { isAuthorized, isLoading } = useIsAuthorized();
  const [dialogOpen, setDialogOpen] = useState(true);

  return (
    <>
      <Outlet />
      {!isLoading && !isAuthorized && (
        <UnauthorizedWarningDialog
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
}
