import styles from "./page.module.css";

export default async function Home() {
	return (
			<div className={styles.page}>
				<h2>Sam 시작하기</h2>
				<p>Amoy, Sepolia 네트워크에서 NFT와 지갑을 한눈에 확인하세요.</p>
			</div>
	);
}