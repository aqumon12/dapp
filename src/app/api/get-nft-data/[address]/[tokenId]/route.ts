import { Alchemy, Network } from 'alchemy-sdk';
import chainIds from '@/chainList/chainIds';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ address: string, tokenId: string }> }
) {
	try {
		// 로그인 여부 확인
		const session = await getServerSession(authOptions);
		if (!session?.user?.chainId) {
			return NextResponse.json(
				{ message: '로그인이 필요합니다.' },
				{ status: 401 }
			);
		}

		const { address, tokenId } = await params;

		if (!address || !tokenId) {
			return NextResponse.json(
				{ message: '컨트랙트 주소와 토큰 ID가 필요합니다.' },
				{ status: 400 }
			);
		}

		const chainId = session.user.chainId;
		const network = Network[chainIds[chainId]?.network_key as keyof typeof Network];

		if (!network) {
			return NextResponse.json(
				{ message: '지원하지 않는 네트워크입니다.' },
				{ status: 400 }
			);
		}

		const alchemy = new Alchemy({
			apiKey: process.env.ALCHEMY_API_KEY,
			network: network
		});

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