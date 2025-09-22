import { TokenCard } from "../token-card/token-card";
import { AddTokenCard } from "../add-token-card/add-token-card";
import type { BaseToken } from "../token-card/token.types";

interface TokenGridViewProps {
  tokens: BaseToken[];
  showCertifiedBadge?: boolean;
  onTokenClick: (token: BaseToken) => void;
  onAddToken: () => void;
  addButtonText?: string;
  addButtonDescription?: string;
  className?: string;
}

export function TokenGridView({
  tokens,
  showCertifiedBadge = false,
  onTokenClick,
  onAddToken,
  addButtonText = "Add an item",
  addButtonDescription = "Create a new item",
  className
}: TokenGridViewProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className || ''}`}>
      {/* Add Token Card - always first */}
      <AddTokenCard
        onClick={onAddToken}
        title={addButtonText}
        description={addButtonDescription}
      />

      {/* Token Cards */}
      {tokens.map((token) => (
        <TokenCard
          key={token.id}
          token={token}
          showCertifiedBadge={showCertifiedBadge}
          onClick={onTokenClick}
        />
      ))}
    </div>
  );
}
