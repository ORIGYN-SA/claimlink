// ============================================================================
// Components
// ============================================================================

export { DashboardPage } from "./components/dashboard-page"
export { StatCard } from "./components/stat-card"
export { WelcomeCard } from "./components/welcome-card"
export { FeedCard } from "./components/feed-card"
export { MintCard } from "./components/mint-card"
export { CertificateListCard } from "./components/certificate-list-card"

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
