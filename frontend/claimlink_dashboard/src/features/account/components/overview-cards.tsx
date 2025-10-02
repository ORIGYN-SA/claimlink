import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Copy, HelpCircle, Wallet } from 'lucide-react';
import type { AccountOverview } from '../types/transaction-history.types';

interface OverviewCardsProps {
  accountOverview: AccountOverview;
  onCopyAccountId?: (id: string) => void;
}

export function OverviewCards({ accountOverview, onCopyAccountId }: OverviewCardsProps) {
  const handleCopyAccountId = () => {
    navigator.clipboard.writeText(accountOverview.accountId);
    onCopyAccountId?.(accountOverview.accountId);
  };

  const formatAccountId = (id: string) => {
    // Format long account ID with ellipsis in middle
    if (id.length > 20) {
      return `${id.slice(0, 10)}...${id.slice(-10)}`;
    }
    return id;
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(balance);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Account ID Card */}
      <Card className="border border-[#e8e8e8]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#69737c] flex items-center justify-center">
                <span className="text-white text-xs font-medium">ID</span>
              </div>
              <span className="text-sm font-medium text-[#69737c]">Account ID</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <HelpCircle className="h-4 w-4 text-[#69737c]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your unique account identifier</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-semibold text-[#222526] font-mono">
              {formatAccountId(accountOverview.accountId)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyAccountId}
              className="h-8 w-8 p-0 hover:bg-[#f0f0f0]"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Balance Card */}
      <Card className="border border-[#e8e8e8]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-[#69737c]" />
              <span className="text-sm font-medium text-[#69737c]">Balance</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <HelpCircle className="h-4 w-4 text-[#69737c]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your current OGY token balance</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#50be8f] flex items-center justify-center">
              <span className="text-white text-xs font-bold">O</span>
            </div>
            <div>
              <div className="text-2xl font-semibold text-[#222526]">
                {formatBalance(accountOverview.balance)}
              </div>
              <div className="text-sm text-[#69737c]">
                {accountOverview.balanceInUSD && `$${accountOverview.balanceInUSD.toFixed(2)} USD`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

