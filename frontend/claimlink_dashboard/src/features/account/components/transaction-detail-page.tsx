import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import type { Transaction } from '@/services/ledger-index/utils/interfaces';

interface TransactionDetailPageProps {
  transaction: Transaction;
  accountId?: string;
  balance?: number;
  currency?: string;
  onCopyTransactionId?: (id: string) => void;
  onCopyAccountId?: (id: string) => void;
}

export function TransactionDetailPage({
  transaction,
  accountId,
  balance,
  currency = 'OGY',
  onCopyTransactionId,
  onCopyAccountId,
}: TransactionDetailPageProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate({ to: '/account/transaction-history' });
  };

  const handleCopyTransactionId = () => {
    onCopyTransactionId?.(transaction.index.toString());
  };

  const handleCopyFromAddress = () => {
    if (transaction.from) {
      onCopyAccountId?.(transaction.from);
    }
  };

  const handleCopyToAddress = () => {
    if (transaction.to) {
      onCopyAccountId?.(transaction.to);
    }
  };

  const formatAmount = (amount: bigint | undefined, decimals: number = 8) => {
    if (!amount) return '0.00';
    return (Number(amount) / Math.pow(10, decimals)).toFixed(2);
  };

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return timestamp;
    }
  };

  const getTransactionTypeLabel = (kind: string) => {
    switch (kind.toLowerCase()) {
      case 'transfer':
        return 'Transfer';
      case 'mint':
        return 'Mint';
      case 'burn':
        return 'Burn';
      case 'approve':
        return 'Approve';
      default:
        return kind;
    }
  };

  const getStatusColor = () => {
    return 'bg-[#c7f2e0] text-[#061937]';
  };

  return (
    <div className="space-y-6">
      {/* Transaction Details Card */}
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white border border-[#e1e1e1] rounded-t-[20px] p-5">
          {/* Header with Index and Status */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <span className="text-base font-medium text-[#69737c]">Index:</span>
              <span className="text-lg font-semibold text-[#222526]">{transaction.index}</span>
            </div>
            <div className="bg-white border border-[#e1e1e1] rounded-full px-2 py-1 flex items-center gap-1">
              <div className="w-4 h-4 bg-[#69737c] rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-xs font-bold text-[#69737c]">{getTransactionTypeLabel(transaction.kind)}</span>
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${getStatusColor()}`}>
                completed
              </div>
            </div>
          </div>

          {/* Transaction ID */}
          <div className="space-y-1 mb-10">
            <h2 className="text-2xl font-semibold text-[#222526] leading-8">
              Transaction ID
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extralight text-[#222526] leading-8">
                {transaction.index.toString().padStart(8, '0')}...{transaction.index.toString().slice(-8)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyTransactionId}
                className="p-0 h-4 w-4 hover:bg-transparent"
              >
                <Copy className="h-4 w-4 text-[#222526]" />
              </Button>
            </div>
          </div>

          {/* From/To Addresses */}
          <div className="space-y-4 mb-10">
            {/* From Address */}
            {transaction.from && (
              <div className="bg-[#fcfafa] border border-[#e1e1e1] rounded-full px-1 py-2 flex items-center gap-2">
                <div className="w-10 h-10 bg-[#d0d3e0] rounded-full flex items-center justify-center ml-1">
                  <div className="w-4 h-4 bg-[#061937] rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-normal text-[#69737c]">From: </span>
                  <span className="text-xs font-bold text-[#222526]">
                    {transaction.from.slice(0, 8)}...{transaction.from.slice(-8)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyFromAddress}
                  className="p-0 h-4 w-4 hover:bg-transparent mr-1"
                >
                  <Copy className="h-4 w-4 text-[#222526]" />
                </Button>
              </div>
            )}

            {/* To Address */}
            {transaction.to && (
              <div className="bg-[#fcfafa] border border-[#e1e1e1] rounded-full px-1 py-2 flex items-center gap-2">
                <div className="w-10 h-10 bg-[#d0d3e0] rounded-full flex items-center justify-center ml-1">
                  <div className="w-4 h-4 bg-[#061937] rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-normal text-[#69737c]">To: </span>
                  <span className="text-xs font-bold text-[#222526]">
                    {transaction.to.slice(0, 8)}...{transaction.to.slice(-8)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyToAddress}
                  className="p-0 h-4 w-4 hover:bg-transparent mr-1"
                >
                  <Copy className="h-4 w-4 text-[#222526]" />
                </Button>
              </div>
            )}
          </div>

          {/* Amount and Fee */}
          <div className="border-t border-[#e1e1e1] pt-2 mb-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-[#222526] leading-6">Amount</h3>
                <p className="text-sm font-medium text-[#69737c]">Fee</p>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-4 h-4 bg-[#061937] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">O</span>
                  </div>
                  <span className="text-base font-semibold text-[#222526] leading-6">
                    {formatAmount(transaction.amount)} {currency}
                  </span>
                </div>
                <p className="text-sm font-medium text-[#69737c]">
                  {formatAmount(transaction.fee)} {currency}
                </p>
              </div>
            </div>
          </div>

          {/* Memo */}
          <div className="border-t border-[#e1e1e1] pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#69737c] leading-4">Memo</span>
              <span className="text-sm font-normal text-[#69737c] leading-5">
                {transaction.memo || '0'}
              </span>
            </div>
          </div>
        </Card>

        {/* Timestamp Footer */}
        <div className="bg-[rgba(205,223,236,0.15)] border border-[#e1e1e1] border-t-0 rounded-b-[16px] px-4 py-4">
          <p className="text-sm font-medium text-[#69737c] leading-4 text-center">
            {formatDate(transaction.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
}
