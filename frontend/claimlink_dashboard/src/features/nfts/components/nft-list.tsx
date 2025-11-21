import { TokenGridView } from "@/components/common/token-grid-view";
import type { NFT } from "../types/nft.types";

interface NFTListProps {
  nfts: NFT[];
  onNFTClick: (nft: NFT) => void;
  onMintNFT: () => void;
}

export function NFTList({ nfts, onNFTClick, onMintNFT }: NFTListProps) {
  return (
    <TokenGridView
      tokens={nfts}
      showCertifiedBadge={false} // NFTs don't show ORIGYN badge
      onTokenClick={onNFTClick}
      onAddToken={onMintNFT}
      addButtonText="Create a nft"
      addButtonDescription="Create a campaign to distribute your NFTs via claim links"
    />
  );
}
