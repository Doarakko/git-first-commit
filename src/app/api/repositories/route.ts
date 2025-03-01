import { NextResponse } from "next/server";
import { GitHubRepository } from "@/app/db";
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export async function GET() {
    try {
        const githubRepository = new GitHubRepository(getRequestContext().env.DB);
        const repositories = await githubRepository.GetRepositories();

        return NextResponse.json({ repositories });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch repositories" },
            { status: 500 }
        );
    }
} 