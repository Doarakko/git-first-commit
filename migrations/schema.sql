DROP TABLE IF EXISTS commits;
DROP TABLE IF EXISTS repositories;

CREATE TABLE repositories (
  id TEXT PRIMARY KEY,
  platform_name TEXT NOT NULL,
  username TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  owner_image_url TEXT NOT NULL,
  star_count INTEGER NOT NULL,
  platform_created_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(platform_name, username, name)
);

CREATE TABLE commits (
  id INTEGER PRIMARY KEY,
  repository_id TEXT NOT NULL,
  url TEXT NOT NULL,
  message TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_url TEXT NOT NULL,
  author_image_url TEXT NOT NULL,
  commit_date DATETIME NOT NULL,
  author_date DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(repository_id) REFERENCES repositories(id),
  UNIQUE(url)
);

-- The detail page looks a repository up by (username, name) and joins its
-- commits. The UNIQUE above leads with platform_name, which the query does not
-- filter on, and commits had no index on repository_id, so every page view
-- scanned both tables (744 rows read at 372 repositories). With these two the
-- lookup reads a handful of rows regardless of how many repositories exist.
CREATE INDEX IF NOT EXISTS idx_repositories_username_name ON repositories (username, name);
CREATE INDEX IF NOT EXISTS idx_commits_repository_id ON commits (repository_id);
