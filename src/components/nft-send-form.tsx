'use client'
import style from './nft-send-form.module.css';

export default function NFTSendForm() {

	const handleSubmit = () => {
		console.log('전송 NFT');
	}

	return (
		<form className={style.sendForm} onSubmit={handleSubmit}>
			<input type="text" placeholder="전송할 주소를 입력해주세요" />
			<button type="submit">전송</button>
		</form>
	)
}