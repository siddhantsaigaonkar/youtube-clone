import React from 'react'
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Forward } from "lucide-react";
import { ArrowDownToLine } from "lucide-react";
import { Ellipsis } from "lucide-react";
import { Link } from 'react-router-dom';
import SubscribeButton from '../SubscribeButton';


export default function VideoInfo({
  video,

  // Subscribe props
  isSubscribed,
  subscribeLoading,
  handleSubscribe,

  // Like / dislike props
  likes,
  dislikes,
  userReaction,
  reactionLoading,
  handleReaction,
})

{
  return (
    <div>
      {/* Video title */}
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
        {video.title}
      </h1>

      {/* ================= CHANNEL INFORMATION ================= */}

      <div className="mt-4 flex flex-wrap items-center  gap-4">
        {/* Channel */}
        <div className="flex items-center gap-3">
          {/* Channel avatar */}
          <img
            src={video.channel?.profilePic || "/default-avatar.png"}
            alt={video.channel?.name || "Channel"}
            className="h-10 w-10 rounded-full object-cover"
          />

          {/* Channel name and subscribers */}
          <Link to={`/channel/${video.channel._id}`}>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {video.channel?.name || "Unknown channel"}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {video.channel?.subscribers || 0} subscribers
              </p>
            </div>
          </Link>

          {/* ================= SUBSCRIBE BUTTON ================= */}

          <SubscribeButton
            channelId={video.channel._id}
            initialSubscribers={video.channel.subscribers}
          />
        </div>

        {/* ================= ACTION BUTTONS ================= */}

        <div
          className="
    flex
    items-center
    gap-4
    rounded-full
    bg-gray-100
    px-4
    py-2
    text-sm
    font-medium
    dark:bg-gray-800
  "
        >
          {/* Like button */}
          <button
            type="button"
            onClick={() => handleReaction(true)}
            disabled={reactionLoading}
            className={`
      flex
      items-center
      gap-1.5
      transition
      disabled:cursor-not-allowed
      disabled:opacity-60

      ${
        userReaction === true
          ? "text-blue-600 dark:text-blue-400"
          : "text-gray-800 dark:text-white"
      }
    `}
          >
            <ThumbsUp size={20} />

            <span>{likes}</span>
          </button>

          {/* Divider */}
          <div className="h-5 w-px bg-gray-300 dark:bg-gray-600" />

          {/* Dislike button */}
          <button
            type="button"
            onClick={() => handleReaction(false)}
            disabled={reactionLoading}
            className={`
      flex
      items-center
      gap-1.5
      transition
      disabled:cursor-not-allowed
      disabled:opacity-60

      ${
        userReaction === false
          ? "text-blue-600 dark:text-blue-400"
          : "text-gray-800 dark:text-white"
      }
    `}
          >
            <ThumbsDown size={20} />

            <span>{dislikes}</span>
          </button>
        </div>

        <button
          className={`
                rounded-full
                px-4
                py-2
                text-sm
                font-medium
                transition
                disabled:cursor-not-allowed
                disabled:opacity-60
                flex
                gap-2.5

                ${
                  userReaction === true
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                }
              `}
        >
          <Forward /> share
        </button>

        <button
          className={`
                rounded-full
                px-4
                py-2
                text-sm
                font-medium
                transition
                disabled:cursor-not-allowed
                disabled:opacity-60
                flex
                gap-2.5

                ${
                  userReaction === true
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                }
              `}
        >
          <ArrowDownToLine /> downlaod
        </button>

        <button
          className={`
                rounded-full
                px-4
                py-2
                text-sm
                font-medium
                transition
                disabled:cursor-not-allowed
                disabled:opacity-60
                flex
                gap-2.5

                ${
                  userReaction === true
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                }
              `}
        >
          <Ellipsis />
        </button>
      </div>
    </div>
  );
}
