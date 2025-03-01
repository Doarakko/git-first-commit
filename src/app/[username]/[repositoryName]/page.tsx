import type { Commit, Repository } from "@/app/domain";

export const runtime = "edge";

export default async function Page(props: {
	params: Promise<{ username: string; repositoryName: string }>;
}) {
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
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">
				<a
					href={`https://${repository.platformName}.com/${repository.username}/${repository.repositoryName}`}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-500 hover:underline"
				>
					{repository.username}/{repository.repositoryName}
				</a>
			</h1>
			<div className="space-y-4">
				{commits.map((commit) => (
					<div key={commit.url} className="border p-4 rounded-lg">
						<div className="flex items-center gap-4 mb-2">
							<img
								src={commit.authorImageUrl}
								alt={commit.authorId}
								className="w-10 h-10 rounded-full"
							/>
							<div>
								<a
									href={commit.authorUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-500 hover:underline"
								>
									{commit.authorId}
								</a>
								<div className="text-sm text-gray-500">
									{new Date(commit.commitDate).toLocaleDateString()}
								</div>
							</div>
						</div>
						<p className="text-gray-700">{commit.message}</p>
						<a
							href={commit.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-blue-500 hover:underline mt-2 inline-block"
						>
							View commit →
						</a>
					</div>
				))}
			</div>
		</div>
	);
}
