/**
 * Dashboard Query Hooks
 *
 * React Query hooks for dashboard data fetching.
 * Uses DashboardService for data access abstraction.
 */

import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "./dashboard.service";
import { useAuth } from "@/features/auth/hooks/useAuth";

/**
 * Query key factory for dashboard
 */
export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  activity: (limit?: number) =>
    [...dashboardKeys.all, "activity", limit] as const,
  quickStats: () => [...dashboardKeys.all, "quickStats"] as const,
  trending: (limit?: number) =>
    [...dashboardKeys.all, "trending", limit] as const,
  statusCounts: (principalId?: string) =>
    [...dashboardKeys.all, "statusCounts", principalId] as const,
  recentCertificates: (principalId?: string, limit?: number) =>
    [...dashboardKeys.all, "recentCertificates", principalId, limit] as const,
  recentOwners: (principalId?: string, limit?: number) =>
    [...dashboardKeys.all, "recentOwners", principalId, limit] as const,
  sentCertificates: (principalId?: string, limit?: number) =>
    [...dashboardKeys.all, "sentCertificates", principalId, limit] as const,
};

/**
 * Fetch dashboard statistics
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => DashboardService.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes - dashboard stats should be relatively fresh
  });
};

/**
 * Fetch recent activity
 */
export const useRecentActivity = (limit = 10) => {
  return useQuery({
    queryKey: dashboardKeys.activity(limit),
    queryFn: () => DashboardService.getRecentActivity(limit),
    staleTime: 1 * 60 * 1000, // 1 minute - activity updates frequently
  });
};

/**
 * Fetch quick statistics for dashboard cards
 */
export const useQuickStats = () => {
  return useQuery({
    queryKey: dashboardKeys.quickStats(),
    queryFn: () => DashboardService.getQuickStats(),
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Fetch trending items
 */
export const useTrendingItems = (limit = 5) => {
  return useQuery({
    queryKey: dashboardKeys.trending(limit),
    queryFn: () => DashboardService.getTrendingItems(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes - trending data changes slowly
  });
};

/**
 * Fetch certificate status counts for dashboard stat cards
 *
 * Returns counts for:
 * - Minted Certificates (total)
 * - Awaiting Certificates (pending/waiting status)
 * - Certificates in Wallet (owned by current user)
 * - Transferred Certificates (owned by others)
 */
export const useDashboardStatusCounts = () => {
  const { unauthenticatedAgent, principalId, isConnected } = useAuth();

  return useQuery({
    queryKey: dashboardKeys.statusCounts(principalId),
    queryFn: async () => {
      if (!unauthenticatedAgent || !principalId) {
        throw new Error("Not authenticated");
      }

      return await DashboardService.getCertificateStatusCounts(
        unauthenticatedAgent,
        principalId,
      );
    },
    enabled: !!unauthenticatedAgent && !!principalId && isConnected,
    staleTime: 5 * 60 * 1000, // 5 minutes - dashboard refreshes moderately
    retry: 1,
  });
};

/**
 * Fetch most recently minted certificates for dashboard display
 * Limited to 9 certificates by default
 */
export const useDashboardRecentCertificates = (limit: number = 9) => {
  const { unauthenticatedAgent, principalId, isConnected } = useAuth();

  return useQuery({
    queryKey: dashboardKeys.recentCertificates(principalId, limit),
    queryFn: async () => {
      if (!unauthenticatedAgent || !principalId) {
        throw new Error("Not authenticated");
      }

      return await DashboardService.getRecentCertificates(
        unauthenticatedAgent,
        principalId,
        limit,
      );
    },
    enabled: !!unauthenticatedAgent && !!principalId && isConnected,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

/**
 * Fetch recent certificate owners (unique principals who own transferred certificates)
 * Used for "Last Certificate Owners" dashboard section
 */
export const useDashboardRecentOwners = (limit: number = 5) => {
  const { unauthenticatedAgent, principalId, isConnected } = useAuth();

  return useQuery({
    queryKey: dashboardKeys.recentOwners(principalId, limit),
    queryFn: async () => {
      if (!unauthenticatedAgent || !principalId) {
        throw new Error("Not authenticated");
      }

      return await DashboardService.getRecentCertificateOwners(
        unauthenticatedAgent,
        principalId,
        limit,
      );
    },
    enabled: !!unauthenticatedAgent && !!principalId && isConnected,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

/**
 * Fetch recently sent (transferred) certificates
 * Used for "Last Sent Certificates" dashboard section
 */
export const useDashboardSentCertificates = (limit: number = 5) => {
  const { unauthenticatedAgent, principalId, isConnected } = useAuth();

  return useQuery({
    queryKey: dashboardKeys.sentCertificates(principalId, limit),
    queryFn: async () => {
      if (!unauthenticatedAgent || !principalId) {
        throw new Error("Not authenticated");
      }

      return await DashboardService.getRecentSentCertificates(
        unauthenticatedAgent,
        principalId,
        limit,
      );
    },
    enabled: !!unauthenticatedAgent && !!principalId && isConnected,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
