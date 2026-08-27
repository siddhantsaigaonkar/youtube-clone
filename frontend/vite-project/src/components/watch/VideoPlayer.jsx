import React from 'react'

export default function VideoPlayer({ video }) {
  return (
    <div>
      <div className="h-[600px] w-full overflow-hidden rounded-2xl bg-black">
        <video
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          controls
          className="h-full w-full !object-cover"
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
