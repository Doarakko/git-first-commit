"use client";
import { useEffect, useState } from "react";
import "./globals.css";
import RepositoryCardList from "@/components/RepositoryCardList";
import type { Repository } from "@/types";

export default function Home() {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch("/api/repositories?limit=18");
        if (!response.ok) {
          console.error("Failed to fetch repositories");
          return;
        }
        const data: { repositories: Repository[] } = await response.json();
        setRepositories(data.repositories ?? []);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    };

    fetchRepositories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 sm:px-6 lg:px-8">
      <div className="pb-24 animate-fade-in-up">
        <h2 className="text-xl font-bold pt-4 pb-2 pl-2 text-gray-700">
          Featured
        </h2>
        {repositories.length > 0 && (
          <RepositoryCardList repositories={repositories} />
        )}
      </div>
    </div>
  );
}
