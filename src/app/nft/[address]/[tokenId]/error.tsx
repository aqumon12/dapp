"use client";

import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({error, reset}: {error: Error, reset: () => void}) {

	const router = useRouter();

	useEffect(() => {
		console.error(error.message);
	}, [error]);

	return <div>
		<h3>Error</h3>
		<button onClick={() => {
			startTransition(() => {
				router.refresh(); // 현재 페이지에 필요한 서버컴포넌트들을 다시 볼러옴
				reset(); // 에러 상태를 초기화, 컴포넌트들을 다시 렌더링
			});
		}}>Try again</button>
	</div>;
}