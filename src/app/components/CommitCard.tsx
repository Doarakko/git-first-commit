import type React from "react";
import type { Commit } from "@/types";

interface CommitCardProps {
  commit: Commit;
}

const CommitCard: React.FC<CommitCardProps> = ({ commit }) => {
  return (
    <a
      href={commit.url}
      className="hover:text-gray-900 text-lg group"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="border p-4 rounded-lg min-w-[300px] sm:min-w-[400px] md:min-w-[500px] lg:min-w-[600px] bg-white text-gray-700 break-words shadow-sm group-hover:shadow-md group-hover:border-gray-400 transition-all duration-200">
        <div className="flex items-center gap-4 mb-2">
          {commit.authorImageUrl && commit.authorId ? (
            <>
              <img
                src={commit.authorImageUrl}
                alt={commit.authorId}
                className="w-10 h-10 rounded-full"
              />
              <div className="font-semibold">{commit.authorId}</div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center" />
              <div className="font-semibold">{commit.authorName}</div>
            </>
          )}
        </div>
        {commit.message}
        <div className="text-base text-gray-500 pt-2">
          {new Date(commit.commitDate).toDateString()}
        </div>
      </div>
    </a>
  );
};

export default CommitCard;
