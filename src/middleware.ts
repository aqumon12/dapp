import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	// JWT 토큰 검증
	try {
		const token = await getToken({
			req: request,
			secret: process.env.NEXTAUTH_SECRET // JWT 시크릿 키 추가 -> 토큰 검증 및 암호화/복호화
		});

		const { pathname } = request.nextUrl;

		// NFT 페이지 접근 시 인증 체크
		if (pathname.startsWith("/nft")) {
			if (!token) {
				const url = new URL("/", request.url);
				return NextResponse.redirect(url);
			}
		}

		// 홈페이지 접근 시 이미 인증된 사용자는 NFT 페이지로 리다이렉트
		if (pathname === "/" && token) {
			const url = new URL("/nft", request.url);
			return NextResponse.redirect(url);
		}

		return NextResponse.next();

	} catch (error) {
		console.error("인증 검증 실패:", error);
		const url = new URL("/", request.url);
		return NextResponse.redirect(url);
	}
}

// 미들웨어를 적용할 경로 설정
export const config = {
	matcher: ["/", "/nft/:path*"]
}; 