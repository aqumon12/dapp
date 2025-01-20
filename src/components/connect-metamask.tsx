"use client";

import { useCallback } from "react";
import { ethers } from "ethers";
import style from "./connect-metamask.module.css";
import chainIds from "@/chainList/chainIds";
import { signIn, signOut, useSession } from "next-auth/react";

export default function ConnectMetamask() {
	const { data: session } = useSession();

	// 메타마스크 연결
	const getProvider = async () => {
		const provider: ethers.BrowserProvider = new ethers.BrowserProvider(window.ethereum);
		console.log(provider);
		return provider;
	}

	// 메타마스크 계정 정보 조회
	const getWalletData = async (signer: ethers.JsonRpcSigner, provider: ethers.BrowserProvider) => {
		try {
			const address = await signer.getAddress();
			const network = await provider.getNetwork();
			const result = {
				address: address,
				balance: await provider.getBalance(address),
				chainId: network.chainId
			};
			
			return result;
		} catch (error) {
			console.error('Error getting wallet data:', error);
		}
	}

	const logOut = async () => {
		await signOut({ 
			redirect: true,
			callbackUrl: "/"
		  });
	}

	const connectWallet = useCallback(async () => {
		try {
			if (typeof window.ethereum !== "undefined") {
				const provider = await getProvider();
				
				await provider.send("eth_requestAccounts", []);

				// 지원 네트워크 확인
				const network = await provider.getNetwork();
				if (!chainIds[Number(network.chainId)]) {
					throw new Error("지원하지 않는 네트워크입니다. 네트워크를 확인해주세요. \n지원 네트워크: " + Object.values(chainIds).map(chain => chain.name).join(", "));
				}
				

				const signer = await provider.getSigner();
				const message = "Sam에 로그인하세요!";
				const signature = await signer.signMessage(message);

				const walletData = await getWalletData(signer, provider);
				if (!walletData) return;

				// 세션 저장
				const result = await signIn("credentials", {
					redirect: true,
					address: walletData.address,
					signature: signature,
					chainId: walletData.chainId,
					balance: Number(ethers.formatEther(walletData.balance)).toFixed(2),
				});

				if (result?.error) {
					throw new Error(result.error);
				}
			}
		} catch (error: any) {
			if (error.code === 'ACTION_REJECTED') return;
			alert(error);
		}
	}, []);

	const switchNetwork = async (chainId: number) => {
		try {
			const provider = await getProvider();
			await provider.send("wallet_switchEthereumChain", [
				{ chainId: `0x${chainId.toString(16)}` }
			]);
			
			await connectWallet();
		} catch (error: any) {
			alert('네트워크 전환에 실패했습니다. 잠시 후 다시 시도해주세요.');
			console.error(error);
		}
	};

	return (
		<>
			{!session ? (
				<button className={style.btn} onClick={connectWallet}>
					Connect Metamask
				</button>
			) : (
				<>
					<div className={style.balanceContainer}>
						<select	value={session.user?.chainId} onChange={(e) => switchNetwork(Number(e.target.value))} className={style.networkSelect}>
							{Object.entries(chainIds).map(([id, network]) => (
								<option key={id} value={id}>
									{network.name}
								</option>
							))}
						</select>
						<span style={{whiteSpace: 'nowrap'}}>{session.user?.balance} {chainIds[session.user?.chainId ?? 1]?.symbol}</span>
					</div>
					<div className={style.addressContainer}>
						<svg fill="gray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{width: '20px', height: '20px'}}><path d="M18.527 12.2062L12 16.1938L5.46875 12.2062L12 1L18.527 12.2062ZM12 17.4742L5.46875 13.4867L12 23L18.5312 13.4867L12 17.4742V17.4742Z" fill="gray"></path></svg>
						<span>{session.user?.address.slice(0, 6) + '...' + session.user?.address.slice(-4)}</span>
					</div>
					<button className={style.btn} onClick={logOut}>로그아웃</button>
				</>
			)}
		</>
	);
}