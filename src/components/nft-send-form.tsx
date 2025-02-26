'use client'
import { useState } from 'react';
import { ethers } from 'ethers';
import style from './nft-send-form.module.css';
import { revalidate } from '@/util/revalidate';

// ERC721 ABI의 transferFrom 함수만 포함
const ERC721_ABI = [
	"function transferFrom(address from, address to, uint256 tokenId)"
];

const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export default function NFTSendForm({ contractAddress, tokenId }: {contractAddress: string, tokenId: string}) {
	const [toAddress, setToAddress] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const transfer = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault(); // 폼 제출 기본 동작 방지
		
		if (isLoading) {
			alert('이미 처리중입니다.');
			return;
		}

		if (!toAddress) {
			alert('주소를 입력해주세요.');
			return;
		}

		if (!ETH_ADDRESS_REGEX.test(toAddress)) {
			alert('주소 형식이 올바르지 않습니다.');
			return;
		}

		try {
			setIsLoading(true);
			
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();

			// 컨트랙트 인스턴스 생성
			const nftContract = new ethers.Contract(
				contractAddress,
				ERC721_ABI,
				signer
			);

			// 전송 트랜잭션 생성
			const tx = await nftContract.transferFrom(
				await signer.getAddress(),
				toAddress,
				tokenId
			);

			// 트랜잭션 대기
			await tx.wait();

			alert('NFT가 성공적으로 전송되었습니다!');

			revalidate('nft-list');
			window.location.href = '/nft'; // 전체 페이지 새로고침으로 모달도 함께 닫힘
			
		} catch (error) {
			console.error(error);
			alert('전송 중 오류가 발생했습니다.');
		} finally {
			setIsLoading(false);
		}
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setToAddress(e.target.value);
	};

	return (
		<form className={style.sendForm} onSubmit={transfer}>
			<input
				type="text"
				placeholder="전송할 주소를 입력해주세요"
				value={toAddress}
				onChange={onChange}
				disabled={isLoading}
			/>
			<button type="submit" disabled={isLoading}>{isLoading ? '...' : '전송'}</button>
		</form>
	);
}