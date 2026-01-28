# Account Feature

The account feature handles user account management, company settings, and transaction history.

## Purpose

- View and manage user profile information
- Configure company settings
- View token balances (ICP, OGY, GLDT, ckUSDT)
- Browse transaction history across ledgers
- Manage team members (future)

## File Structure

```
account/
├── api/
│   ├── account.service.ts        # Account operations
│   └── account.queries.ts        # React Query hooks
├── components/
│   ├── overview-cards.tsx                 # Balance cards
│   ├── company-recap-card.tsx             # Company summary
│   ├── filter-controls.tsx                # Transaction filters
│   ├── transaction-table.tsx              # Transaction list
│   └── transaction-history.tsx            # History component
├── pages/
│   ├── account-page.tsx                   # Main account page
│   ├── edit-company-page.tsx              # Company settings
│   ├── edit-user-page.tsx                 # User profile edit
│   ├── create-user-page.tsx               # Add team member
│   ├── transaction-history-page.tsx       # Full history view
│   └── transaction-detail-page.tsx        # Single transaction
├── atoms/
│   └── account.atom.ts                    # Account state
├── types/
│   └── account.types.ts                   # Type definitions
└── utils/
    └── account-utils.ts                   # Helper functions
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ACCOUNT PAGE LOAD                                       │
│                                                                             │
│  Parallel data fetching:                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  useMultiTokenBalance()    → ICP, OGY, GLDT, ckUSDT balances         │ │
│  │  useAccountTransactions()  → Recent transactions                     │ │
│  │  useTokenPrices()          → USD conversion rates                    │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      LEDGER QUERIES                                          │
│                                                                             │
│  For each token ledger:                                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  1. Get account identifier from principal                             │ │
│  │  2. Query ledger canister for balance                                 │ │
│  │  3. Query index canister for transactions                             │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Token Ledgers:                                                             │
│  - ICP:    ryjl3-tyaaa-aaaaa-aaaba-cai                                     │
│  - GLDT:   6c7su-kiaaa-aaaar-qaira-cai                                     │
│  - OGY:    (from env)                                                       │
│  - ckUSDT: xevnm-gaaaa-aaaar-qafnq-cai                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Types

### Account Types (`types/account.types.ts`)

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  title: string;
  access: string[];      // Permission roles
  lastActive: string;
  avatar: string;
}

interface AccountOverview {
  accountId: string;     // Derived from principal
  balance: number;
  balanceInUSD?: number;
  currency: string;      // Token symbol
}

interface LedgerTransaction {
  id: string;
  type: 'send' | 'receive' | 'mint' | 'burn';
  amount: bigint;
  fee?: bigint;
  from: string | null;
  to: string | null;
  timestamp: Date;
  memo?: string;
  blockIndex: bigint;
}

interface DisplayTransaction extends LedgerTransaction {
  formattedAmount: string;
  formattedAmountUSD?: string;
  displayCategory: string;
  displayDate: string;
}

interface TransactionFilters {
  token: 'all' | 'ICP' | 'OGY' | 'GLDT' | 'ckUSDT';
  type: 'all' | 'send' | 'receive';
  dateRange?: {
    start: Date;
    end: Date;
  };
}
```

### Token Configuration

```typescript
interface TokenConfig {
  symbol: string;
  name: string;
  decimals: number;
  ledgerCanisterId: string;
  indexCanisterId?: string;
  logo: string;
}

const SUPPORTED_TOKENS: TokenConfig[] = [
  {
    symbol: 'ICP',
    name: 'Internet Computer',
    decimals: 8,
    ledgerCanisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
    indexCanisterId: 'qhbym-qaaaa-aaaaa-aaafq-cai',
    logo: '/tokens/icp.svg',
  },
  {
    symbol: 'OGY',
    name: 'ORIGYN',
    decimals: 8,
    ledgerCanisterId: getCanisterId('ogyLedger'),
    indexCanisterId: getCanisterId('ogyIndex'),
    logo: '/tokens/ogy.svg',
  },
  {
    symbol: 'GLDT',
    name: 'Gold Token',
    decimals: 8,
    ledgerCanisterId: '6c7su-kiaaa-aaaar-qaira-cai',
    indexCanisterId: '7vojr-tyaaa-aaaar-qairq-cai',
    logo: '/tokens/gldt.svg',
  },
  {
    symbol: 'ckUSDT',
    name: 'Chain-Key USDT',
    decimals: 6,
    ledgerCanisterId: 'xevnm-gaaaa-aaaar-qafnq-cai',
    logo: '/tokens/ckusdt.svg',
  },
];
```

## Service Layer

### AccountService (`api/account.service.ts`)

```typescript
export class AccountService {
  static async getBalance(
    agent: Agent,
    tokenConfig: TokenConfig
  ): Promise<bigint> {
    const actor = createCanisterActor<ICRC1Ledger>(
      agent,
      tokenConfig.ledgerCanisterId,
      icrc1IdlFactory
    );

    const account = {
      owner: agent.getPrincipal(),
      subaccount: [],
    };

    return actor.icrc1_balance_of(account);
  }

  static async getTransactions(
    agent: Agent,
    tokenConfig: TokenConfig,
    start?: bigint,
    length?: bigint
  ): Promise<LedgerTransaction[]> {
    if (!tokenConfig.indexCanisterId) {
      return [];
    }

    const actor = createCanisterActor<ICRC1Index>(
      agent,
      tokenConfig.indexCanisterId,
      icrc1IndexIdlFactory
    );

    const account = {
      owner: agent.getPrincipal(),
      subaccount: [],
    };

    const result = await actor.get_account_transactions({
      account,
      start: start ? [start] : [],
      max_results: length ?? 100n,
    });

    if ('Err' in result) {
      throw new Error(`Failed to fetch transactions: ${result.Err}`);
    }

    return result.Ok.transactions.map(parseTransaction);
  }

  static formatBalance(
    balance: bigint,
    decimals: number
  ): string {
    const divisor = BigInt(10 ** decimals);
    const whole = balance / divisor;
    const fraction = balance % divisor;

    return `${whole}.${fraction.toString().padStart(decimals, '0')}`;
  }
}
```

## Shared Hooks

Several hooks are shared across the application for token operations.

### useFetchLedgerBalance (`shared/hooks/useFetchLedgerBalance.ts`)

```typescript
export function useFetchLedgerBalance(
  tokenSymbol: string,
  options?: { enabled?: boolean }
) {
  const { authenticatedAgent, principalId } = useAuthState();
  const tokenConfig = SUPPORTED_TOKENS.find((t) => t.symbol === tokenSymbol);

  return useQuery({
    queryKey: ['ledger', 'balance', tokenSymbol, principalId],
    queryFn: async () => {
      if (!tokenConfig) throw new Error(`Unknown token: ${tokenSymbol}`);
      const balance = await AccountService.getBalance(
        authenticatedAgent!,
        tokenConfig
      );
      return {
        raw: balance,
        formatted: AccountService.formatBalance(balance, tokenConfig.decimals),
      };
    },
    enabled: !!authenticatedAgent && !!tokenConfig && options?.enabled !== false,
  });
}
```

### useMultiTokenBalance (`shared/hooks/useMultiTokenBalance.ts`)

```typescript
export function useMultiTokenBalance() {
  const { authenticatedAgent, principalId } = useAuthState();

  return useQuery({
    queryKey: ['ledger', 'balance', 'all', principalId],
    queryFn: async () => {
      const balances: Record<string, { raw: bigint; formatted: string }> = {};

      await Promise.all(
        SUPPORTED_TOKENS.map(async (token) => {
          try {
            const balance = await AccountService.getBalance(
              authenticatedAgent!,
              token
            );
            balances[token.symbol] = {
              raw: balance,
              formatted: AccountService.formatBalance(balance, token.decimals),
            };
          } catch (error) {
            console.error(`Failed to fetch ${token.symbol} balance:`, error);
            balances[token.symbol] = { raw: 0n, formatted: '0' };
          }
        })
      );

      return balances;
    },
    enabled: !!authenticatedAgent,
    staleTime: 30 * 1000, // 30 seconds
  });
}
```

### useFetchAccountTransactions (`shared/hooks/useFetchAccountTransactions.ts`)

```typescript
export function useFetchAccountTransactions(
  tokenSymbol: string,
  limit: number = 20
) {
  const { authenticatedAgent, principalId } = useAuthState();
  const tokenConfig = SUPPORTED_TOKENS.find((t) => t.symbol === tokenSymbol);

  return useQuery({
    queryKey: ['ledger', 'transactions', tokenSymbol, principalId, limit],
    queryFn: () => AccountService.getTransactions(
      authenticatedAgent!,
      tokenConfig!,
      undefined,
      BigInt(limit)
    ),
    enabled: !!authenticatedAgent && !!tokenConfig?.indexCanisterId,
  });
}
```

### useFetchTokenPrice (`shared/hooks/useFetchTokenPrice.ts`)

```typescript
export function useFetchTokenPrice(tokenSymbol: string) {
  return useQuery({
    queryKey: ['token', 'price', tokenSymbol],
    queryFn: async () => {
      // Fetch from price oracle or DEX
      // Implementation depends on price source
      return { usd: 0 };
    },
    staleTime: 60 * 1000, // 1 minute
  });
}
```

## Components

### OverviewCards

```typescript
function OverviewCards() {
  const { data: balances, isLoading } = useMultiTokenBalance();

  if (isLoading) {
    return <BalancesSkeleton />;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {SUPPORTED_TOKENS.map((token) => (
        <Card key={token.symbol}>
          <CardHeader className="flex flex-row items-center gap-2">
            <img src={token.logo} alt={token.name} className="w-8 h-8" />
            <div>
              <CardTitle className="text-sm">{token.symbol}</CardTitle>
              <CardDescription>{token.name}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {balances?.[token.symbol]?.formatted ?? '0'}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### TransactionTable

```typescript
interface TransactionTableProps {
  transactions: DisplayTransaction[];
  isLoading: boolean;
}

function TransactionTable({ transactions, isLoading }: TransactionTableProps) {
  if (isLoading) {
    return <TransactionsSkeleton />;
  }

  if (transactions.length === 0) {
    return <EmptyState message="No transactions found" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>From/To</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell>
              <TransactionTypeBadge type={tx.type} />
            </TableCell>
            <TableCell>
              <span className={tx.type === 'receive' ? 'text-green-500' : ''}>
                {tx.type === 'receive' ? '+' : '-'}{tx.formattedAmount}
              </span>
            </TableCell>
            <TableCell>
              <TruncatedPrincipal
                value={tx.type === 'receive' ? tx.from : tx.to}
              />
            </TableCell>
            <TableCell>{tx.displayDate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### FilterControls

```typescript
interface FilterControlsProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
}

function FilterControls({ filters, onFiltersChange }: FilterControlsProps) {
  return (
    <div className="flex gap-4">
      <Select
        value={filters.token}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, token: value as TransactionFilters['token'] })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="All tokens" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All tokens</SelectItem>
          {SUPPORTED_TOKENS.map((token) => (
            <SelectItem key={token.symbol} value={token.symbol}>
              {token.symbol}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.type}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, type: value as TransactionFilters['type'] })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value="send">Sent</SelectItem>
          <SelectItem value="receive">Received</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

## Integration Points

### With Auth Feature

- Uses principal ID for account identification
- Uses authenticated agent for all ledger queries

### With Shared Hooks

- Balance and transaction hooks are in `shared/hooks/`
- Can be used by other features needing token information

## Known Issues / TODOs

1. **Price Oracle**: Token price fetching not fully implemented. Need to integrate with DEX or oracle.

2. **Pagination**: Transaction history fetches limited records. Need proper pagination.

3. **Company/Team Features**: Company settings and team management UI exists but not connected to backend.

4. **Index Canister**: ckUSDT may not have an index canister, limiting transaction history.

5. **Real-time Updates**: Balances become stale. Consider WebSocket or frequent polling.

## Usage Examples

### Account Page

```typescript
function AccountPage() {
  const { principalId } = useAuthState();
  const [filters, setFilters] = useState<TransactionFilters>({
    token: 'all',
    type: 'all',
  });

  return (
    <div className="space-y-6">
      <AccountHeader principalId={principalId} />

      <OverviewCards />

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <FilterControls filters={filters} onFiltersChange={setFilters} />
        </CardHeader>
        <CardContent>
          <TransactionHistory filters={filters} />
        </CardContent>
      </Card>
    </div>
  );
}
```

### Transaction Detail Page

```typescript
function TransactionDetailPage() {
  const { transactionId } = Route.useParams();
  const { data: transaction } = useTransaction(transactionId);

  return (
    <div>
      <h1>Transaction Details</h1>

      <dl>
        <dt>Type</dt>
        <dd><TransactionTypeBadge type={transaction.type} /></dd>

        <dt>Amount</dt>
        <dd>{transaction.formattedAmount}</dd>

        <dt>From</dt>
        <dd><PrincipalDisplay value={transaction.from} /></dd>

        <dt>To</dt>
        <dd><PrincipalDisplay value={transaction.to} /></dd>

        <dt>Timestamp</dt>
        <dd>{transaction.displayDate}</dd>

        <dt>Block Index</dt>
        <dd>{transaction.blockIndex.toString()}</dd>
      </dl>
    </div>
  );
}
```

## Related Documentation

- [Auth Feature](../../auth/docs/README.md)
- [State Management](../../../../docs/STATE-MANAGEMENT.md)
- [Architecture](../../../../docs/ARCHITECTURE.md)
