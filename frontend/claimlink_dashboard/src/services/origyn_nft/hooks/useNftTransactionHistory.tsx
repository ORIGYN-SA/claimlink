import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import { OrigynNftService } from '../api/origyn-nft.service';
import type { CertificateEventsData } from '@/features/certificates/components/certificate-events';
import type { CertificateLedgerData, LedgerTransaction } from '@/features/certificates/components/certificate-ledger';
import type { ICRC3Value } from '../interfaces';

interface NftTransactionHistoryResult {
  eventsData: CertificateEventsData;
  ledgerData: CertificateLedgerData;
}

/**
 * Hook to fetch and parse ICRC3 transaction history for an NFT
 * Returns both events and ledger data
 */
export const useNftTransactionHistory = (
  collectionCanisterId: string,
  tokenId: string
) => {
  const { authenticatedAgent } = useAuth();

  return useQuery({
    queryKey: ['nft-transaction-history', collectionCanisterId, tokenId],
    queryFn: async (): Promise<NftTransactionHistoryResult> => {
      if (!authenticatedAgent) {
        return {
          eventsData: { events: [] },
          ledgerData: { transactions: [] },
        };
      }

      console.log('[useNftTransactionHistory] Fetching history for token:', {
        collectionCanisterId,
        tokenId,
      });

      // Fetch last 100 blocks (adjust as needed)
      const blocksResult = await OrigynNftService.getTransactionBlocks(
        authenticatedAgent,
        collectionCanisterId,
        0n,
        100n
      );

      console.log('[useNftTransactionHistory] Blocks fetched:', {
        total_blocks: blocksResult.blocks.length,
        log_length: blocksResult.log_length.toString(),
      });

      // Parse blocks into events and transactions
      const events: CertificateEventsData['events'] = [];
      const transactions: LedgerTransaction[] = [];

      for (const blockWithId of blocksResult.blocks) {
        const block = blockWithId.block;
        const blockId = blockWithId.id;

        // Parse block as Map
        if ('Map' in block) {
          const blockMap = new Map(block.Map);

          // Extract transaction details
          const txType = extractText(blockMap.get('btype'));
          const timestamp = extractNat(blockMap.get('ts'));
          const tx = blockMap.get('tx');

          // Only process blocks related to this token
          let relatedToToken = false;
          let fromPrincipal = '';
          let toPrincipal = '';
          let tokenIdInBlock = '';

          if (tx && 'Map' in tx) {
            const txMap = new Map(tx.Map);
            const tid = txMap.get('tid');

            if (tid) {
              tokenIdInBlock = extractNat(tid)?.toString() || '';
              relatedToToken = tokenIdInBlock === tokenId;
            }

            // Extract from/to
            const from = txMap.get('from');
            const to = txMap.get('to');

            if (from && 'Map' in from) {
              const fromMap = new Map(from.Map);
              const owner = fromMap.get('owner');
              if (owner && 'Blob' in owner) {
                fromPrincipal = blobToPrincipalText(owner.Blob);
              }
            }

            if (to && 'Map' in to) {
              const toMap = new Map(to.Map);
              const owner = toMap.get('owner');
              if (owner && 'Blob' in owner) {
                toPrincipal = blobToPrincipalText(owner.Blob);
              }
            }
          }

          if (!relatedToToken) continue;

          const date = timestamp ? formatTimestamp(timestamp) : 'Unknown date';
          const dateRelative = timestamp ? formatRelativeTime(timestamp) : 'Unknown time';

          // Create event
          let eventDescription = '';
          if (txType === '7mint') {
            eventDescription = `NFT minted to ${shortenPrincipal(toPrincipal)}`;
          } else if (txType === '7transfer') {
            eventDescription = `Transferred from ${shortenPrincipal(fromPrincipal)} to ${shortenPrincipal(toPrincipal)}`;
          } else if (txType === '7burn') {
            eventDescription = `NFT burned by ${shortenPrincipal(fromPrincipal)}`;
          } else {
            eventDescription = `Transaction: ${txType}`;
          }

          events.push({
            date,
            description: eventDescription,
          });

          // Create transaction for ledger
          let transactionType: LedgerTransaction['type'] = 'Transferred';
          if (txType === '7mint') {
            transactionType = 'Minted';
          } else if (txType === '7burn') {
            transactionType = 'Burned';
          }

          transactions.push({
            from: fromPrincipal || 'System',
            fromShort: shortenPrincipal(fromPrincipal || 'System'),
            fromVerified: false,
            to: toPrincipal || 'System',
            toShort: shortenPrincipal(toPrincipal || 'System'),
            toVerified: false,
            type: transactionType,
            hash: blockId.toString(),
            date: dateRelative,
          });
        }
      }

      console.log('[useNftTransactionHistory] Parsed data:', {
        events_count: events.length,
        transactions_count: transactions.length,
      });

      // Reverse to show most recent first
      events.reverse();
      transactions.reverse();

      return {
        eventsData: { events },
        ledgerData: { transactions },
      };
    },
    enabled: !!authenticatedAgent && !!collectionCanisterId && !!tokenId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Helper functions

function extractText(value: ICRC3Value | undefined): string {
  if (!value) return '';
  if ('Text' in value) return value.Text;
  return '';
}

function extractNat(value: ICRC3Value | undefined): bigint | null {
  if (!value) return null;
  if ('Nat' in value) return value.Nat;
  return null;
}

function blobToPrincipalText(blob: Uint8Array | number[]): string {
  try {
    // Convert blob to principal text representation
    const bytes = blob instanceof Uint8Array ? blob : new Uint8Array(blob);
    // Simple hex representation for now
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (e) {
    return 'Unknown';
  }
}

function shortenPrincipal(principal: string): string {
  if (principal.length <= 20) return principal;
  return `${principal.slice(0, 10)}...${principal.slice(-10)}`;
}

function formatTimestamp(nanoseconds: bigint): string {
  // ICRC3 timestamps are in nanoseconds
  const milliseconds = Number(nanoseconds / 1000000n);
  return new Date(milliseconds).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function formatRelativeTime(nanoseconds: bigint): string {
  const milliseconds = Number(nanoseconds / 1000000n);
  const now = Date.now();
  const diffMs = now - milliseconds;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}
