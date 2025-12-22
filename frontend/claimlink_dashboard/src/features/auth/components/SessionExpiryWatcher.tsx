import { useEffect } from "react";
import { useRouter, useNavigate } from "@tanstack/react-router";
import {
  isStoredDelegationExpired,
  clearDelegationFromStorage,
} from "../utils/delegation-storage";
import { useAuth } from "../hooks/useAuth";

// Check every 60 seconds for session expiry
const SESSION_CHECK_INTERVAL = 60 * 1000;

/**
 * Minimal session expiry watcher for the edge case of idle session expiry.
 *
 * This component handles ONLY the case where a user's session expires
 * while they're idle on a page (no navigation or action triggers).
 *
 * For explicit logout (button clicks), see account-menu.tsx which uses
 * router.invalidate() + navigate() directly.
 *
 * Pattern follows TanStack Router recommendations:
 * 1. Detect session expiry
 * 2. Call disconnect() to clear auth state
 * 3. Call router.invalidate() to re-run all beforeLoad guards
 * 4. Navigate to login with reason=session_expired
 */
export const SessionExpiryWatcher = () => {
  const router = useRouter();
  const navigate = useNavigate();
  const { isConnected, disconnect } = useAuth();

  useEffect(() => {
    // Only watch when user is connected
    if (!isConnected) return;

    const checkSession = () => {
      if (isStoredDelegationExpired()) {
        console.log("[Session] Session expired while idle, logging out");

        // Clear storage and disconnect
        clearDelegationFromStorage();
        disconnect();

        // Invalidate router and navigate to login
        router.invalidate().then(() => {
          navigate({
            to: "/login",
            search: { reason: "session_expired" as const },
          });
        });
      }
    };

    // Check immediately on mount
    checkSession();

    // Then check periodically
    const interval = setInterval(checkSession, SESSION_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [isConnected, disconnect, router, navigate]);

  // This component renders nothing
  return null;
};
