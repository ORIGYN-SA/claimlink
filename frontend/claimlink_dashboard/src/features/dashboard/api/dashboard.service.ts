import { Actor } from '@dfinity/agent';
import type { Agent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory } from '@services/claimlink';
import type { _SERVICE } from '@services/claimlink/interfaces';
import { CollectionsService } from '@/features/collections/api/collections.service';
import type { Certificate } from '@/features/certificates/types/certificate.types';
import {
  type EnrichedCertificate,
  transformNftDetailsToCertificate,
  sortCertificatesByMintedDate,
} from './transformers';

/**
 * Dashboard Service Layer
 *
 * Aggregates certificate data from multiple collections to provide dashboard statistics
 * and recent activity. Integrates with IC canisters for real-time data.
 */

const CLAIMLINK_CANISTER_ID =
  import.meta.env.VITE_CLAIMLINK_CANISTER_ID || '';

/**
 * Create a ClaimLink canister actor
 */
function createActor(agent: Agent): _SERVICE {
  if (!CLAIMLINK_CANISTER_ID) {
    throw new Error('VITE_CLAIMLINK_CANISTER_ID not set in environment');
  }

  return Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId: CLAIMLINK_CANISTER_ID,
  });
}

export interface DashboardStatusCounts {
  minted: {
    value: string;
    trend: string;
    trendColor: 'green' | 'red';
  };
  awaiting: {
    value: string;
    trend: string;
    trendColor: 'green' | 'red';
  };
  wallet: {
    value: string;
    trend: string;
    trendColor: 'green' | 'red';
  };
  transferred: {
    value: string;
    trend: string;
    trendColor: 'green' | 'red';
  };
}

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
   * Fetch all certificates across all user collections with full metadata
   * Returns enriched certificate data with owner information for status determination
   *
   * Note: In ClaimLink, NFTs and Certificates are technically the same thing.
   * Certificates are NFTs with the ORIGYN badge representing real-world assets.
   */
  static async getAllUserCertificatesWithDetails(
    agent: Agent,
    principalId: string
  ): Promise<EnrichedCertificate[]> {
    try {
      // Step 1: Get all user's collections
      const collectionsResult = await CollectionsService.listMyCollections(
        agent,
        0,
        100 // Reasonable limit for MVP
      );

      const collections = collectionsResult.collections;

      if (collections.length === 0) {
        return [];
      }

      // Step 2: Fetch NFT details from all collections in parallel
      const actor = createActor(agent);

      const certificatePromises = collections.map(async (collection) => {
        try {
          const collectionPrincipal = Principal.fromText(collection.id);

          // Get token IDs
          const tokenIds = await actor.get_collection_nfts({
            canister_id: collectionPrincipal,
            prev: [],
            take: [], // Get all tokens
          });

          if (tokenIds.length === 0) {
            return [];
          }

          // Get NFT details (metadata + owner)
          const nftDetails = await actor.get_nft_details({
            canister_id: collectionPrincipal,
            token_ids: tokenIds,
          });

          // Transform to Certificate type
          return nftDetails.map((details) =>
            transformNftDetailsToCertificate(
              details,
              collection.title,
              collection.id,
              principalId
            )
          );
        } catch (error) {
          console.error(
            `[Dashboard] Failed to fetch certificates from collection ${collection.id}:`,
            error
          );
          return [];
        }
      });

      const certificateArrays = await Promise.all(certificatePromises);
      return certificateArrays.flat();
    } catch (error) {
      console.error('[Dashboard] Failed to fetch user certificates:', error);
      throw new Error('Failed to load certificates. Please try again.');
    }
  }

  /**
   * Calculate certificate counts by status
   *
   * Status determination logic:
   * - "minted": total count of all certificates
   * - "inWallet": count where owner.principal === currentPrincipal
   * - "transferred": count where owner.principal !== currentPrincipal
   * - "awaiting": count where status is "Waiting"
   */
  static async getCertificateStatusCounts(
    agent: Agent,
    principalId: string
  ): Promise<DashboardStatusCounts> {
    try {
      const certificates = await this.getAllUserCertificatesWithDetails(
        agent,
        principalId
      );

      // Initialize counts
      let mintedCount = certificates.length;
      let awaitingCount = 0;
      let inWalletCount = 0;
      let transferredCount = 0;

      // Count by status
      for (const cert of certificates) {
        if (cert.status === 'Waiting') {
          awaitingCount++;
        }

        if (cert.status === 'Minted') {
          inWalletCount++;
        }

        if (cert.status === 'Transferred') {
          transferredCount++;
        }
      }

      // TODO: Calculate real trends from historical data
      // For now, use placeholder trends
      return {
        minted: {
          value: mintedCount.toString(),
          trend: '0%',
          trendColor: 'green',
        },
        awaiting: {
          value: awaitingCount.toString(),
          trend: '0%',
          trendColor: 'green',
        },
        wallet: {
          value: inWalletCount.toString(),
          trend: '0%',
          trendColor: 'green',
        },
        transferred: {
          value: transferredCount.toString(),
          trend: '0%',
          trendColor: 'green',
        },
      };
    } catch (error) {
      console.error('[Dashboard] Failed to get certificate status counts:', error);
      throw new Error('Failed to load certificate statistics. Please try again.');
    }
  }

  /**
   * Get most recently minted certificates
   * Sorted by minted_at timestamp from metadata
   */
  static async getRecentCertificates(
    agent: Agent,
    principalId: string,
    limit: number = 9
  ): Promise<Certificate[]> {
    try {
      const certificates = await this.getAllUserCertificatesWithDetails(
        agent,
        principalId
      );

      // Sort by minted timestamp (newest first)
      const sorted = sortCertificatesByMintedDate(certificates);

      // Take first `limit` certificates
      return sorted.slice(0, limit);
    } catch (error) {
      console.error('[Dashboard] Failed to get recent certificates:', error);
      throw new Error('Failed to load recent certificates. Please try again.');
    }
  }

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
