import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Import authentication
import { AuthProvider } from "./features/auth";
import {
  CLAIMLINK_CANISTER_ID,
  NFT_CANISTER_ID,
  CERTIFICATE_CANISTER_ID,
  LEDGER_CANISTER_ID,
  APP_MODE,
} from "./shared/constants";

// Import IdentityKit styles
import "@nfid/identitykit/react/styles.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes - good for IC
      retry: 1,  // IC calls can be slow, limit retries
      refetchOnWindowFocus: false,  // Prevent unnecessary IC calls
    },
  },
})

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
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
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
