import { useState } from "react";
import { CertificateLedgerTable } from "./certificate-ledger-table";
import { CertificateLedgerPagination } from "./certificate-ledger-pagination";

export type LedgerTransactionType = "Minted" | "Transferred" | "Burned";

export interface LedgerTransaction {
  from: string;
  fromShort: string;
  fromVerified?: boolean;
  to: string;
  toShort: string;
  toVerified?: boolean;
  type: LedgerTransactionType;
  hash: string;
  date: string;
}

export interface CertificateLedgerData {
  transactions: LedgerTransaction[];
}

interface CertificateLedgerProps {
  data: CertificateLedgerData;
  className?: string;
}

export function CertificateLedger({
  data,
  className = "",
}: CertificateLedgerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate pagination
  const totalPages = Math.ceil(data.transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = data.transactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div
      className={`bg-[#fcfafa] rounded-bl-[24px] rounded-br-[24px] w-full ${className}`}
    >
      {/* Main Ledger Section */}
      <div className="bg-[#222526] flex flex-col gap-8 sm:gap-16 px-4 sm:px-16 py-6 sm:py-10 rounded-bl-[24px] rounded-br-[24px] w-full">
        {/* Table Container - horizontally scrollable on mobile */}
        <div className="border border-[rgba(105,115,124,0.5)] rounded-[16px] sm:rounded-[25px] overflow-hidden">
          <div className="overflow-x-auto">
            <CertificateLedgerTable transactions={currentTransactions} />
          </div>

          <CertificateLedgerPagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </div>
    </div>
  );
}

