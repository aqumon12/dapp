// 실제 구현 코드가 아닌 타입 정의만 포함
// 컴파일 시 JavaScript로 변환되지 않음

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
