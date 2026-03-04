# Campaigns Feature

The campaigns feature manages certificate distribution campaigns, allowing users to create and monitor campaigns for claiming certificates.

## Purpose

- Create campaigns to distribute certificates from collections
- Configure campaign parameters (duration, max claims, etc.)
- Monitor campaign status and claim progress
- View claimers and claim history

## File Structure

```
campaigns/
├── api/
│   ├── campaigns.service.ts      # Campaign operations
│   └── campaigns.queries.ts      # React Query hooks
├── components/
│   ├── steps/
│   │   ├── select-collection-step.tsx    # Collection selection
│   │   └── configure-campaign-step.tsx   # Campaign configuration
│   ├── campaign-card.tsx                 # List item display
│   └── campaign-status-badge.tsx         # Status indicator
├── pages/
│   ├── campaigns-page.tsx                # List view
│   ├── new-campaign-page.tsx             # Creation wizard
│   ├── campaign-detail-page.tsx          # Detail view
│   └── campaign-claimers-page.tsx        # Claimers list
├── atoms/
│   ├── campaign-creator.atom.ts          # Creation state
│   └── campaign-filters.atom.ts          # Filter state
├── types/
│   └── campaign.types.ts                 # Type definitions
└── utils/
    └── campaign-utils.ts                 # Helper functions
```

## Data Flow Diagram

### Campaign Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CAMPAIGN CREATION                                       │
│                                                                             │
│  User Flow:                                                                 │
│  1. Select collection (with available certificates)                        │
│  2. Configure campaign:                                                     │
│     - Name & description                                                    │
│     - Start date (optional)                                                 │
│     - Duration / end date                                                   │
│     - Max claims (optional)                                                 │
│  3. Submit and create campaign                                              │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CAMPAIGN STATES                                         │
│                                                                             │
│  ┌────────┐   Start    ┌────────┐   All claimed   ┌──────────┐             │
│  │  Draft │──────────▶│  Ready │────────────────▶│ Finished │             │
│  └────────┘   date     └────────┘   or expired    └──────────┘             │
│       │                    │                                                │
│       │                    │  Active period                                 │
│       │                    ▼                                                │
│       │               ┌────────┐                                            │
│       │               │ Active │                                            │
│       │               └────────┘                                            │
│       │                    │                                                │
│       │                    │  Manual close                                  │
│       ▼                    ▼                                                │
│  ┌────────┐           ┌────────┐                                            │
│  │ Closed │◀──────────│ Closed │                                            │
│  └────────┘           └────────┘                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Claim Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      USER CLAIMS CERTIFICATE                                 │
│                                                                             │
│  1. User accesses claim link                                                │
│  2. Campaign validates:                                                     │
│     - Is campaign active?                                                   │
│     - Has user already claimed?                                             │
│     - Are certificates available?                                           │
│  3. If valid:                                                               │
│     - Transfer certificate to user                                          │
│     - Record claim                                                          │
│     - Update claim count                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Types

### Campaign Types (`types/campaign.types.ts`)

```typescript
type CampaignStatus = 'Active' | 'Ready' | 'Finished' | 'Draft' | 'Closed';

type CampaignTimer = 'Urgent' | 'Ongoing' | 'Starting Soon' | 'Finished';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  collectionId: string;

  // Progress
  claimedCount: number;
  totalCount: number;

  // Status
  status: CampaignStatus;
  timerText?: string;
  timerType?: CampaignTimer;

  // Dates
  createdAt: string;
  startDate?: string;
  endDate?: string;

  // Configuration
  maxClaims?: number;
  claimDuration?: number;     // Duration in seconds
}

interface CreateCampaignInput {
  name: string;
  description?: string;
  collectionId: string;
  maxClaims?: number;
  claimDuration: number;       // Duration in seconds
  startDate?: string;          // ISO date string
}

interface Claimer {
  id: string;
  principalId: string;
  claimedAt: string;
  certificateId: string;
}
```

### Timer Calculation

```typescript
function getCampaignTimerType(campaign: Campaign): CampaignTimer {
  if (campaign.status === 'Finished' || campaign.status === 'Closed') {
    return 'Finished';
  }

  if (campaign.startDate) {
    const startDate = new Date(campaign.startDate);
    if (startDate > new Date()) {
      return 'Starting Soon';
    }
  }

  if (campaign.endDate) {
    const endDate = new Date(campaign.endDate);
    const now = new Date();
    const hoursRemaining = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursRemaining < 24) {
      return 'Urgent';
    }
  }

  return 'Ongoing';
}

function formatCampaignTimer(campaign: Campaign): string {
  const timerType = getCampaignTimerType(campaign);

  switch (timerType) {
    case 'Starting Soon':
      return `Starts ${formatRelativeDate(campaign.startDate!)}`;
    case 'Urgent':
      return `Ends ${formatRelativeDate(campaign.endDate!)}`;
    case 'Ongoing':
      return campaign.endDate
        ? `Ends ${formatDate(campaign.endDate)}`
        : 'No end date';
    case 'Finished':
      return 'Campaign ended';
  }
}
```

## Service Layer

### CampaignsService (`api/campaigns.service.ts`)

| Method | Purpose | Returns |
|--------|---------|---------|
| `getCampaigns(agent)` | List all campaigns | `Campaign[]` |
| `getCampaignsByOwner(agent, owner)` | User's campaigns | `Campaign[]` |
| `getCampaign(agent, campaignId)` | Single campaign | `Campaign` |
| `createCampaign(agent, input)` | Create new campaign | `{ campaign_id: bigint }` |
| `updateCampaign(agent, campaignId, input)` | Update campaign | `void` |
| `closeCampaign(agent, campaignId)` | Close campaign | `void` |
| `getCampaignClaimers(agent, campaignId)` | Get claimers list | `Claimer[]` |

### Service Implementation Example

```typescript
export class CampaignsService {
  static async createCampaign(
    agent: Agent,
    input: CreateCampaignInput
  ): Promise<{ campaign_id: bigint }> {
    const actor = createCanisterActor<ClaimLinkService>(
      agent,
      getCanisterId('claimlink'),
      claimlinkIdlFactory
    );

    const result = await actor.create_campaign({
      name: input.name,
      description: input.description ? [input.description] : [],
      collection_id: BigInt(input.collectionId),
      max_claims: input.maxClaims ? [BigInt(input.maxClaims)] : [],
      claim_duration: BigInt(input.claimDuration),
      start_date: input.startDate
        ? [BigInt(new Date(input.startDate).getTime() * 1_000_000)]
        : [],
    });

    if ('Err' in result) {
      throw new Error(formatCampaignError(result.Err));
    }

    return { campaign_id: result.Ok.campaign_id };
  }

  static async getCampaignClaimers(
    agent: Agent,
    campaignId: string
  ): Promise<Claimer[]> {
    const actor = createCanisterActor<ClaimLinkService>(
      agent,
      getCanisterId('claimlink'),
      claimlinkIdlFactory
    );

    const result = await actor.get_campaign_claimers(BigInt(campaignId));

    return result.map((c) => ({
      id: c.claim_id.toString(),
      principalId: c.claimer.toText(),
      claimedAt: new Date(Number(c.claimed_at) / 1_000_000).toISOString(),
      certificateId: c.certificate_id.toString(),
    }));
  }
}
```

## React Query Hooks

### Query Hooks (`api/campaigns.queries.ts`)

```typescript
// Key factory
export const campaignsKeys = {
  all: ['campaigns'] as const,
  lists: () => [...campaignsKeys.all, 'list'] as const,
  list: (filters: CampaignFilters) => [...campaignsKeys.lists(), filters] as const,
  details: () => [...campaignsKeys.all, 'detail'] as const,
  detail: (id: string) => [...campaignsKeys.details(), id] as const,
  claimers: (id: string) => [...campaignsKeys.detail(id), 'claimers'] as const,
};

// Hooks
useCampaigns()                      // All campaigns
useMyCampaigns()                    // Current user's campaigns
useCampaign(campaignId)             // Single campaign
useCampaignClaimers(campaignId)     // Claimers list
```

### Mutation Hooks

```typescript
useCreateCampaign()                 // Create new campaign
useUpdateCampaign()                 // Update campaign
useCloseCampaign()                  // Close campaign
```

### Hook Implementations

```typescript
export function useCampaign(campaignId: string) {
  const { authenticatedAgent } = useAuthState();

  return useQuery({
    queryKey: campaignsKeys.detail(campaignId),
    queryFn: () => CampaignsService.getCampaign(authenticatedAgent!, campaignId),
    enabled: !!authenticatedAgent && !!campaignId,
    refetchInterval: 30000, // Refresh every 30s for status updates
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  const { authenticatedAgent } = useAuthState();

  return useMutation({
    mutationFn: (input: CreateCampaignInput) =>
      CampaignsService.createCampaign(authenticatedAgent!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignsKeys.all });
    },
  });
}

export function useCampaignClaimers(campaignId: string) {
  const { authenticatedAgent } = useAuthState();

  return useQuery({
    queryKey: campaignsKeys.claimers(campaignId),
    queryFn: () => CampaignsService.getCampaignClaimers(authenticatedAgent!, campaignId),
    enabled: !!authenticatedAgent && !!campaignId,
  });
}
```

## State Management

### Creator Atom (`atoms/campaign-creator.atom.ts`)

```typescript
interface CampaignCreatorState {
  step: number;
  selectedCollectionId: string | null;
  formData: Partial<CreateCampaignInput>;
  error: string | null;
}

type CampaignCreatorAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'SELECT_COLLECTION'; collectionId: string }
  | { type: 'SET_FORM_DATA'; data: Partial<CreateCampaignInput> }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'RESET' };
```

### Filters Atom (`atoms/campaign-filters.atom.ts`)

```typescript
interface CampaignFilters {
  search: string;
  status: CampaignStatus | 'all';
  sortBy: 'createdAt' | 'name' | 'claimedCount';
  sortOrder: 'asc' | 'desc';
}
```

## Components

### CampaignCard

```typescript
interface CampaignCardProps {
  campaign: Campaign;
}

function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = (campaign.claimedCount / campaign.totalCount) * 100;

  return (
    <Card>
      <CardHeader>
        <img src={campaign.imageUrl} alt={campaign.name} />
        <CampaignStatusBadge status={campaign.status} />
      </CardHeader>
      <CardContent>
        <h3>{campaign.name}</h3>
        <ProgressBar value={progress} />
        <p>{campaign.claimedCount} / {campaign.totalCount} claimed</p>
        <CampaignTimer campaign={campaign} />
      </CardContent>
    </Card>
  );
}
```

### CampaignStatusBadge

```typescript
function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const variants: Record<CampaignStatus, BadgeVariant> = {
    Active: 'success',
    Ready: 'info',
    Draft: 'secondary',
    Finished: 'default',
    Closed: 'destructive',
  };

  return <Badge variant={variants[status]}>{status}</Badge>;
}
```

## Integration Points

### With Collections Feature

- Campaigns are linked to collections via `collectionId`
- Collection must have available certificates for campaign
- Campaign uses collection's image as default

### With Certificates Feature

- Campaigns distribute certificates from collections
- Claimed certificates are transferred to claimers
- Campaign tracks which certificates have been claimed

## Known Issues / TODOs

1. **Claim Link Generation**: The claim link/URL generation is not yet implemented. Need to define the claiming flow.

2. **Certificate Selection**: Currently assumes all collection certificates are available. May need certificate selection/allocation.

3. **Claim Validation**: Server-side validation exists, but client should also validate before attempting claim.

4. **Campaign Editing**: Limited editing after creation. Consider which fields should be editable.

5. **Campaign Analytics**: Basic claim count only. Consider adding more analytics (claim rate, geographic distribution, etc.).

## Usage Examples

### Creating a Campaign

```typescript
function NewCampaignPage() {
  const [state, dispatch] = useAtom(campaignCreatorAtom);
  const createMutation = useCreateCampaign();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const result = await createMutation.mutateAsync({
      name: state.formData.name!,
      description: state.formData.description,
      collectionId: state.selectedCollectionId!,
      claimDuration: state.formData.claimDuration!,
      maxClaims: state.formData.maxClaims,
      startDate: state.formData.startDate,
    });

    navigate({ to: `/campaigns/${result.campaign_id}` });
  };

  return (
    <WizardSteps currentStep={state.step}>
      <SelectCollectionStep
        onSelect={(id) => {
          dispatch({ type: 'SELECT_COLLECTION', collectionId: id });
          dispatch({ type: 'SET_STEP', step: 1 });
        }}
      />
      <ConfigureCampaignStep
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
      />
    </WizardSteps>
  );
}
```

### Viewing Campaign Details

```typescript
function CampaignDetailPage() {
  const { campaignId } = Route.useParams();
  const { data: campaign, isLoading } = useCampaign(campaignId);
  const { data: claimers } = useCampaignClaimers(campaignId);

  if (isLoading) return <Spinner />;

  return (
    <div>
      <CampaignHeader campaign={campaign} />

      <Tabs>
        <TabPanel value="overview">
          <CampaignStats campaign={campaign} />
          <CampaignProgress campaign={campaign} />
        </TabPanel>

        <TabPanel value="claimers">
          <ClaimersTable claimers={claimers || []} />
        </TabPanel>
      </Tabs>
    </div>
  );
}
```

### Filtering Campaigns

```typescript
function CampaignsPage() {
  const { data: campaigns } = useMyCampaigns();
  const [filters] = useAtom(campaignFiltersAtom);

  const filteredCampaigns = useMemo(() => {
    if (!campaigns) return [];

    return campaigns.filter((c) => {
      if (filters.status !== 'all' && c.status !== filters.status) {
        return false;
      }
      if (filters.search && !c.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [campaigns, filters]);

  return (
    <div>
      <CampaignFilters />
      <div className="grid grid-cols-3 gap-4">
        {filteredCampaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}
```

## Related Documentation

- [Collections Feature](../../collections/docs/README.md)
- [Certificates Feature](../../certificates/docs/README.md)
- [Architecture](../../../../docs/ARCHITECTURE.md)
