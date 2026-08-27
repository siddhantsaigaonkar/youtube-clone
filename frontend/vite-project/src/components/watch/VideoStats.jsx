import React from "react";
import getTimeAgo from "../../utils/getTimeAgo";


function VideoStats({ video }) {
  return (
    <div
      className="
        mt-4
        text-sm
        text-gray-600
        dark:text-gray-400
      "
    >
      {/* Video views */}
      {video.views || 0} views
      {" • "}
      {/* Video upload time */}
      {video.createdAt && getTimeAgo(video.createdAt)}
    </div>
  );
}

export default VideoStats;
