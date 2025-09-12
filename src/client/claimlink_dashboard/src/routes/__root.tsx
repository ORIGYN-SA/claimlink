import { Outlet, createRootRoute } from "@tanstack/react-router";
import AuthProvider from "@/features/auth/providers/AuthProvider";
// Import IdentityKit styles
import "@nfid/identitykit/react/styles.css";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
