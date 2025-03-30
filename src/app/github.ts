import { Octokit } from "@octokit/core";
import type { Endpoints } from "@octokit/types";

export class GitHub {
  private octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  // https://github.com/khalidbelk/FirstCommitter
  public async getFirstCommits(
    username: string,
    repositoryName: string,
    defaultBranch: string,
  ): Promise<
    Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"]
  > {
    const totalPage = await this.getTotalPage(
      username,
      repositoryName,
      defaultBranch,
    );
    const response = await this.octokit.request(
      "GET /repos/{owner}/{repo}/commits",
      {
        owner: username,
        repo: repositoryName,
        page: totalPage,
        per_page: 1,
      },
    );

    return response.data;
  }

  private async getTotalPage(
    username: string,
    repositoryName: string,
    branch: string,
  ): Promise<number> {
    const response = await this.octokit.request(
      "GET /repos/{owner}/{repo}/commits",
      {
        owner: username,
        repo: repositoryName,
        sha: branch,
        page: 1,
        per_page: 1,
      },
    );

    const linkHeader = response.headers.link;
    if (linkHeader === undefined) {
      return 1;
    }

    const links = linkHeader.split(", ");
    for (const link of links) {
      const [urlPart, relPart] = link.split("; ");

      if (relPart?.includes('rel="last"')) {
        const url = urlPart.replace(/<|>/g, "");
        const urlParams = new URL(url).searchParams;
        const page = urlParams.get("page");

        return page ? Number.parseInt(page, 10) : 0;
      }
    }

    return 1;
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
}
