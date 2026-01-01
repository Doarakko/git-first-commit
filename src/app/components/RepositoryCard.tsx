import type React from "react";
import type { Repository } from "@/types";

interface RepositoryCardProps {
  repo: Repository;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repo }) => {
  return (
    <a
      key={repo.id}
      href={`/${repo.username}/${repo.name}`}
      className="block bg-white shadow-sm rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ease-out"
    >
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <img
            src={repo.ownerImageUrl}
            alt={`${repo.username}'s avatar`}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-gray-700 font-medium truncate">
            {repo.username}/{repo.name}
          </span>
        </div>
        {repo.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {repo.description}
          </p>
        )}
      </div>
    </a>
  );
};

export default RepositoryCard;
