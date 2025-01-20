import NFTItemSkeleton from "./nft-item-skeleton";
import style from "./nft-list-skeleton.module.css";

export default function NFTListSkeleton({ count }: { count: number }) {
	return (
		<div className={style.container}>
			{new Array(count).fill(0).map((_, i) => (
				<NFTItemSkeleton key={`nft-item-skeleton-${i}`} />
			))}
		</div>
	);
}