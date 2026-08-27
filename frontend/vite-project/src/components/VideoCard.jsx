import { Link } from "react-router-dom";
import getTimeAgo from "../utils/getTimeAgo";

function VideoCard({ video }) {

  console.log(video );
  
  return (
    <Link
      to={`/watch/${video._id}`}
      className="
      group
    block
    min-w-0
    cursor-pointer
    rounded-xl
    p-2
    transition-colors
    duration-200
    hover:bg-gray-100
    dark:hover:bg-gray-800
      "
    >
      {/* Video thumbnail */}
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          className="
            aspect-video
            w-full
            object-cover
            transition-transform
            duration-200
            group-hover:scale-[1.02]
          "
        />
      </div>

      {/* Video information */}
      <div className="mt-3 flex gap-3 px-1">
        {/* Channel avatar */}
        <img
          src={video.channel.profilePic || "/default-avatar.png"}
          alt={video.owner?.name || "Channel"}
          className="mt-1 h-9 w-9 shrink-0 rounded-full object-cover"
        />

        {/* Title and channel information */}
        <div className="min-w-0">
          {/* Video title */}
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
              text-sm
              text-gray-600
              dark:text-gray-400
            "
          >
            {video.channel?.name || "Unknown channel"}
          </p>

          {/* Views and upload date */}
          <p
            className="
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
      </div>
    </Link>
  );
}

export default VideoCard;
