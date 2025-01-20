import Link from "next/link";
import ConnectMetamask from "./connect-metamask";
import style from "./header.module.css";

export default function Header() {
	return (
		<header className={style.header}>
			<Link className={style.logo} href={"/"}> Sam</Link>
			<div className={style.menu}>
				<nav>
					{/* <Link href={"/token"}>토큰</Link> */}
					{/* <Link href={"/nft"}>NFT</Link> */}
					
				</nav>
				<ConnectMetamask />
			</div>
		</header>
	);
}