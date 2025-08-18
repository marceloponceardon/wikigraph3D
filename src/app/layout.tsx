import Navbar from "@/components/Navbar";
import Header from "@/components/Header";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body>
			<Navbar />
			<Header />
			<main>{children}</main>
			<footer>Footer</footer>
			</body>
		</html>
	)
}
