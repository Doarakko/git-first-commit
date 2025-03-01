import { Octokit } from "@octokit/core";
import type { Endpoints } from "@octokit/types";

export class GitHub {
	private octokit: Octokit;

	constructor(token: string) {
		this.octokit = new Octokit({ auth: token });
	}

	private zeroFillDate(t: Date): Date {
		return new Date(
			t.getFullYear(),
			t.getMonth(),
			t.getDate(),
			0, 0, 0, 0,
		);
	}

	public async hasCommit(
		username: string,
		repositoryName: string,
		date: Date
	): Promise<boolean> {
		const response = await this.octokit.request("GET /repos/{owner}/{repo}/commits", {
			owner: username,
			repo: repositoryName,
			until: date.toISOString(),
			per_page: 100,
		});

		return response.data.length > 0;
	}

	public async getFirstCommits(
		username: string,
		repositoryName: string,
		date: Date
	): Promise<Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"]> {
		// TODO: Handle cases where there are more than 100 commits per day
		const response = await this.octokit.request("GET /repos/{owner}/{repo}/commits", {
			owner: username,
			repo: repositoryName,
			until: date.toISOString(),
			per_page: 100,
		});

		return response.data;
	}

	public async getRepository(
		username: string,
		repositoryName: string,
	): Promise<Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"]> {
		const response = await this.octokit.request("GET /repos/{owner}/{repo}", {
			owner: username,
			repo: repositoryName,
		});

		return response.data;
	}

	public async findBoundaryDate(
		username: string,
		repositoryName: string,
		start: Date,
		end: Date
	): Promise<Date> {
		let count = 0;
		let startDate = start;
		let endDate = end;

		while (startDate < endDate) {
			// TODO: Set initial value to repository creation date
			let mid = new Date(startDate.getTime() + (endDate.getTime() - startDate.getTime()) / 2);
			mid = this.zeroFillDate(mid);

			const hasCommitResult = await this.hasCommit(username, repositoryName, mid);
			if (hasCommitResult) {
				endDate = mid;
			} else {
				startDate = new Date(mid.getTime() + 24 * 60 * 60 * 1000);
			}

			startDate = this.zeroFillDate(startDate);
			endDate = this.zeroFillDate(endDate);
			count++;

			console.log("count", count, startDate, endDate);
		}

		return startDate;
	}
}
