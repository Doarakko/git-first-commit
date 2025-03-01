import { NextResponse } from "next/server";
import { getRequestContext } from '@cloudflare/next-on-pages'
import { GitHub } from "@/app/github";
import { GitHubRepository } from "@/app/db";

export const runtime = 'edge'

// https://docs.github.com/ja/rest/commits/commits?apiVersion=2022-11-28#list-commits
const startDate = new Date(Date.UTC(1970, 0, 1));

export async function GET(
	request: Request,
) {
	try {
		const { searchParams } = new URL(request.url)
		const username = searchParams.get('username')
		const repositoryName = searchParams.get('repositoryName')

		if (!username || !repositoryName) {
			return NextResponse.json(
				{ error: "Missing required parameters" },
				{ status: 400 }
			);
		}

		const github = new GitHub(process.env.GITHUB_TOKEN || "");
		const githubRepository = new GitHubRepository(getRequestContext().env.DB);
		const response = await githubRepository.GetRepositoryWithCommits(username, repositoryName);
		if (response) {
			return NextResponse.json(response);
		}

		const endDate = new Date();
		const boundaryDate = await github.findBoundaryDate(
			username,
			repositoryName,
			startDate,
			endDate
		);

		const firstCommits = await github.getFirstCommits(
			username,
			repositoryName,
			boundaryDate
		);
		const repository = await github.getRepository(username, repositoryName);

		await githubRepository.AddRepositoryWithCommits(
			username,
			repositoryName,
			repository.owner.avatar_url,
			repository.description || "",
			firstCommits.slice(0, 5).map(commit => ({
				url: commit.html_url,
				message: commit.commit.message,
				authorId: commit.author?.id?.toString() || "",
				authorUrl: commit.author?.html_url || "",
				authorImageUrl: commit.author?.avatar_url || "",
				commitDate: new Date(commit.commit.committer?.date || ""),
				authorDate: new Date(commit.commit.author?.date || "")
			}))
		);

		return NextResponse.json({
			username,
			repositoryName,
			firstCommitDate: boundaryDate,
			commits: firstCommits.slice(0, 5)
		});

	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to fetch repository data" },
			{ status: 500 }
		);
	}
}
