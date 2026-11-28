-- The detail page looks a repository up by (username, name) and joins its
-- commits. The UNIQUE on repositories leads with platform_name, which the query does not
-- filter on, and commits had no index on repository_id, so every page view
-- scanned both tables (744 rows read at 372 repositories). With these two the
-- lookup reads a handful of rows regardless of how many repositories exist.
CREATE INDEX IF NOT EXISTS idx_repositories_username_name ON repositories (username, name);
CREATE INDEX IF NOT EXISTS idx_commits_repository_id ON commits (repository_id);
