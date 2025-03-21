import { NextResponse } from "next/server";
import { GitHubRepository } from "@/app/db";
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'
const defaultLimit = 9
const maxLimit = 21

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const limitParam = searchParams.get('limit')
        const limit = limitParam ? Number.parseInt(limitParam) : defaultLimit
        if (limit > maxLimit) {
            return NextResponse.json(
                { error: "Invalid limit parameter" },
                { status: 400 }
            );
        }

        const githubRepository = new GitHubRepository(getRequestContext().env.DB);
        const repositories = await githubRepository.GetRepositories(limit);

        return NextResponse.json({ repositories });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch repositories" },
            { status: 500 }
        );
    }
} 