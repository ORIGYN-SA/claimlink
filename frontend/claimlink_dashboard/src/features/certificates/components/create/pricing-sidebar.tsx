import { Button } from "@/components/ui/button";
import { useEstimateMintCost } from "@/features/certificates";
import { Loader2 } from "lucide-react";

interface PricingSidebarProps {
  collectionCanisterId: string;
  totalFileSizeBytes: number;
  numMints?: number;
  onMint?: () => void;
  isMinting?: boolean;
}

function formatOgy(e8s: bigint): string {
  const value = Number(e8s) / 1e8;
  if (value < 0.01) return value.toFixed(4);
  if (value < 1) return value.toFixed(2);
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function formatUsd(e8s: bigint): string {
  const value = Number(e8s) / 1e8;
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function PricingSidebar({
  collectionCanisterId,
  totalFileSizeBytes,
  numMints = 1,
  onMint,
  isMinting = false,
}: PricingSidebarProps) {
  const {
    data: estimate,
    isLoading,
    error,
  } = useEstimateMintCost(
    collectionCanisterId,
    numMints,
    totalFileSizeBytes,
    { enabled: !!collectionCanisterId },
  );

  return (
    <div className="bg-white box-border flex flex-col gap-6 items-start justify-center p-6 rounded-[25px] w-full border border-[#e1e1e1]">
      {/* Introduction */}
      <div className="flex flex-col gap-2 items-start justify-start w-full">
        <div className="font-sans font-medium text-lg text-black">
          Minting Cost
        </div>
        <div className="font-sans text-[#69737c] text-[13px] w-full">
          <p className="leading-normal">
            Minting a certificate requires OGY tokens. The cost includes a base fee and a storage fee based on file size.
          </p>
        </div>
      </div>

      {/* Separator */}
      <div className="h-0 w-full border-t border-[#e1e1e1]"></div>

      {/* Price Section */}
      <div className="flex flex-col gap-4 items-start justify-start w-full">
        {/* Price header */}
        <div className="flex gap-2 items-center justify-start">
          <div className="font-sans font-medium text-[#222526] text-[14px] uppercase tracking-[0.7px]">
            Price
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center gap-2 p-4 w-full">
            <Loader2 className="h-4 w-4 animate-spin text-[#69737c]" />
            <span className="text-sm text-[#69737c]">Estimating cost...</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 box-border flex flex-col gap-1 items-start justify-start p-4 rounded-[16px] w-full border border-red-200">
            <div className="font-sans text-[14px] text-red-600">
              {error instanceof Error ? error.message : 'Failed to estimate cost'}
            </div>
          </div>
        )}

        {/* Cost estimate */}
        {estimate && (
          <>
            {/* Certificate Cost Box */}
            <div className="bg-[rgba(205,223,236,0.15)] box-border flex flex-col gap-1 items-start justify-start p-4 rounded-[16px] w-full border border-[#e1e1e1]">
              <div className="font-sans font-medium text-[#69737c] text-[14px]">
                Certificate cost:
              </div>
              <div className="flex gap-2 items-start justify-start">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-semibold text-lg text-[#222526]">
                    {formatOgy(estimate.total_ogy_e8s)} OGY
                  </span>
                  <span className="font-sans text-[14px] text-[#69737c]">
                    ({formatUsd(estimate.total_usd_e8s)})
                  </span>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="font-sans text-[#69737c] text-[13px] space-y-1">
              <p>Base fee: {formatUsd(estimate.breakdown.base_fee_usd_e8s)}</p>
              <p>Storage fee: {formatUsd(estimate.breakdown.storage_fee_usd_e8s)}</p>
              <p className="text-[11px] mt-2">
                OGY price: {formatUsd(estimate.ogy_usd_price_e8s)}/OGY
              </p>
            </div>
          </>
        )}
      </div>

      {/* Action Button */}
      {estimate && (
        <div className="flex gap-2 items-end justify-end w-full">
          <Button
            onClick={onMint}
            disabled={isMinting}
            className="bg-[#222526] hover:bg-[#1a1a1a] text-white rounded-[100px] px-6 h-12 w-full"
          >
            {isMinting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting...
              </>
            ) : (
              `Mint for ${formatOgy(estimate.total_ogy_e8s)} OGY`
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
