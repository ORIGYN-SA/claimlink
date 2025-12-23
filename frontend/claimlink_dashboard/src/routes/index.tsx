import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth";

type LoginSearch = {
  returnTo?: string;
  reason?: "session_expired" | "unauthorized";
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    returnTo: search.returnTo as string,
    reason: search.reason as LoginSearch["reason"],
  }),
  beforeLoad: ({ context, search }) => {
    // Redirect if already authenticated
    // Use returnTo if available, otherwise go to dashboard
    if (context.auth.isConnected && context.auth.principalId) {
      const destination = (search as LoginSearch).returnTo || "/dashboard";
      throw redirect({ to: destination });
    }
  },
  component: LoginPage,
});
