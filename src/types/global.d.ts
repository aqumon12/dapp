
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface ChainInfo {
  name: string;
  symbol: string;
}

interface ChainIds {
  [key: number]: ChainInfo;
} 

export interface NFTData {
  contract: {
    address: string;
  };
  tokenId: string;
  name: string;
  description: string;
  image: {
	thumbnailUrl: string;
	cachedUrl: string;
  }
  owner?: string;
}
