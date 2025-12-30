import CommitCard from "@/components/CommitCard";
import RepositoryCardList from "@/components/RepositoryCardList";
import { DEFAULT_METADATA } from "@/constants";
import type { Commit, Repository } from "@/types";
import type { Metadata } from "next";

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
  const repositoryResponse = await fetch(
    `${process.env.PUBLIC_URL}/api/repositories?limit=12`,
  );
  if (!repositoryResponse.ok) {
    console.error("Failed to fetch repositories");
    return;
  }
  const repositoryJson: { repositories: Repository[] } =
    await repositoryResponse.json();
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
      <div className="min-h-screen bg-gray-100 flex flex-col py-12 px-4 sm:px-6 md:px-8 lg:px-10 text-gray-700">
        <div className="w-full max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">
            {params.username}/{params.repositoryName} is not found.
          </h1>
          <div>
            <div className=" max-w-4xl mx-auto">
              <h2 className="text-xl font-bold pt-12 pb-2 text-left">
                Featured
              </h2>
            </div>
            <div className="flex justify-center w-full max-w-4xl mx-auto pb-12">
              {repositories.length > 0 && (
                <RepositoryCardList repositories={repositories} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const json: { repository: Repository; commits: Commit[] } =
    await response.json();
  const { repository, commits } = json;
  const commit = commits[0];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col py-12 px-4 sm:px-6 md:px-8 lg:px-10 text-gray-700">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold flex items-center gap-2 pb-2">
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
      </div>
      <div className="w-full max-w-4xl mx-auto pl-2">
        <p className="text-gray-500 pb-2">{repository.description}</p>
      </div>
      <div className="w-full max-w-4xl mx-auto">
        {commit ? (
          <CommitCard key={commit.url} commit={commit} />
        ) : (
          <p className="text-gray-700">This repository has no commits.</p>
        )}
      </div>
      <div>
        <div className=" max-w-4xl mx-auto">
          <h2 className="text-xl font-bold pb-2 pt-8 text-left">Deepdive</h2>
        </div>
        <div className="bg-black text-white p-4 rounded-md shadow-md w-full max-w-4xl mx-auto">
          <pre className="whitespace-pre-wrap break-words">
            <code>
              git clone https://github.com/{repository.username}/
              {repository.name} && cd {repository.name} && git log --reverse
            </code>
          </pre>
        </div>
      </div>
      <div>
        <div className=" max-w-4xl mx-auto">
          <h2 className="text-xl font-bold pt-8 pb-2 text-left">Featured</h2>
        </div>
        <div className="flex justify-center w-full max-w-4xl mx-auto pb-12">
          {repositories.length > 0 && (
            <RepositoryCardList repositories={repositories} />
          )}
        </div>
      </div>
    </div>
  );
}
