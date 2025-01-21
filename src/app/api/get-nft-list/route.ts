import { Alchemy, Network } from 'alchemy-sdk';
import chainIds from '@/chainList/chainIds';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// nft 목록 조회
export async function GET() {
	try {
		// 세션 체크
		const session = await getServerSession(authOptions);

		console.log('Session:', session);

		if (!session?.user?.address) {
			return NextResponse.json(
				{ message: '로그인이 필요합니다.' },
				{ status: 401 }
			);
		}

		const chainId = session.user.chainId;
		const network = Network[chainIds[chainId]?.network_key];

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

		// 소유한 nft 목록 조회
		const response = await alchemy.nft.getNftsForOwner(session.user.address);
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