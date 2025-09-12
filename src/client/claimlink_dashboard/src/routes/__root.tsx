import { Outlet, createRootRoute } from "@tanstack/react-router";
import AuthProvider from "@/features/auth/providers/AuthProvider";
import {
  CLAIMLINK_CANISTER_ID,
  NFT_CANISTER_ID,
  CERTIFICATE_CANISTER_ID,
  LEDGER_CANISTER_ID,
  APP_MODE,
} from "../shared/constants";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <AuthProvider
          derivationOrigin={
            ["preprod", "production"].includes(APP_MODE)
              ? "https://your-claimlink-canister.icp0.io"
              : undefined
          }
          targets={[
            CLAIMLINK_CANISTER_ID,
            NFT_CANISTER_ID,
            CERTIFICATE_CANISTER_ID,
            LEDGER_CANISTER_ID,
          ].filter(Boolean)} // Filter out undefined values
        >
      <Outlet />
    </AuthProvider>
  );
}
