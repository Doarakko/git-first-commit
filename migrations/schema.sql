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
