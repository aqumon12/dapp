import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
	// 암호화 및 복호화에 사용되는 비밀 키
	secret: process.env.NEXTAUTH_SECRET,

	// 인증 제공자 설정
	providers: [
		// CredentialsProvider: 커스텀 인증 구현 시 사용
		// GoogleProvider, GithubProvider, AppleProvider 등 사용 가능
		CredentialsProvider({
			name: "Ethereum",
			credentials: {
				address: { label: "Address", type: "text" },
				signature: { label: "Signature", type: "text" },
				chainId: { label: "ChainId", type: "number" },
				balance: { label: "Balance", type: "number" },
			},

			// 인증 로직
			async authorize(credentials) {
				if (!credentials?.address || !credentials?.signature || !credentials?.chainId || !credentials?.balance) {
					return null;
				}

				return {
					id: credentials.address,
					address: credentials.address,
					chainId: Number(credentials.chainId),
					balance: Number(credentials.balance),
				};
			},
		}),
	],
	// 페이지 설정
	pages: {
		error: "/", // 인증 에러 발생 시 리다이렉트할 페이지
		// signIn: "/", // 로그인 필요 시 리다이렉트할 페이지, 예) await signIn('credentials'); 
	},

	// 세션 방식 설정
	session: {
		strategy: "jwt", // jwt / database
		maxAge: 60 * 60, // 세션 만료 시간 (초)
	},

	// 세션 콜백 함수
	callbacks: {
		// 세션 데이터가 필요할 때마다 호출
		async session({ session, token }) {
			if (token && session.user) {
				// JWT 토큰의 데이터를 세션에 복사
				session.user.address = token.address;
				session.user.chainId = token.chainId;
				session.user.balance = token.balance;
			}
			return session;
		},

		// 토큰 생성 및 갱신 시 호출
		async jwt({ token, user }) {
			if (user) {
				// 로그인 시 사용자 데이터를 토큰에 저장
				token.address = user.address;
				token.chainId = user.chainId;
				token.balance = user.balance;
			}
			return token;
		},
	},
}; 