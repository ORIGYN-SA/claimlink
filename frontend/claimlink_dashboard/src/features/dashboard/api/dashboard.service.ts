/**
 * Dashboard Service Layer
 *
 * Abstracts dashboard data access for easy backend swap.
 * Currently uses aggregated mock data from various sources.
 * TODO: Replace with ClaimLink backend API when ready.
 */

export interface DashboardStats {
  totalCertificates: number;
  totalNFTs: number;
  totalCollections: number;
  totalCampaigns: number;
  activeCampaigns: number;
  recentActivity: number;
}

export interface RecentActivity {
  id: string;
  type: 'certificate' | 'nft' | 'collection' | 'campaign';
  title: string;
  description: string;
  timestamp: string;
  imageUrl?: string;
}

export interface QuickStat {
  label: string;
  value: number;
  change: number; // Percentage change
  trend: 'up' | 'down' | 'neutral';
}

export class DashboardService {
  /**
   * Get dashboard overview statistics
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.get_dashboard_stats();

    // Mock implementation
    return Promise.resolve({
      totalCertificates: 156,
      totalNFTs: 892,
      totalCollections: 24,
      totalCampaigns: 12,
      activeCampaigns: 5,
      recentActivity: 47,
    });
  }

  /**
   * Get recent activity across all features
   */
  static async getRecentActivity(_limit = 10): Promise<RecentActivity[]> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.get_recent_activity(limit);

    // Mock implementation
    return Promise.resolve([
      {
        id: '1',
        type: 'certificate',
        title: 'The midsummer Night Dream',
        description: 'Certificate minted',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        imageUrl:
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
      },
      {
        id: '2',
        type: 'campaign',
        title: 'Summer NFT Drop',
        description: 'Campaign launched',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: '3',
        type: 'collection',
        title: 'Digital Art Collection',
        description: 'Collection created',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        imageUrl:
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
      },
    ]);
  }

  /**
   * Get quick statistics for dashboard cards
   */
  static async getQuickStats(): Promise<QuickStat[]> {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.get_quick_stats();

    // Mock implementation
    return Promise.resolve([
      {
        label: 'Total Minted',
        value: 1048,
        change: 12.5,
        trend: 'up',
      },
      {
        label: 'Active Campaigns',
        value: 5,
        change: -2.3,
        trend: 'down',
      },
      {
        label: 'Collections',
        value: 24,
        change: 8.1,
        trend: 'up',
      },
      {
        label: 'This Month',
        value: 156,
        change: 0,
        trend: 'neutral',
      },
    ]);
  }

  /**
   * Get trending items (certificates or NFTs)
   */
  static async getTrendingItems(
    _limit = 5
  ): Promise<
    Array<{
      id: string;
      title: string;
      imageUrl: string;
      views: number;
      mints: number;
    }>
  > {
    // TODO: Replace with backend API call
    // const actor = Actor.createActor(idlFactory, { agent, canisterId });
    // return await actor.get_trending_items(limit);

    // Mock implementation
    return Promise.resolve([
      {
        id: '1',
        title: 'The midsummer Night Dream',
        imageUrl:
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
        views: 1234,
        mints: 45,
      },
      {
        id: '2',
        title: 'Urban Landscape Series',
        imageUrl:
          'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
        views: 987,
        mints: 32,
      },
    ]);
  }
}
