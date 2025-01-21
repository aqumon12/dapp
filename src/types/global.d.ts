// window.ethereum 타입 정의
declare global {
	interface Window {
		ethereum?: any;
	}
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
