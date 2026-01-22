import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "jotai";
import { store } from "@/lib/store";
import { AuthGate } from "@/features/auth/components/AuthGate";
import type { RouterContext } from "@/features/auth/types/router-context";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./styles.css";
import "@nfid/identitykit/react/styles.css";
import reportWebVitals from "./reportWebVitals";

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - good for IC
      retry: 1, // IC calls can be slow, limit retries
      refetchOnWindowFocus: false, // Prevent unnecessary IC calls
    },
  },
});

/**
 * Create router with auth context.
 * Called inside AuthGate callback after auth is resolved.
 */
const createAppRouter = (context: RouterContext) => {
  return createRouter({
    routeTree,
    context,
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
  });
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}

/**
 * Application entry point.
 *
 * Architecture follows official TanStack Router auth pattern:
 * 1. Jotai Provider - Global state for component-level auth access (useAuth hook)
 * 2. QueryClientProvider - React Query for server state
 * 3. AuthGate - Shows loading until auth resolved, then renders RouterProvider
 *    - RouterProvider only exists when auth state is definitive
 *    - Router context receives auth state for beforeLoad guards
 */
const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthGate>
            {(authContext) => {
              const router = createAppRouter({ auth: authContext });
              return <RouterProvider router={router} />;
            }}
          </AuthGate>
        </QueryClientProvider>
      </Provider>
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
