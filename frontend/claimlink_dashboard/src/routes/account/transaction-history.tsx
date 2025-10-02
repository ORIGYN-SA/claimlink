import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/components/layout';
import { TransactionHistoryPage } from '@/features/account';

export const Route = createFileRoute('/account/transaction-history')({
  component: TransactionHistoryRoute,
});

function TransactionHistoryRoute() {
  return (
    <DashboardLayout>
      <TransactionHistoryPage />
    </DashboardLayout>
  );
}
