import "next-auth";

// declare module : 기존 타입 확장
// export : 새로운 타입 정의

declare module "next-auth" {
	interface User {
		address: string;
		chainId: number;
		balance: number;
	}
	
	interface Session {
		user: User;
		accessToken: string | unknown;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		address: string;
		chainId: number;
		balance: number;
	}
}