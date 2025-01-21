import style from "./page.module.css";
import { notFound } from "next/navigation";
import NFTSendForm from "@/components/nft-send-form";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

async function getNFTData(address: string, tokenId: string) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.address) {
		throw new Error('로그인이 필요합니다.');
	}

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-nft-data`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				address,
				tokenId,
				chainId: session.user.chainId,
			}),
			cache: 'force-cache',
		}
	);

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || 'NFT 데이터를 불러오는데 실패했습니다.');
	}

	const data = await response.json();
	
	if (!data.nft) {
		notFound();
	}

	return data.nft;
}

async function NFTDetail({address, tokenId}: {address: string, tokenId: string}) {
	const nft = await getNFTData(address, tokenId);

	return (
		<section className={style.nftDetail}>
			<div className={style.content}>
				<div className={style.leftColumn}>
					<div className={style.imageContainer}>
						<img src={nft.image.cachedUrl ?? "/no-image.png"} alt={nft.name} />
					</div>
				</div>
				
				<div className={style.rightColumn}>
					<h1 className={style.title}>{nft.name}</h1>
					<div className={style.description}>{nft.description}</div>
					
					<div className={style.tokenInfoCard}>
						<h2 className={style.sectionTitle}>상세 정보</h2>
						<div className={style.tokenInfoItem}>
							<span>계약 주소</span>
							<span>{nft.contract.address.slice(0, 6) + '...' + nft.contract.address.slice(-4)}</span>
						</div>
						<div className={style.tokenInfoItem}>
							<span>토큰 ID</span>
							<span>{nft.tokenId}</span>
						</div>
						<div className={style.tokenInfoItem}>
							<span>토큰 표준</span>
							<span>{nft.tokenType}</span>
						</div>
					</div>
					{nft.raw.metadata.attributes && (
						<div className={style.attributesSection}>
							<h2 className={style.sectionTitle}>특성</h2>
							<div className={style.attributesGrid}>
							{nft.raw.metadata.attributes?.map((attribute: {trait_type: string, value: string}) => (
								<div key={attribute.trait_type} className={style.attributeItem}>
									<div className={style.traitType}>{attribute.trait_type}</div>
									<div className={style.traitValue}>{attribute.value}</div>
								</div>
							))}
							</div>
						</div>
					)}
					<NFTSendForm contractAddress={address} tokenId={tokenId} />
				</div>
			</div>
		</section>
	);
}

export default async function Page({params}: {params: Promise<{address: string, tokenId: string}>}) {
	const { address, tokenId } = await params;

	return (
		<div className={style.container}>
			<NFTDetail address={address} tokenId={tokenId} />
		</div>
	);
}
