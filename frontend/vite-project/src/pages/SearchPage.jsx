import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import VideoCard from "../components/VideoCard";
import API from "../api/api";

function SearchPage() {
  // Get search query from URL
  // Example: /search?query=React
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query") || "";

  // Store search results
  const [videos, setVideos] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Error state
  const [error, setError] = useState("");

  // Search videos
  const searchVideos = async () => {
    try {
      setLoading(true);
      setError("");

      // Do not search if query is empty
      if (!query.trim()) {
        setVideos([]);
        return;
      }

      // Call backend search API
      const response = await API.get(
        `/videos/search?search=${encodeURIComponent(query)}`,
      );

      // Save search results
      setVideos(response.data.data || []);
    } catch (error) {
      console.error("Error searching videos:", error);

      setError("Failed to search videos. Please try again.");

      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // Run search whenever URL query changes
  useEffect(() => {
    searchVideos();
  }, [query]);

  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      {/* Search heading */}
      {!loading && !error && query && (
        <h1 className="mb-6 text-xl font-semibold">
          Search results for: "{query}"
        </h1>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex min-h-60 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            Searching videos...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex min-h-60 items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Search Results */}
      {!loading && !error && videos.length > 0 && (
        <div
          className="
            grid
            grid-cols-1
            gap-y-6
            sm:grid-cols-2
            sm:gap-4
            lg:grid-cols-3
            xl:grid-cols-4
          "
        >
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && !error && query && videos.length === 0 && (
        <div className="flex min-h-60 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            No videos found for "{query}".
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
