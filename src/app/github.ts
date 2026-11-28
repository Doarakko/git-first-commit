import type { Endpoints } from "@octokit/types";

const API_BASE_URL = "https://api.github.com";

// Octokit を使わず fetch で叩く。呼ぶエンドポイントは2つだけで、
// @octokit/core を入れると推移的依存が11個増えるため。
// 型は @octokit/types（型だけのパッケージ）から引き続き取る。
export class GitHubRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "GitHubRequestError";
  }
}

export class GitHub {
  constructor(private readonly token: string) {}

  private async request<T>(
    path: string,
    query: Record<string, string | number> = {},
  ): Promise<{ data: T; headers: Headers }> {
    const url = new URL(path, API_BASE_URL);
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, String(value));
    }

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      // GitHub API は User-Agent が無いリクエストを拒否する
      "User-Agent": "git-first-commit",
    };
    if (this.token) {
      headers.Authorization = `token ${this.token}`;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new GitHubRequestError(
        response.status,
        `GitHub API ${response.status}: GET ${url.pathname}`,
      );
    }

    return { data: (await response.json()) as T, headers: response.headers };
  }

  private repoPath(owner: string, repo: string): string {
    return `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
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
    const response = await this.request<
      Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"]
    >(`${this.repoPath(username, repositoryName)}/commits`, {
      page: totalPage,
      per_page: 1,
    });

    return response.data;
  }

  private async getTotalPage(
    username: string,
    repositoryName: string,
    branch: string,
  ): Promise<number> {
    const response = await this.request(
      `${this.repoPath(username, repositoryName)}/commits`,
      {
        sha: branch,
        page: 1,
        per_page: 1,
      },
    );

    const linkHeader = response.headers.get("link");
    if (linkHeader === null) {
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
    const response = await this.request<
      Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"]
    >(this.repoPath(username, repositoryName));

    return response.data;
  }
}
