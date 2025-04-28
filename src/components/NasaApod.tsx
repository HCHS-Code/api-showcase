import { useState } from 'react';

interface APODData {
  date: string;
  explanation: string;
  media_type: 'image' | 'video';
  title: string;
  url: string;
  copyright?: string;
}

export default function NasaApod() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [apodData, setApodData] = useState<APODData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchAPOD() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?date=${selectedDate}&api_key=DEMO_KEY`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setApodData(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-4">
          <input
            type="date"
            max={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={fetchAPOD}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            View APOD
          </button>
        </div>
      </div>

      {loading && <div className="text-center text-gray-600">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      {apodData && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{apodData.title}</h2>

            {apodData.media_type === 'image' ? (
              <img
                src={apodData.url}
                alt={apodData.title}
                className="w-full rounded-lg mb-4"
              />
            ) : (
              <div className="relative pb-[56.25%] mb-4">
                <iframe
                  src={apodData.url}
                  title={apodData.title}
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            )}

            <p className="text-gray-700 mb-4 leading-relaxed">
              {apodData.explanation}
            </p>

            <div className="text-sm text-gray-500">
              <p>Date: {apodData.date}</p>
              {apodData.copyright && <p>Copyright: {apodData.copyright}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
