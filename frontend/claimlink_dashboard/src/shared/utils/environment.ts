/**
 * Determines if the application is running against a local IC replica.
 * Used to determine whether to call agent.fetchRootKey().
 *
 * @param host - The IC host URL (e.g., from IC_HOST constant)
 * @param mode - The app mode (e.g., from APP_MODE constant)
 * @returns true if running against local replica, false otherwise
 */
export const isLocalICReplica = (host: string, mode: string): boolean => {
  // Check if host points to localhost
  const isLocalHost =
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host.includes('0.0.0.0');

  // Only return true if BOTH conditions are met:
  // 1. Development mode (extra safety check)
  // 2. Host points to localhost
  return mode === 'development' && isLocalHost;
};
