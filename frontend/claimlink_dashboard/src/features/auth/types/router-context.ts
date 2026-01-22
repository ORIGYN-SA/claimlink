import type { Agent } from "@dfinity/agent";

/**
 * Auth context passed through TanStack Router context.
 * This is used in beforeLoad guards for route protection.
 */
export interface RouterAuthContext {
  isConnected: boolean;
  principalId: string;
  authenticatedAgent: Agent | undefined;
  unauthenticatedAgent: Agent | undefined;
}

/**
 * Router context type for TanStack Router.
 * Passed to createRootRouteWithContext and available in beforeLoad.
 */
export interface RouterContext {
  auth: RouterAuthContext;
}
