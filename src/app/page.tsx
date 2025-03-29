"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./globals.css";
import RepositoryCardList from "@/components/RepositoryCardList";
import type { Repository } from "@/types";

const githubRepositoryRegex =
	/^https?:\/\/(www\.)?github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9._-]+)(\/|\.git)?$/;

export default function Home() {
	const router = useRouter();
	const [repositories, setRepositories] = useState<Repository[]>([]);
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);

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

	useEffect(() => {
		if (loading) {
			const interval = setInterval(() => {
				setProgress((oldProgress) => {
					if (oldProgress === 100) {
						clearInterval(interval);
						return 100;
					}
					const diff = Math.random() * 10;
					return Math.min(oldProgress + diff, 100);
				});
			}, 300);
			return () => {
				clearInterval(interval);
			};
		}
	}, [loading]);

	const handleKeyDown = async (
		event: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (event.key !== "Enter") {
			return;
		}

		const url = event.currentTarget.value;
		const match = url.match(githubRepositoryRegex);
		if (!match) {
			setError(
				"Invalid URL format. Please enter a valid GitHub repository URL.",
			);
			return;
		}

		setError(null);
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

		if (response.status === 404) {
			setError(
				"Repository not found. Please enter a valid GitHub repository URL.",
			);
			return;
		}
		if (!response.ok) {
			setError(
				"Failed to search fisrt commit due to exceeding the GitHub API rate limit. Please try again after about 30 minutes.",
			);
			return;
		}

		setError(null);
		router.replace(`${username}/${repositoryName}`);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-gray-700">
				<h1 className="text-2xl mb-4">Searching...</h1>
				<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200">
					<div
						className="bg-blue-400 h-2.5 rounded-full"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full text-left">
				<div className="mt-8">
					<p className="mt-2 text-base pb-2 pl-2 text-gray-700">
						Find the first commit of any GitHub repository
					</p>
					<input
						type="url"
						placeholder="https://github.com/Doarakko/git-first-commit"
						onKeyDown={handleKeyDown}
						onFocus={() => setError(null)}
						className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-700 rounded-md focus:outline-hidden focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white"
					/>
					{error && <div className="text-red-500 text-sm mt-2">{error}</div>}
				</div>
			</div>

			<div>
				<h2 className="text-xl font-bold pt-24 pb-2 pl-2 text-gray-700">
					Featured
				</h2>
				{repositories.length > 0 && (
					<RepositoryCardList repositories={repositories} />
				)}
			</div>
		</div>
	);
}
