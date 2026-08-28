import { useEffect, useState } from "react";

import VideoCard from "../components/VideoCard";
import CategoryFilter from "../components/CategoryFilter";
import API from "../api/api";
import Loader from "../components/Loader";


function HomePage() {
  // Store videos received from the backend
  const [videos, setVideos] = useState([]);

  // Store currently selected category
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Loading state
  const [loading, setLoading] = useState(true);

  // Error state
  const [error, setError] = useState("");

  // Loader

  

  // Fetch videos based on selected category
  const fetchVideos = async (category = "All") => {
    try {
      setLoading(true);
      setError("");

      // If "All" is selected, fetch all videos
      // Otherwise, fetch videos from the selected category
      const url =
        category === "All"
          ? "/videos"
          : `/videos?category=${encodeURIComponent(category)}`;

      // API request
      const response = await API.get(url);

      // Save videos received from backend
      setVideos(response.data.data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);

      setError("Failed to load videos. Please try again.");

      // Clear videos if request fails
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch videos whenever the selected category changes
  useEffect(() => {
    fetchVideos(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen px-0 py-3 sm:px-6 sm:py-5 lg:px-8">
      {/* Category filter buttons */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Loading state */}
      {loading && <Loader />}

      {/* Error state */}
      {!loading && error && (
        <div className="flex min-h-60 items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Video grid */}
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

      {/* No videos found */}
      {!loading && !error && videos.length === 0 && (
        <div className="flex min-h-60 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            No videos found in this category.
          </p>
        </div>
      )}
    </div>
  );
}

export default HomePage;
