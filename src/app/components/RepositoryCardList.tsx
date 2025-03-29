import type React from "react";
import type { Repository } from "@/types";
import RepositoryCard from "@/components/RepositoryCard";

interface RepositoryCardListProps {
  repositories: Repository[];
}

const RepositoryCardList: React.FC<RepositoryCardListProps> = ({
  repositories,
}) => {
  return (
    <div className="max-w-6xl w-full pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {repositories.map((repo) => (
          <RepositoryCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
};

export default RepositoryCardList;
