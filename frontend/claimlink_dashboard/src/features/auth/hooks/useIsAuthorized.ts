import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { createCanisterActor, getCanisterId } from "@/shared/canister";
import { idlFactory } from "@/shared/canisters/claimlink/idlFactory";
import type { _SERVICE } from "@/shared/canisters/claimlink/interfaces";

/**
 * Hook to check if the current user is an authorized principal.
 *
 * Calls the public `get_metrics` query (no guard) and checks if the
 * current principal is in the `authorized_principals` list.
 *
 * Uses the unauthenticated agent since `get_metrics` is a public query.
 */
export function useIsAuthorized() {
  const { principalId, unauthenticatedAgent, isConnected } = useAuth();

  const query = useQuery({
    queryKey: ["auth", "isAuthorized", principalId],
    queryFn: async () => {
      const actor = createCanisterActor<_SERVICE>(
        unauthenticatedAgent!,
        getCanisterId("claimlink"),
        idlFactory
      );
      const metrics = await actor.get_metrics();
      return metrics.authorized_principals.some(
        (ap) => ap.principal.toText() === principalId
      );
    },
    enabled: !!principalId && !!unauthenticatedAgent && isConnected,
    staleTime: 5 * 60 * 1000, // 5 minutes - authorization status rarely changes
    retry: 1,
  });

  return {
    isAuthorized: query.data ?? true, // Default to true while loading
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
