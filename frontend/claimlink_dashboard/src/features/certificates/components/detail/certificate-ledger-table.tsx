import { CertificateLedgerRow } from "./certificate-ledger-row";
import type { LedgerTransaction } from "./certificate-ledger";

interface CertificateLedgerTableProps {
  transactions: LedgerTransaction[];
}

export function CertificateLedgerTable({
  transactions,
}: CertificateLedgerTableProps) {
  return (
    <div className="min-w-[600px]">
      {/* Table Header */}
      <div className="bg-[#222526] border-b border-[#e1e1e1] flex gap-2 sm:gap-4 items-center px-3 sm:px-6 py-3 sm:py-4 rounded-tl-[16px] sm:rounded-tl-[25px] rounded-tr-[16px] sm:rounded-tr-[25px]">
        <div className="flex-1 min-w-0">
          <p className="text-white text-[11px] sm:text-[13px] font-medium leading-normal">From</p>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-[11px] sm:text-[13px] font-medium leading-normal">To</p>
        </div>
        <div className="w-[100px] sm:w-[150px] shrink-0">
          <p className="text-white text-[11px] sm:text-[13px] font-medium leading-normal">Type</p>
        </div>
        <div className="w-[70px] sm:w-[100px] shrink-0">
          <p className="text-white text-[11px] sm:text-[13px] font-medium leading-normal">Hash</p>
        </div>
        <div className="w-[70px] sm:w-[100px] shrink-0">
          <p className="text-white text-[11px] sm:text-[13px] font-medium leading-normal">Date</p>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex flex-col">
        {transactions.length === 0 ? (
          <div className="bg-white flex items-center justify-center py-8 sm:py-16">
            <p className="text-[#69737c] text-[12px] sm:text-[14px] font-light">
              No transactions found
            </p>
          </div>
        ) : (
          transactions.map((transaction, index) => (
            <CertificateLedgerRow
              key={index}
              transaction={transaction}
              isEven={index % 2 === 0}
            />
          ))
        )}
      </div>
    </div>
  );
}

