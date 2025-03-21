import type { Commit, Repository } from "@/app/domain";
import RepositoryCardList from "../../components/RepositoryCardList";
import CommitCard from "../../components/CommitCard";

export const runtime = "edge";

export default async function Page(props: {
	params: Promise<{ username: string; repositoryName: string }>;
}) {
	const repositortResponse = await fetch(
		`${process.env.PUBLIC_URL}/api/repositories`,
	);
	if (!repositortResponse.ok) {
		console.error("Failed to fetch repositories");
		return;
	}
	const repositoryJson: { repositories: Repository[] } =
		await repositortResponse.json();
	const repositories = repositoryJson.repositories ?? [];

	const params = await props.params;
	const response = await fetch(
		`${process.env.PUBLIC_URL}/api/usernames/${params.username}/repositories/${params.repositoryName}/commits`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		},
	);

	if (!response.ok) {
		return (
			<div className="p-4">
				<h1 className="text-2xl font-bold mb-4">Repository not found</h1>
			</div>
		);
	}

	const json: { repository: Repository; commits: Commit[] } =
		await response.json();
	const { repository, commits } = json;

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
			<h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
				<img
					src={repository.ownerImageUrl}
					alt={`${repository.username}'s avatar`}
					className="w-8 h-8 rounded-full"
				/>
				<a
					href={`https://${repository.platformName}.com/${repository.username}/${repository.name}`}
					target="_blank"
					rel="noopener noreferrer"
					className="hover:underline"
				>
					{repository.username}/{repository.name}
				</a>
			</h1>
			<div className="space-y-4">
				{commits.map((commit) => (
					<CommitCard key={commit.url} commit={commit} />
				))}
			</div>
			{repositories.length > 0 && (
				<RepositoryCardList repositories={repositories} />
			)}
		</div>
	);
}
