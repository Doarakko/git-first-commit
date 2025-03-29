# git-first-commit

Find the first commit of any GitHub repository.

## Requirements

- npm
- GitHub API token

## Usage

```sh
git clone https://github.com/Doarakko/git-first-commit

cd git-first-commit
cp .env.local.example .env.local

npm i
npm run d1:execute
npm run dev
```

## Hints

### Delete repository with commits

```sh
npx wrangler d1 execute git-first-commit --local --command "
DELETE FROM commits
WHERE repository_id = (
  SELECT id FROM repositories
  WHERE username = '<username>'
  AND name = '<repository>'
);

DELETE FROM repositories
  WHERE username = '<username>'
  AND name = '<repository>'
;
"
```
