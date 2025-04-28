import { useState } from 'react';

interface CatImage {
  id: string;
  tags: string[];
  createdAt: string;
}

export default function CatGallery() {
  const [tag, setTag] = useState('');
  const [catImages, setCatImages] = useState<CatImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchCatImages() {
    setLoading(true);
    setError(null);

    try {
      let url = 'https://cataas.com/api/cats?limit=20';
      if (tag) {
        url += `&tags=${tag}`;
      }
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCatImages(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by tag (e.g., cute, funny)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <button
          onClick={fetchCatImages}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Search Cats
        </button>
      </div>

      {loading && <div className="text-center text-gray-600">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catImages.map((cat) => (
          <div key={cat.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <img
              src={`https://cataas.com/cat/${cat.id}`}
              alt={`Cat with tags: ${cat.tags.join(', ')}`}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {cat.tags.map((tag) => (
                  <span
                    key={tag}
                    onClick={() => setTag(tag)}
                    className="px-2 py-1 bg-gray-100 text-sm text-gray-600 rounded-full cursor-pointer hover:bg-gray-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
