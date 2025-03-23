import type { Metadata } from "next";
import type { Commit, Repository } from "@/types";
import RepositoryCardList from "@/components/RepositoryCardList";
import CommitCard from "@/components/CommitCard";
import { DEFAULT_METADATA } from "@/constants";

export const runtime = "edge";

type Props = {
	params: Promise<{ username: string; repositoryName: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { username, repositoryName } = await params;
	const response = await fetch(
		`${process.env.PUBLIC_URL}/api/usernames/${username}/repositories/${repositoryName}/commits`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
	if (!response.ok) {
		return DEFAULT_METADATA;
	}
	const json: { repository: Repository } = await response.json();

	return {
		...DEFAULT_METADATA,
		title: `${username}/${repositoryName}`,
		description: `This is the first commit of ${username}/${repositoryName}. ${username}/${repositoryName} is ${json.repository.description}`,
		openGraph: {
			...DEFAULT_METADATA.openGraph,
			title: `${username}/${repositoryName}`,
			description: `This is the first commit of ${username}/${repositoryName}. ${username}/${repositoryName} is ${json.repository.description}`,
		},
	};
}

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
		<div className="min-h-screen bg-gray-100 flex flex-col py-12 px-4 sm:px-6 lg:px-8 text-gray-700">
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
					className="hover:text-gray-900"
				>
					{repository.username}/{repository.name}
				</a>
			</h1>
			<p className="text-gray-500 mb-4">{repository.description}</p>
			<div className="space-y-4">
				{commits.map((commit) => (
					<CommitCard key={commit.url} commit={commit} />
				))}
			</div>
			<div>
				<h2 className="text-xl font-bold">Let's deepdive!</h2>
				<div className=" bg-black text-white p-4 rounded-md shadow-md min-w-[300px] sm:min-w-[400px] md:min-w-[500px] lg:min-w-[600px]">
					<pre className="whitespace-pre-wrap">
						<code>
							git clone https://github.com/{repository.username}/
							{repository.name} && cd {repository.name} && git log --reverse
						</code>
					</pre>
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
