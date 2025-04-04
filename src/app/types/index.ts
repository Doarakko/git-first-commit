export interface Repository {
  id: string;
  platformName: string;
  username: string;
  name: string;
  description: string;
  ownerImageUrl: string;
  createdAt: string;
  commits: Commit[];
}

export interface Commit {
  repositoryId: string;
  order: number;
  url: string;
  message: string;
  authorId: string;
  authorName: string;
  authorUrl: string;
  authorImageUrl: string;
  commitDate: string;
  authorDate: string;
  createdAt: string;
  updatedAt: string;
}
