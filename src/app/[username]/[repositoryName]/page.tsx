"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CommitCard from "@/components/CommitCard";
import RepositoryCardList from "@/components/RepositoryCardList";
import type { Commit, Repository } from "@/types";

export default function Page() {
  const params = useParams<{ username: string; repositoryName: string }>();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [commit, setCommit] = useState<Commit | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured repositories
        const repoResponse = await fetch("/api/repositories?limit=12");
        if (repoResponse.ok) {
          const repoData: { repositories: Repository[] } =
            await repoResponse.json();
          setRepositories(repoData.repositories ?? []);
        }

        // Fetch repository commits
        const response = await fetch(
          `/api/usernames/${params.username}/repositories/${params.repositoryName}/commits`,
        );
        if (!response.ok) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const data: { repository: Repository; commits: Commit[] } =
          await response.json();
        setRepository(data.repository);
        setCommit(data.commits?.[0] ?? null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.username, params.repositoryName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  if (notFound || !repository) {
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
