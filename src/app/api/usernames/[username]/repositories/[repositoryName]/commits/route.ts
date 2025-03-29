import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { RequestError } from "@octokit/request-error";
import { GitHub } from "@/github";
import { GitHubRepository } from "@/db";
import { GITHUB_REPOSITORY_NAME_REGEX } from "@/constants";

export const runtime = "edge";

// https://docs.github.com/ja/rest/commits/commits?apiVersion=2022-11-28#list-commits
const startDate = new Date(Date.UTC(1970, 0, 1));

const defaultCommitLimit = 1;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const repositoryName = searchParams.get("repositoryName");

    if (!username || !repositoryName) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    if (
      !GITHUB_REPOSITORY_NAME_REGEX.test(repositoryName) ||
      !GITHUB_REPOSITORY_NAME_REGEX.test(username)
    ) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    const githubRepository = new GitHubRepository(getRequestContext().env.DB);
    const response = await githubRepository.GetRepositoryWithCommits(
      username,
      repositoryName,
    );
    if (response) {
      return NextResponse.json(response);
    }

    const github = new GitHub(process.env.GITHUB_TOKEN || "");
    const repository = await github.getRepository(username, repositoryName);

    const firstCommits = await github.getFirstCommits(
      username,
      repositoryName,
      repository.default_branch,
    );

    const commitAuthorDate = firstCommits[0].commit.author?.date;
    await githubRepository.AddRepositoryWithCommits(
      username,
      repositoryName,
      repository.owner.avatar_url,
      repository.description || "",
      repository.stargazers_count,
      repository.created_at,
      firstCommits.slice(0, defaultCommitLimit).map((commit) => ({
        url: commit.html_url,
        message: commit.commit.message,
        authorId: commit.author?.login?.toString() || "",
        authorName: commit.commit.author?.name || "",
        authorUrl: commit.author?.html_url || "",
        authorImageUrl: commit.author?.avatar_url || "",
        commitDate: new Date(commitAuthorDate || ""),
        authorDate: new Date(commit.commit.author?.date || ""),
      })),
    );

    return NextResponse.json({
      username,
      repositoryName,
      firstCommitDate: commitAuthorDate,
      commits: firstCommits.slice,
    });
  } catch (error) {
    if (error instanceof RequestError) {
      if (error.status === 404) {
        return NextResponse.json(
          { error: "Repository not found" },
          { status: 404 },
        );
      }

      // https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28#exceeding-the-rate-limit
      if (error.status === 403 || error.status === 429) {
        return NextResponse.json(
          { error: "GitHub API rate limit exceeded" },
          { status: 429 },
        );
      }
    }

    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch repository data" },
      { status: 500 },
    );
  }
}
