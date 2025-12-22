import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    // Redirect to dashboard if already authenticated
    if (context.auth.isConnected && context.auth.principalId) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});
