import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	// JWT 토큰 검증 시도
	try {
		const token = await getToken({
			req: request,
			secret: process.env.NEXTAUTH_SECRET // JWT 시크릿 키 추가 -> 토큰 검증 및 암호화/복호화
		});

		const { pathname } = request.nextUrl;
		console.log(token, pathname);
		// NFT 페이지 접근 시 세션 체크
		if (pathname.startsWith("/nft")) {
			if (!token) {
				return NextResponse.redirect(new URL("/", request.url));
			}
		}

		// 홈페이지 접근 시 세션 체크
		if (pathname === "/" && token) {
			return NextResponse.redirect(new URL("/nft", request.url));
		}

		return NextResponse.next();

	} catch (error) {
		console.error("Session verification failed:", error);

		return NextResponse.redirect(new URL("/", request.url));
	}
}

// 미들웨어를 적용할 경로 설정
export const config = {
	matcher: ["/", "/nft/:path*"]
}; 