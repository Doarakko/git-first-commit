-- Baseline: the schema production already had before migrations were tracked.
-- IF NOT EXISTS makes the first `d1 migrations apply --remote` a no-op on the
-- existing database, so it only starts recording applied migrations there.
CREATE TABLE IF NOT EXISTS repositories (
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

CREATE TABLE IF NOT EXISTS commits (
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
