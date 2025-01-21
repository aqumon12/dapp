import { Alchemy, Network } from 'alchemy-sdk';
import chainIds from '@/chainList/chainIds';
import { NextResponse } from 'next/server';

// nft 상세 조회
export async function POST(request: Request) {
	try {
		const { address, tokenId, chainId } = await request.json();
		
		if (!address || !tokenId || !chainId) {
			return NextResponse.json(
				{ message: '컨트랙트 주소, 토큰 ID, 체인 ID가 필요합니다.' },
				{ status: 400 }
			);
		}

		const network = Network[chainIds[chainId]?.network_key as keyof typeof Network];

		if (!network) {
			return NextResponse.json(
				{ message: '지원하지 않는 네트워크입니다.' },
				{ status: 400 }
			);
		}

		// alchemy 인스턴스 생성
		const alchemy = new Alchemy({
			apiKey: process.env.ALCHEMY_API_KEY,
			network: network
		});

		// nft 상세 조회
		const nft = await alchemy.nft.getNftMetadata(
			address,
			tokenId
		);
		
		return NextResponse.json(
			{ message: 'success', nft },
			{ status: 200 }
		);
	} catch (error) {
		console.error('NFT detail fetch error:', error);
		return NextResponse.json(
			{ message: 'NFT 정보를 불러오는 중 오류가 발생했습니다.' },
			{ status: 500 }
		);
	}
} 