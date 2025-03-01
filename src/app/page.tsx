"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Repository } from "./domain";

const githubRepositoryRegex =
	/^https?:\/\/(www\.)?github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9._-]+)(\/|\.git)?$/;

export default function Home() {
	const router = useRouter();
	const [repositories, setRepositories] = useState<Repository[]>([]);

	useEffect(() => {
		const fetchRepositories = async () => {
			try {
				const response = await fetch("/api/repositories");
				if (!response.ok) {
					console.error("Failed to fetch repositories");
					return;
				}
				const data: { repositories: Repository[] } = await response.json();
				setRepositories(data.repositories ?? []);
			} catch (error) {
				console.error("Error fetching repositories:", error);
			}
		};

		fetchRepositories();
	}, []);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== "Enter") {
			return;
		}

		const url = event.currentTarget.value;
		const match = url.match(githubRepositoryRegex);
		if (!match) {
			return;
		}

		const username = match[2];
		const repositoryName = match[3];
		router.replace(`${username}/${repositoryName}`);
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<p className="mt-2 text-sm text-gray-600">
						Find the first commit of any GitHub repository
					</p>
				</div>
				<div className="mt-8">
					<input
						type="url"
						placeholder="https://github.com/Doarakko/git-first-commit"
						onKeyDown={handleKeyDown}
						className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
					/>
					<p className="mt-2 text-xs text-gray-500 text-center">
						Press Enter to search
					</p>
				</div>
			</div>

			{repositories.length > 0 && (
				<div className="max-w-6xl w-full mt-12">
					<h2 className="text-lg font-semibold mb-4 text-center">
						Recent Repositories
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{repositories.map((repo) => (
							<a
								key={repo.id}
								href={`/${repo.username}/${repo.repositoryName}`}
								className="block bg-white shadow rounded-lg hover:shadow-md transition-shadow"
							>
								<div className="p-4">
									<div className="flex items-center space-x-3 mb-3">
										<img
											src={repo.ownerImageUrl}
											alt={`${repo.username}'s avatar`}
											className="w-8 h-8 rounded-full"
										/>
										<span className="text-gray-900 font-medium truncate">
											{repo.username}/{repo.repositoryName}
										</span>
									</div>
									{repo.description && (
										<p className="text-sm text-gray-500 line-clamp-2 mb-3">
											{repo.description}
										</p>
									)}
									<div className="text-xs text-gray-400">
										{new Date(repo.createdAt).toLocaleDateString()}
									</div>
								</div>
							</a>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
