import { Link } from "react-router-dom";
import getTimeAgo from "../../utils/getTimeAgo";

function RecommendedVideos({ videos }) {
  return (
    <aside className="w-full">
      {/* Heading */}
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Recommended videos
      </h2>

      {/* Videos */}
      <div className="space-y-3">
        {videos.map((video) => (
          <Link
            key={video._id}
            to={`/watch/${video._id}`}
            className="
              flex
              gap-3
              rounded-lg
              p-1
              transition
              hover:bg-gray-100
              dark:hover:bg-gray-800
            "
          >
            {/* Thumbnail */}
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="
                h-24
                w-40
                shrink-0
                rounded-lg
                object-cover
              "
            />

            {/* Video information */}
            <div className="min-w-0">
              {/* Title */}
              <h3
                className="
                  line-clamp-2
                  text-sm
                  font-semibold
                  leading-5
                  text-gray-900
                  dark:text-white
                "
              >
                {video.title}
              </h3>

              {/* Channel name */}
              <p
                className="
                  mt-1
                  truncate
                  text-xs
                  text-gray-600
                  dark:text-gray-400
                "
              >
                {video.channel?.name || "Unknown channel"}
              </p>

              {/* Views and time */}
              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                {video.views || 0} views
                {video.createdAt && (
                  <>
                    {" • "}
                    {getTimeAgo(video.createdAt)}
                  </>
                )}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* No videos */}
      {videos.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No recommended videos available.
        </p>
      )}
    </aside>
  );
}

export default RecommendedVideos;
