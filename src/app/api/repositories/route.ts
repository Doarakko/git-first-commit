import {
  GITHUB_REPOSITORY_NAME_REGEX,
  GITHUB_REPOSITORY_PATH_REGEX,
} from "@/constants";
import { GitHubRepository } from "@/db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

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

    const { env } = await getCloudflareContext();
    const githubRepository = new GitHubRepository(env.DB);
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
    console.error("Failed to fetch repositories:", error);
    console.error("Error name:", error instanceof Error ? error.name : "unknown");
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Error stack:", error instanceof Error ? error.stack : "no stack");
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 },
    );
  }
}
