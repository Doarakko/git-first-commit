import type React from "react";
import type { Commit } from "@/app/domain";

interface CommitCardProps {
	commit: Commit;
}

const CommitCard: React.FC<CommitCardProps> = ({ commit }) => {
	return (
		<div className="border p-4 rounded-lg min-w-[300px] sm:min-w-[400px] md:min-w-[500px] lg:min-w-[600px] bg-white">
			<div className="flex items-center gap-4 mb-2">
				<img
					src={commit.authorImageUrl}
					alt={commit.authorId}
					className="w-10 h-10 rounded-full"
				/>
				<div>
					<a
						href={commit.authorUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:underline"
					>
						{commit.authorId}
					</a>
				</div>
			</div>
			<a
				href={commit.url}
				className="text-gray-700 hover:underline"
				target="_blank"
				rel="noopener noreferrer"
			>
				{commit.message}
			</a>
			<div className="text-sm text-gray-500">
				{new Date(commit.commitDate).toDateString()}
			</div>
		</div>
	);
};

export default CommitCard;
