import { Alchemy, Network } from 'alchemy-sdk';
import chainIds from '@/chainList/chainIds';
import { NextResponse } from 'next/server';

// 보유 NFT 목록 조회
export async function POST(request: Request) {
	try {
		const { address, chainId } = await request.json();

		if (!address || !chainId) {
			return NextResponse.json(
				{ message: '필수 파라미터가 누락되었습니다.' },
				{ status: 400 }
			);
		}

		const network = Network[chainIds[Number(chainId)]?.network_key as keyof typeof Network];

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

		// 보유 NFT 목록 조회
		const response = await alchemy.nft.getNftsForOwner(address);
		return NextResponse.json(
			{ message: 'success', nfts: response.ownedNfts },
			{ status: 200 }
		);
	} catch (error) {
		console.error('NFT fetch error:', error);
		return NextResponse.json(
			{ message: 'NFT 목록을 불러오는 중 오류가 발생했습니다.' },
			{ status: 500 }
		);
	}
} 