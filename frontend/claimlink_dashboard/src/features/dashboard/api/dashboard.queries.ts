/**
 * Dashboard Query Hooks
 *
 * React Query hooks for dashboard data fetching.
 * Uses DashboardService for data access abstraction.
 */

import { useQuery } from '@tanstack/react-query';
import { DashboardService } from './dashboard.service';

/**
 * Query key factory for dashboard
 */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  activity: (limit?: number) =>
    [...dashboardKeys.all, 'activity', limit] as const,
  quickStats: () => [...dashboardKeys.all, 'quickStats'] as const,
  trending: (limit?: number) =>
    [...dashboardKeys.all, 'trending', limit] as const,
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
