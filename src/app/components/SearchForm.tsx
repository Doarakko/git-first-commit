"use client";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import "@/globals.css";
import {
  GITHUB_REPOSITORY_NAME_REGEX,
  GITHUB_REPOSITORY_PATH_REGEX,
} from "@/constants";
import type { Repository } from "@/types";

interface SearchFormProps {
  setLoading: (loading: boolean) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ setLoading }) => {
  const router = useRouter();
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
        const path = event.currentTarget.value;
        await find(path);
      }
    }
  };

  async function find(s: string) {
    const match = s.match(GITHUB_REPOSITORY_PATH_REGEX);
    if (!match) {
      setError("Invalid format.");
      return;
    }

    const username = match[1];
    const repositoryName = match[2];
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
      setError("Repository not found.");
      return;
    }
    if (response.status === 400) {
      setError("Invalid format.");
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

    if (
      !GITHUB_REPOSITORY_NAME_REGEX.test(query) &&
      !GITHUB_REPOSITORY_PATH_REGEX.test(query)
    ) {
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
    const path = `${repo.username}/${repo.name}`;
    setInputValue(path);
    setSuggestions([]);
    setSelectedIndex(-1);

    find(path);
  };

  return (
    <div className="max-w-md w-full sm:w-xs md:w-sm lg:w-lg">
      <div className="flex items-center border border-gray-300 rounded-md">
        <span className="bg-gray-100 text-gray-500 px-2 py-2 rounded-l-md">
          https://github.com/
        </span>
        <div>
          <input
            type="text"
            placeholder="Doarakko/git-first-commit"
            value={inputValue}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            onFocus={() => setError(null)}
            className="w-full px-2 py-2 placeholder-gray-500 text-gray-700 rounded-md focus:outline-hidden focus:ring-blue-500 focus:border-blue-500 focus:z-10 bg-white"
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
      </div>
    </div>
  );
};

export default SearchForm;
