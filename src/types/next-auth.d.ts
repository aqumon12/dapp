import "next-auth";

declare module "next-auth" {
  interface User {
    address: string;
    chainId: number;
    balance: number;
  }

  interface Session {
    user: User & {
      address: string;
      chainId: number;
      balance: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    address: string;
    chainId: number;
    balance: number;
  }
}