# Dashboard Feature

The dashboard feature provides an overview page showing statistics, recent activity, and quick actions.

## Purpose

- Display aggregated statistics (minted, pending, transferred certificates)
- Show recent certificate owners
- List recently minted and sent certificates
- Provide quick access to common actions

## File Structure

```
dashboard/
├── api/
│   ├── dashboard.service.ts      # Data fetching
│   └── dashboard.queries.ts      # React Query hooks
├── components/
│   ├── cards/
│   │   ├── stat-card.tsx                    # Individual stat display
│   │   ├── welcome-card.tsx                 # Welcome message
│   │   ├── mint-card.tsx                    # Quick mint action
│   │   ├── certificate-list-card.tsx        # Certificate list
│   │   └── feed-card.tsx                    # Activity feed
│   ├── sections/
│   │   ├── total-status-section.tsx         # Stats overview
│   │   ├── last-certificate-owners-section.tsx   # Recent owners
│   │   ├── last-minted-certificates-section.tsx  # Recent mints
│   │   └── last-sent-certificates-section.tsx    # Recent transfers
│   └── dashboard-header.tsx                 # Page header
├── pages/
│   └── dashboard-page.tsx                   # Main page
├── types/
│   └── dashboard.types.ts                   # Type definitions
└── utils/
    └── dashboard-utils.ts                   # Helper functions
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DASHBOARD PAGE LOAD                                     │
│                                                                             │
│  Multiple parallel queries:                                                 │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  useDashboardStats()         → Stats aggregation                      │ │
│  │  useRecentCertificates()     → Last minted certificates               │ │
│  │  useRecentTransfers()        → Last sent certificates                 │ │
│  │  useRecentOwners()           → Last certificate owners                │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DATA AGGREGATION                                        │
│                                                                             │
│  Sources:                                                                   │
│  - Collections (certificate counts per collection)                          │
│  - Certificates (metadata, status)                                          │
│  - Transaction history (transfers, mints)                                   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      RENDER DASHBOARD                                        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │  │  Minted  │  │ Awaiting │  │ In Wallet│  │Transferred│            │   │
│  │  │    42    │  │    5     │  │    15    │  │    22    │            │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │   │
│  │                                                                     │   │
│  │  ┌──────────────────────┐  ┌──────────────────────────────────┐    │   │
│  │  │  Recent Owners       │  │  Recently Minted                 │    │   │
│  │  │  - John Doe (1h ago) │  │  - Gold Certificate #42          │    │   │
│  │  │  - Jane Doe (2h ago) │  │  - Diamond Certificate #15       │    │   │
│  │  └──────────────────────┘  └──────────────────────────────────┘    │   │
│  │                                                                     │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │  Recently Sent                                                │  │   │
│  │  │  - Gold Certificate #38 → xyz-abc...                         │  │   │
│  │  │  - Diamond Certificate #12 → def-ghi...                      │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Types

### Dashboard Types (`types/dashboard.types.ts`)

```typescript
interface DashboardStats {
  mintedCertificates: number;
  awaitingCertificates: number;
  certificatesInWallet: number;
  transferredCertificates: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentOwners: RecentOwner[];
  recentMints: RecentCertificate[];
  recentTransfers: RecentTransfer[];
}

interface RecentOwner {
  name: string;
  id: string;           // Principal ID
  date: string;         // ISO date
  avatarUrl?: string;
}

interface RecentCertificate {
  title: string;
  status: TokenStatus;
  date?: string;
  imageUrl?: string;
  collectionId: string;
  tokenId: string;
}

interface RecentTransfer {
  certificateTitle: string;
  recipientId: string;  // Principal ID
  date: string;
  collectionId: string;
  tokenId: string;
}
```

## Service Layer

### DashboardService (`api/dashboard.service.ts`)

```typescript
export class DashboardService {
  static async getStats(agent: Agent): Promise<DashboardStats> {
    // Aggregate from multiple sources
    const collections = await CollectionsService.getCollectionsByOwner(
      agent,
      agent.getPrincipal()
    );

    let minted = 0;
    let awaiting = 0;
    let inWallet = 0;
    let transferred = 0;

    for (const collection of collections) {
      const tokens = await CertificatesService.getCertificatesOf(
        agent,
        collection.canister_id!
      );

      for (const token of tokens) {
        minted++;
        if (token.status === 'pending') awaiting++;
        if (token.ownerPrincipal === agent.getPrincipal().toText()) inWallet++;
        // Count transfers from history
      }
    }

    return {
      mintedCertificates: minted,
      awaitingCertificates: awaiting,
      certificatesInWallet: inWallet,
      transferredCertificates: transferred,
    };
  }

  static async getRecentMints(
    agent: Agent,
    limit: number = 5
  ): Promise<RecentCertificate[]> {
    // Fetch recent mints across collections
    const collections = await CollectionsService.getCollectionsByOwner(
      agent,
      agent.getPrincipal()
    );

    const allCertificates: RecentCertificate[] = [];

    for (const collection of collections) {
      const tokens = await CertificatesService.getCertificatesOf(
        agent,
        collection.canister_id!
      );
      allCertificates.push(
        ...tokens.map((t) => ({
          title: t.name,
          status: t.status,
          date: t.createdAt,
          imageUrl: t.imageUrl,
          collectionId: collection.canister_id!,
          tokenId: t.tokenId!,
        }))
      );
    }

    // Sort by date and take limit
    return allCertificates
      .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
      .slice(0, limit);
  }

  static async getRecentOwners(
    agent: Agent,
    limit: number = 5
  ): Promise<RecentOwner[]> {
    // Get recent transfer recipients from history
    // Implementation depends on how owner history is tracked
    return [];
  }
}
```

## React Query Hooks

### Query Hooks (`api/dashboard.queries.ts`)

```typescript
// Key factory
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  recentMints: () => [...dashboardKeys.all, 'recentMints'] as const,
  recentTransfers: () => [...dashboardKeys.all, 'recentTransfers'] as const,
  recentOwners: () => [...dashboardKeys.all, 'recentOwners'] as const,
};

// Hooks
export function useDashboardStats() {
  const { authenticatedAgent } = useAuthState();

  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => DashboardService.getStats(authenticatedAgent!),
    enabled: !!authenticatedAgent,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useRecentMints(limit: number = 5) {
  const { authenticatedAgent } = useAuthState();

  return useQuery({
    queryKey: dashboardKeys.recentMints(),
    queryFn: () => DashboardService.getRecentMints(authenticatedAgent!, limit),
    enabled: !!authenticatedAgent,
    staleTime: 60 * 1000,
  });
}

export function useRecentTransfers(limit: number = 5) {
  const { authenticatedAgent } = useAuthState();

  return useQuery({
    queryKey: dashboardKeys.recentTransfers(),
    queryFn: () => DashboardService.getRecentTransfers(authenticatedAgent!, limit),
    enabled: !!authenticatedAgent,
    staleTime: 60 * 1000,
  });
}
```

## Components

### StatCard

```typescript
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend.direction === 'up' ? '+' : '-'}{trend.value}%
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

### TotalStatusSection

```typescript
function TotalStatusSection() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return <StatsSkeleton />;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        title="Minted Certificates"
        value={stats?.mintedCertificates ?? 0}
        icon={<CertificateIcon />}
      />
      <StatCard
        title="Awaiting"
        value={stats?.awaitingCertificates ?? 0}
        icon={<ClockIcon />}
      />
      <StatCard
        title="In Wallet"
        value={stats?.certificatesInWallet ?? 0}
        icon={<WalletIcon />}
      />
      <StatCard
        title="Transferred"
        value={stats?.transferredCertificates ?? 0}
        icon={<SendIcon />}
      />
    </div>
  );
}
```

### LastMintedCertificatesSection

```typescript
function LastMintedCertificatesSection() {
  const { data: certificates, isLoading } = useRecentMints(5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Minted</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <CertificateListSkeleton />
        ) : (
          <ul className="space-y-2">
            {certificates?.map((cert) => (
              <li key={`${cert.collectionId}-${cert.tokenId}`}>
                <Link to={`/mint_certificate/${cert.collectionId}/${cert.tokenId}`}>
                  <CertificateListItem certificate={cert} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
```

## Integration Points

### With Certificates Feature

- Fetches certificate data for stats and lists
- Links to certificate detail pages

### With Collections Feature

- Aggregates data across all user collections

### With Auth Feature

- Uses authenticated agent for all queries
- Filters data to current user's principal

## Known Issues / TODOs

1. **Performance**: Multiple queries to multiple collections. Consider backend aggregation endpoint.

2. **Real-time Updates**: Stats become stale. Consider WebSocket or polling for live updates.

3. **Empty States**: Need better empty state designs when user has no data.

4. **Caching Strategy**: Current stale time is 1 minute. May need adjustment based on usage patterns.

5. **Owner History**: `getRecentOwners` implementation incomplete. Needs transaction history parsing.

## Usage Example

### Dashboard Page

```typescript
function DashboardPage() {
  const { principalId } = useAuthState();

  return (
    <div className="space-y-6">
      <WelcomeCard userName={principalId} />

      <TotalStatusSection />

      <div className="grid grid-cols-2 gap-6">
        <LastMintedCertificatesSection />
        <LastSentCertificatesSection />
      </div>

      <LastCertificateOwnersSection />
    </div>
  );
}
```

## Related Documentation

- [Certificates Feature](../../certificates/docs/README.md)
- [Collections Feature](../../collections/docs/README.md)
- [Architecture](../../../../docs/ARCHITECTURE.md)
