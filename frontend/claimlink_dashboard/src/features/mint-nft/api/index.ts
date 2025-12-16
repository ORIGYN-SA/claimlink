/**
 * NFT Minting API Layer
 * Exports service and query hooks
 */

export { NFTService } from './nft.service';
export type { MintNFTRequest, NFTMintResult } from './nft.service';

export {
  nftMintKeys,
  useMintNFT,
  useBatchMintNFTs,
  useNFTMintingPrice,
  useValidateNFTData,
} from './nft.queries';
