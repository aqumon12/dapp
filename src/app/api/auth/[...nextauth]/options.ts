import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		CredentialsProvider({
			name: "Ethereum",
			credentials: {
				address: { label: "Address", type: "text" },
				signature: { label: "Signature", type: "text" },
				chainId: { label: "ChainId", type: "number" },
				balance: { label: "Balance", type: "number" },
			},
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
	pages: {
		error: "/",
	},
	session: {
		strategy: "jwt",
		maxAge: 24 * 60 * 60,
	},
	callbacks: {
		async session({ session, token }) {
			if (token && session.user) {
				session.user.address = token.address;
				session.user.chainId = token.chainId;
				session.user.balance = token.balance;
			}
			return session;
		},

		async jwt({ token, user }) {
			if (user) {
				token.address = user.address;
				token.chainId = user.chainId;
				token.balance = user.balance;
			}
			return token;
		},
	},
}; 