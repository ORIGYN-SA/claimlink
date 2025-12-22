import { createFileRoute, redirect } from "@tanstack/react-router";
import { NewPasswordPage } from "@/features/auth";

export const Route = createFileRoute("/new-password")({
  beforeLoad: ({ context }) => {
    // Redirect to dashboard if already authenticated
    if (context.auth.isConnected && context.auth.principalId) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: NewPasswordPage,
});
