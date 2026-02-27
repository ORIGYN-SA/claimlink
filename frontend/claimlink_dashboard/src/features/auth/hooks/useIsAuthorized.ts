import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

/**
 * Hook to check if the current user is an authorized principal.
 *
 * Currently returns true as a placeholder since the backend doesn't expose
 * an `is_authorized` query method yet. When the backend API is available,
 * this hook will call the ClaimLink canister to verify authorization.
 *
 * TODO: Implement actual authorization check when backend supports it:
 * 1. Add `is_authorized_principal` query method to ClaimLink canister
 * 2. Update this hook to call the canister and return real authorization status
 *
 * Usage:
 * ```tsx
 * const { isAuthorized, isLoading } = useIsAuthorized();
 * if (!isAuthorized) {
 *   return <UnauthorizedWarningDialog isOpen={true} />;
 * }
 * ```
 */
export function useIsAuthorized() {
  const { principalId, authenticatedAgent, isConnected } = useAuth();

  const query = useQuery({
    queryKey: ["auth", "isAuthorized", principalId],
    queryFn: async () => {
      // TODO: Replace with actual canister call when backend API is available
      // Example implementation:
      // const actor = createCanisterActor<_SERVICE>(authenticatedAgent, canisterId, idlFactory);
      // return await actor.is_authorized_principal(Principal.fromText(principalId));

      // For now, return true (all authenticated users are considered authorized)
      // This should be updated when backend adds authorization checking
      return true;
    },
    enabled: !!principalId && !!authenticatedAgent && isConnected,
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
