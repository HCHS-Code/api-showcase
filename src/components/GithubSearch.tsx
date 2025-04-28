import { useState } from 'react';

interface Repository {
  id: number;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  owner: {
    avatar_url: string;
    login: string;
  };
}

export default function GithubSearch() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function searchRepositories(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(
          query
        )}&sort=stars&page=${page}&per_page=10`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      setRepositories(data.items);
      setTotalCount(data.total_count);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <form onSubmit={searchRepositories} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search repositories (e.g., 'react')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {loading && <div className="text-center text-gray-600">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      {totalCount > 0 && (
        <div className="text-center text-gray-600 mb-4">
          Found {totalCount.toLocaleString()} repositories
        </div>
      )}

      <div className="grid gap-6">
        {repositories.map((repo) => (
          <div key={repo.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={repo.owner.avatar_url}
                alt={`${repo.owner.login}'s avatar`}
                className="w-10 h-10 rounded-full"
              />
              <h2 className="text-xl font-semibold">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {repo.full_name}
                </a>
              </h2>
            </div>

            <p className="text-gray-600 mb-4">{repo.description}</p>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>⭐ {repo.stargazers_count.toLocaleString()}</span>
              <span>🔀 {repo.forks_count.toLocaleString()}</span>
              {repo.language && <span>💻 {repo.language}</span>}
            </div>

            {repo.topics.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {repo.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
