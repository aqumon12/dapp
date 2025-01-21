import Header from "@/components/header";
import "./globals.css";
import style from "./layout.module.css";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			<body>
				<div className={style.container}>
					<Header />
					<main>{children}</main>
				</div>
			</body>
		</html>
	);
}
