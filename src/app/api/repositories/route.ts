import {
  GITHUB_REPOSITORY_NAME_REGEX,
  GITHUB_REPOSITORY_PATH_REGEX,
} from "@/constants";
import { GitHubRepository } from "@/db";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";

export const runtime = "edge";

const defaultLimit = 9;
const maxLimit = 21;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = searchParams.get("q")?.toLowerCase();
    if (
      queryParam &&
      !GITHUB_REPOSITORY_NAME_REGEX.test(queryParam) &&
      !GITHUB_REPOSITORY_PATH_REGEX.test(queryParam)
    ) {
      return NextResponse.json(
        { error: "Invalid query parameter" },
        { status: 400 },
      );
    }

    const githubRepository = new GitHubRepository(getRequestContext().env.DB);
    if (queryParam) {
      const repositories =
        await githubRepository.SearchRepositories(queryParam);
      return NextResponse.json({ repositories });
    }

    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Number.parseInt(limitParam, 10) : defaultLimit;
    if (limit > maxLimit) {
      return NextResponse.json(
        { error: "Invalid limit parameter" },
        { status: 400 },
      );
    }

    const repositories = await githubRepository.GetRandomRepositories(limit);
    return NextResponse.json({ repositories });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 },
    );
  }
}
