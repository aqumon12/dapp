import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // JWT 토큰 검증 시도
  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET // JWT 시크릿 키 추가
    });

    const { pathname } = request.nextUrl;

    // NFT 페이지 접근 시 유효한 세션 체크
    if (pathname.startsWith("/nft")) {
      if (!token) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // 유효한 세션이 있는 상태에서 홈페이지 접근 시 NFT 페이지로 리다이렉트
    if (pathname === "/" && token) {
      return NextResponse.redirect(new URL("/nft", request.url));
    }

    return NextResponse.next();
    
  } catch (error) {
    console.error("Session verification failed:", error);
    // 토큰 검증 실패 시 홈페이지로 리다이렉트
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// 미들웨어를 적용할 경로 설정
export const config = {
  matcher: ["/", "/nft/:path*", "/api/:path*"]
}; 