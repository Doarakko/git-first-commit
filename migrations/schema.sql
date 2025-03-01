DROP TABLE IF EXISTS commits;
DROP TABLE IF EXISTS repositories;

CREATE TABLE repositories (
  id TEXT PRIMARY KEY,
  platform_name TEXT NOT NULL,
  username TEXT NOT NULL,
  repository_name TEXT NOT NULL,
  repository_description TEXT NOT NULL,
  owner_image_url TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(platform_name, username, repository_name)
);

CREATE TABLE commits (
  id INTEGER PRIMARY KEY,
  repository_id TEXT NOT NULL,
  url TEXT NOT NULL,
  message TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_url TEXT NOT NULL,
  author_image_url TEXT NOT NULL,
  commit_date DATETIME NOT NULL,
  author_date DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(repository_id) REFERENCES repositories(id),
  UNIQUE(url)
);
