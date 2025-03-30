import type { Repository, Commit } from "@/types";

export class GitHubRepository {
  private db: D1Database;
  constructor(db: D1Database) {
    this.db = db;
  }

  public async GetRepositoryWithCommits(
    username: string,
    repositoryName: string,
  ): Promise<{ repository: Repository; commits: Commit[] } | null> {
    const { results } = await this.db
      .prepare(
        `SELECT 
					r.id,
					r.platform_name as platformName,
					r.username,
					r.name,
					r.owner_image_url as ownerImageUrl,
					r.description,
					r.created_at as createdAt,
					r.updated_at as updatedAt,
					c.id as commitId,
					c.repository_id as repositoryId,
					c.url,
					c.message,
					c.author_id as authorId,
					c.author_name as authorName,
					c.author_url as authorUrl,
					c.author_image_url as authorImageUrl,
					c.commit_date as commitDate,
					c.author_date as authorDate,
					c.created_at as createdAt,
					c.updated_at as updatedAt
				FROM repositories r
				LEFT JOIN commits c ON r.id = c.repository_id
				WHERE r.username = ?
					AND r.name = ?
				ORDER BY c.commit_date ASC`,
      )
      .bind(username, repositoryName)
      .all();

    if (!results?.length) return null;

    return {
      repository: results[0] as unknown as Repository,
      commits: results.map((row) => row as unknown as Commit),
    };
  }

  public async AddRepositoryWithCommits(
    username: string,
    repositoryName: string,
    ownerImageUrl: string,
    repositoryDescription: string,
    starCount: number,
    platformCreatedDate: string,
    commits: {
      url: string;
      message: string;
      authorId: string;
      authorName: string;
      authorUrl: string;
      authorImageUrl: string;
      commitDate: Date;
      authorDate: Date;
    }[],
  ): Promise<void> {
    try {
      const repositoryId = crypto.randomUUID();
      const batch = [];

      batch.push(
        this.db
          .prepare(
            `INSERT INTO repositories (
						id,
						platform_name,
						username,
						name,
						owner_image_url,
						description,
						star_count,
						platform_created_at
					) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .bind(
            repositoryId,
            "github",
            username,
            repositoryName,
            ownerImageUrl,
            repositoryDescription,
            starCount,
            platformCreatedDate,
          ),
      );

      const commitStmt = this.db.prepare(
        `INSERT INTO commits (
					repository_id,
					url,
					message,
					author_id,
					author_name,
					author_url,
					author_image_url,
					commit_date,
					author_date
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      );

      for (let i = 0; i < commits.length; i++) {
        const commit = commits[i];

        batch.push(
          commitStmt.bind(
            repositoryId,
            commit.url,
            commit.message,
            commit.authorId,
            commit.authorName,
            commit.authorUrl,
            commit.authorImageUrl,
            commit.commitDate.toISOString(),
            commit.authorDate.toISOString(),
          ),
        );
      }

      await this.db.batch(batch);
    } catch (error) {
      console.error("Failed to add repository with commits:", error);
      throw error;
    }
  }

  public async GetRandomRepositories(
    limit: number,
    minimumStarCount = 10,
  ): Promise<Repository[]> {
    const { results } = await this.db
      .prepare(
        `SELECT 
					r.id,
					r.platform_name as platformName,
					r.username,
					r.name as name,
					r.owner_image_url as ownerImageUrl,
					r.description,
					r.created_at as createdAt,
					r.updated_at as updatedAt
				FROM repositories r
				WHERE r.star_count >= ?
				ORDER BY RANDOM()
				LIMIT ?`,
      )
      .bind(minimumStarCount, limit)
      .all();

    if (!results?.length) return [];

    return results.map((row) => row as unknown as Repository);
  }

  public async SearchRepositories(
    query: string,
    limit = 3,
  ): Promise<Repository[]> {
    const { results } = await this.db
      .prepare(
        `SELECT 
					r.id,
					r.platform_name as platformName,
					r.username,
					r.name as name,
					r.owner_image_url as ownerImageUrl,
					r.description,
					r.created_at as createdAt,
					r.updated_at as updatedAt
				FROM repositories r
				WHERE r.username LIKE ? OR r.name LIKE ?
				LIMIT ?`,
      )
      .bind(`%${query}%`, `%${query}%`, limit)
      .all();

    if (!results?.length) return [];

    return results.map((row) => row as unknown as Repository);
  }
}
