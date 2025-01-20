import type { NFTData } from "@/types/global";
import Link from "next/link";
import style from "./nft-item.module.css";

export default function NFTItem({ contract, tokenId, name, description, image }: NFTData) {
	return (
		<Link href={`/nft/${contract.address}/${tokenId}`} className={style.nftItem}>
			<img className={style.image} src={image.thumbnailUrl ?? "/no-image.png"} alt={name || 'NFT Image'} />
			<div className={style.content}>
				<div className={style.title}>{name ?? 'No Name'}</div>
				<div className={style.subTitle}>{description ?? 'No Description'}</div>
			</div>
		</Link>
	);
}
