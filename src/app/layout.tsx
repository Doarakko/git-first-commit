import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Git First Commit",
	description: "Find the first commit of any GitHub repository",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			{process.env.ENV === "production" && (
				<GoogleAnalytics gaId="G-GKR0S4585R" />
			)}
			<body className={inter.className}>
				<div className="relative min-h-screen">
					<header className="py-4 px-6">
						<div className="flex justify-between items-center">
							<h1 className="text-xl font-semibold">
								<a href="/" className="hover:text-gray-700">
									Git First Commit
								</a>
							</h1>
							<div className="flex gap-4">
								<a
									href="https://github.com/Doarakko/git-first-commit"
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
								>
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
											clipRule="evenodd"
										/>
									</svg>
									<span className="sr-only">View GitHub Repository</span>
								</a>
							</div>
						</div>
					</header>
					{children}
					<footer className="absolute bottom-0 w-full py-4">
						<div className="flex flex-col items-center gap-4">
							<div className="flex justify-center gap-4">
								<a
									href="https://github.com/sponsors/Doarakko"
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
								>
									<span>Sponsor</span>
								</a>
								<a
									href="/privacy"
									className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
								>
									Privacy Policy
								</a>
							</div>
							<a
								href="https://x.com/dodododoarakko"
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
							>
								@Doarakko
							</a>
						</div>
					</footer>
				</div>
			</body>
		</html>
	);
}
