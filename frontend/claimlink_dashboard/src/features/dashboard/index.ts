// ============================================================================
// Pages
// ============================================================================

export { DashboardPage } from "./pages"

// ============================================================================
// Components
// ============================================================================

export * from "./components"

// ============================================================================
// API Layer
// ============================================================================

export { DashboardService } from './api/dashboard.service';
export type {
  DashboardStats,
  RecentActivity,
  QuickStat,
} from './api/dashboard.service';

export {
  dashboardKeys,
  useDashboardStats,
  useRecentActivity,
  useQuickStats,
  useTrendingItems,
} from './api/dashboard.queries';

// ============================================================================
// Types
// ============================================================================

export type * from "./types/dashboard.types"
