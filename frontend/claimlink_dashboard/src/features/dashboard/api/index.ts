/**
 * Dashboard API Layer
 * Exports service and query hooks
 */

export { DashboardService } from './dashboard.service';
export type {
  DashboardStats,
  RecentActivity,
  QuickStat,
} from './dashboard.service';

export {
  dashboardKeys,
  useDashboardStats,
  useRecentActivity,
  useQuickStats,
  useTrendingItems,
} from './dashboard.queries';
