import style from "./nft-item-skeleton.module.css";
export default function NFTItemSkeleton() {
	return (
		<div className={style.container}>
			<div className={style.image}></div>
			<div className={style.content}>
				<div className={style.title}></div>
				<div className={style.subTitle}></div>
			</div>
		</div>
	);
}