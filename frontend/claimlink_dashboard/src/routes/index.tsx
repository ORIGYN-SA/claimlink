import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Root route - always redirects.
 * - Authenticated users → /dashboard
 * - Unauthenticated users → /login
 *
 * This route never renders content directly.
 */
export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (context.auth.isConnected && context.auth.principalId) {
      throw redirect({ to: "/dashboard" });
    }
    throw redirect({ to: "/login" });
  },
});
