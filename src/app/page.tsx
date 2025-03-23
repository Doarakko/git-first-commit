"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Repository } from "./domain";
import "./globals.css";
import RepositoryCardList from "./components/RepositoryCardList";

const githubRepositoryRegex =
	/^https?:\/\/(www\.)?github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9._-]+)(\/|\.git)?$/;

export default function Home() {
	const router = useRouter();
	const [repositories, setRepositories] = useState<Repository[]>([]);
	const [loading, setLoading] = useState(false);

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

	const handleKeyDown = async (
		event: React.KeyboardEvent<HTMLInputElement>,
	) => {
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

		setLoading(true);
		const response = await fetch(
			`/api/usernames/${username}/repositories/${repositoryName}/commits`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		setLoading(false);

		if (!response.ok) {
			return;
		}

		router.replace(`${username}/${repositoryName}`);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4" />
				<h1 className="text-2xl font-bold mb-4">Searching...</h1>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center py-4 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full text-left">
				<div className="mt-8">
					<p className="mt-2 text-base pb-2 pl-2">
						Find the first commit of any GitHub repository
					</p>
					<input
						type="url"
						placeholder="https://github.com/Doarakko/git-first-commit"
						onKeyDown={handleKeyDown}
						className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
					/>
				</div>
			</div>

			<div>
				<h2 className="text-lg font-semibold pt-4">Featured</h2>
				{repositories.length > 0 && (
					<RepositoryCardList repositories={repositories} />
				)}
			</div>
		</div>
	);
}
