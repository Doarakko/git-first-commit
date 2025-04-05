"use client";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import "@/globals.css";
import { GITHUB_REPOSITORY_NAME_REGEX } from "@/constants";
import type { Repository } from "@/types";

const githubRepositoryUrlRegex =
  /^https?:\/\/(www\.)?github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9._-]+)(\/|\.git)?$/;

const Header: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Repository[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    setError(null);
    if (event.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        Math.min(prevIndex + 1, suggestions.length - 1),
      );
      event.preventDefault();
      return;
    }
    if (event.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      event.preventDefault();
      return;
    }
    if (event.key === "Enter") {
      if (selectedIndex >= 0) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else {
        const url = event.currentTarget.value;
        await find(url);
      }
    }
  };

  async function find(url: string) {
    const match = url.match(githubRepositoryUrlRegex);
    if (!match) {
      setError(
        "Invalid URL format. Please enter a valid GitHub repository URL.",
      );
      return;
    }

    const username = match[2];
    const repositoryName = match[3];
    setLoading(true);
    const response = await fetch(
      `/api/usernames/${username}/repositories/${repositoryName}/commits`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    setLoading(false);

    if (response.ok) {
      setError(null);
      router.push(`/${username}/${repositoryName}`);
      return;
    }

    if (response.status === 404) {
      setError(
        "Repository not found. Please enter a valid GitHub repository URL.",
      );
      return;
    }
    if (response.status === 400) {
      setError(
        "Invalid URL format. Please enter a valid GitHub repository URL.",
      );
      return;
    }
    if (response.status === 429) {
      setError(
        "Failed to find first commit due to exceeding the GitHub API rate limit. Please try again after about 30 minutes.",
      );
      return;
    }

    setError(
      "Failed to find first commit due to unknown error. Please try again later or report via GitHub Issue.",
    );
  }

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const query = event.target.value;
    setInputValue(query);
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    if (!GITHUB_REPOSITORY_NAME_REGEX.test(query)) {
      setSuggestions([]);
      return;
    }

    const response = await fetch(`/api/repositories?q=${query}`);

    const data: { repositories: Repository[] } = await response.json();
    setSuggestions(data.repositories ? data.repositories : []);
  };

  const handleSuggestionClick = (repo: Repository) => {
    if (!repo) {
      return;
    }
    const url = `https://github.com/${repo.username}/${repo.name}`;
    setInputValue(url);
    setSuggestions([]);
    setSelectedIndex(-1);

    find(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-gray-700">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4" />
      </div>
    );
  }

  return (
    <header className="py-4 px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-700">
          <a href="/" className="hover:text-gray-900">
            Git First Commit
          </a>
        </h1>
        <div className="max-w-md w-full sm:w-xs md:w-sm lg:w-lg px-4">
          <input
            type="url"
            placeholder="https://github.com/Doarakko/git-first-commit"
            value={inputValue}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            onFocus={() => setError(null)}
            className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-700 rounded-md focus:outline-hidden focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white"
          />

          {suggestions.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 z-10">
              {suggestions.map((repo, index) => (
                // biome-ignore lint: Todo
                <li
                  key={repo.id}
                  className={`text-gray-700 p-2 cursor-pointer px-4 ${selectedIndex === index ? "bg-gray-100" : ""}`}
                  onClick={() => handleSuggestionClick(repo)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {repo.username}/{repo.name}
                </li>
              ))}
            </ul>
          )}
          {error && (
            <div className="text-red-500 text-sm pt-6 absolute">{error}</div>
          )}
        </div>

        <div className="flex gap-4">
          <a
            href="https://github.com/Doarakko/git-first-commit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">View GitHub Repository</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
