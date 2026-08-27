import { CheckCircle2, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

import SubscribeButton from "../SubscribeButton";

function ChannelHeader({ channel, videos, isOwner }) {
  const navigate = useNavigate();

  // Channel name
  const channelName = channel.name || "Channel";

  // Channel handle
  const channelHandle =
    channel.handle ||
    channel.username ||
    channelName.toLowerCase().replace(/\s+/g, "");

  // Subscriber count
  const subscriberCount = channel.subscribers || 0;

  return (
    <div>
      {/* =========================
          BANNER
      ========================= */}

      <div className="relative h-36 w-full overflow-hidden bg-gray-200 sm:h-48 md:h-56 lg:h-64">
        {channel.banner ? (
          <img
            src={channel.banner}
            alt={`${channelName} banner`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-300 dark:bg-gray-800" />
        )}
      </div>

      {/* =========================
          CHANNEL HEADER
      ========================= */}

      <div className="px-4 py-5 sm:px-6 md:px-8">
        <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-center">
          {/* =========================
              PROFILE IMAGE
          ========================= */}

          <div className="-mt-16 shrink-0 sm:-mt-20 md:-mt-16">
            {channel.profilePic ? (
              <img
                src={channel.profilePic}
                alt={channelName}
                className="
                  h-24
                  w-24
                  rounded-full
                  border-4
                  border-white
                  object-cover
                  sm:h-32
                  sm:w-32
                  dark:border-gray-950
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  rounded-full
                  border-4
                  border-white
                  bg-red-600
                  text-3xl
                  font-bold
                  text-white
                  sm:h-32
                  sm:w-32
                  sm:text-4xl
                  dark:border-gray-950
                "
              >
                {channelName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* =========================
              CHANNEL DETAILS
          ========================= */}

          <div className="min-w-0 flex-1">
            {/* Channel name */}
            <div className="flex items-center gap-2">
              <h1 className="truncate text-2xl font-bold sm:text-3xl">
                {channelName}
              </h1>

              <CheckCircle2
                size={18}
                className="shrink-0 text-gray-500"
                fill="currentColor"
              />
            </div>

            {/* Handle + subscribers */}
            <div className="flex gap-3">
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                @{channelHandle}
              </p>

              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {subscriberCount} subscribers
                {" • "}
                {videos.length} videos
              </p>
            </div>

            {/* Description */}
            {channel.description && (
              <p className="mt-3 line-clamp-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                {channel.description}
              </p>
            )}

            {/* =========================
                OWNER / SUBSCRIBE
            ========================= */}

            {isOwner ? (
              <button
                type="button"
                onClick={() => navigate("/upload")}
                className="
                  mt-2.5
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-gray-900
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-gray-800
                  dark:bg-white
                  dark:text-black
                  dark:hover:bg-gray-200
                "
              >
                <Upload size={17} />
                Create
              </button>
            ) : (
              <div className="mt-2.5">
                <SubscribeButton
                  channelId={channel._id}
                  initialSubscribers={subscriberCount}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChannelHeader;
