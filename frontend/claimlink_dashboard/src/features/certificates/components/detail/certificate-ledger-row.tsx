import { Flame, ArrowRightLeft, Coins, BadgeCheck, User } from "lucide-react";
import type { LedgerTransaction, LedgerTransactionType } from "./certificate-ledger";

interface CertificateLedgerRowProps {
  transaction: LedgerTransaction;
  isEven: boolean;
}

interface TransactionBadgeProps {
  type: LedgerTransactionType;
}

function TransactionBadge({ type }: TransactionBadgeProps) {
  const getBadgeConfig = () => {
    switch (type) {
      case "Burned":
        return {
          Icon: Flame,
          label: "Burned",
          bgColor: "bg-white",
        };
      case "Transferred":
        return {
          Icon: ArrowRightLeft,
          label: "Transferred",
          bgColor: "bg-white",
        };
      case "Minted":
        return {
          Icon: Coins,
          label: "Minted",
          bgColor: "bg-white",
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <div
      className={`${config.bgColor} border border-[rgba(225,225,225,0.5)] flex gap-1 sm:gap-2 h-6 sm:h-7 items-center px-1.5 sm:px-2 py-1 rounded-full`}
    >
      <config.Icon className="size-[8px] sm:size-[10px] text-[#222526]" />
      <p className="text-[#222526] text-[10px] sm:text-[12px] font-medium leading-normal">
        {config.label}
      </p>
    </div>
  );
}

interface AddressDisplayProps {
  address: string;
  addressShort: string;
  verified?: boolean;
}

function AddressDisplay({
  addressShort,
  verified = false,
}: AddressDisplayProps) {
  if (verified) {
    return (
      <div className="flex gap-1 sm:gap-1.5 items-center">
        {/* Avatar Icon */}
        <div className="relative size-5 sm:size-6 shrink-0 bg-[#233169] rounded-2xl flex items-center justify-center">
          <User className="size-2.5 sm:size-3 text-white" />
        </div>
        <p className="text-[#69737c] text-[12px] sm:text-[14px] font-medium leading-4 truncate">
          {addressShort}
        </p>
        {/* Verified Badge */}
        <BadgeCheck className="size-3.5 sm:size-4 shrink-0 text-[#50be8f]" />
      </div>
    );
  }

  return (
    <p className="text-[#69737c] text-[12px] sm:text-[14px] font-medium leading-4 truncate">
      {addressShort}
    </p>
  );
}

export function CertificateLedgerRow({
  transaction,
  isEven,
}: CertificateLedgerRowProps) {
  const bgClass = isEven
    ? "bg-white"
    : "bg-[linear-gradient(90deg,rgba(249,250,254,0.5)_0%,rgba(249,250,254,0.5)_100%)]";

  return (
    <div
      className={`${bgClass} border-b border-[#e1e1e1] last:border-b-0 flex gap-2 sm:gap-4 items-center px-3 sm:px-6 py-3 sm:py-4`}
    >
      {/* From */}
      <div className="flex-1 min-w-0">
        <AddressDisplay
          address={transaction.from}
          addressShort={transaction.fromShort}
          verified={transaction.fromVerified}
        />
      </div>

      {/* To */}
      <div className="flex-1 min-w-0">
        <AddressDisplay
          address={transaction.to}
          addressShort={transaction.toShort}
          verified={transaction.toVerified}
        />
      </div>

      {/* Type */}
      <div className="w-[100px] sm:w-[150px] shrink-0">
        <TransactionBadge type={transaction.type} />
      </div>

      {/* Hash */}
      <div className="w-[70px] sm:w-[100px] shrink-0">
        <p className="text-[#69737c] text-[12px] sm:text-[14px] font-normal leading-4 truncate">
          {transaction.hash}
        </p>
      </div>

      {/* Date */}
      <div className="w-[70px] sm:w-[100px] shrink-0">
        <p className="text-[#69737c] text-[12px] sm:text-[14px] font-normal leading-4">
          {transaction.date}
        </p>
      </div>
    </div>
  );
}

