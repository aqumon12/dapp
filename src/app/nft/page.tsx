import styles from './page.module.css';
import { Suspense } from 'react';
import NFTListSkeleton from '@/components/skeleton/nft-list-skeleton';
import NFTItem from '@/components/nft-item';
import { cookies } from 'next/headers';
import { NFTData } from '@/types/global';

async function getNFTs() {
	const cookieStore = await cookies();
	
	const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-nft-list`, {
		method: 'GET',
		headers: {
			Cookie: cookieStore.toString(),
		},
	});

	if (!response.ok) {
		const data = await response.json();
		throw new Error(data.message);
	}

	return response.json();
}

async function NFTList() {
	const data = await getNFTs();

	if (data.nfts.length === 0) {
		return <div className={styles.noNfts}>보유 NFT가 없습니다.</div>;
	}

	return (
		<div className={styles.nftContainer}>
			<div className={styles.nftCount}>{data.nfts.length}</div>
			<div className={styles.nftList}>
				{data.nfts.map((nft: NFTData) => (
					<NFTItem 
						key={`${nft.contract.address}-${nft.tokenId}`}
						{...nft}
					/>
				))}
			</div>
		</div>
	);
}

export default function Page() {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>NFT 목록</h1>
			<Suspense fallback={<NFTListSkeleton count={10} />}>
				<NFTList />
			</Suspense>
		</div>
	);
}