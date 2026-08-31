//

import { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import formatDate from "../utils/formatDate";
import {
  CheckCircle2,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import Loader from "../components/Loader";

import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import ChannelHeader from "../components/channel/ChannelHeader";

function ChannelPage() {
  const { channelId } = useParams();
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  console.log("user",user);
  
  // CHANNEL DATA

  const [channel, setChannel] = useState(null)

  // VIDEOS
  const [videos, setVideos] = useState([]);

  // UI
  const [activeTab, setActiveTab] = useState("Videos");
  const [sortBy, setSortBy] = useState("Latest");


  // LOADING


  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);


  // ERROR
  const [error, setError] = useState("");


  // FETCH CHANNEL

  const fetchChannel = async () => {
    try {
      const response = await API.get(`/channels/${channelId}`);

      console.log("Channel:", response.data);

      setChannel(response.data.data);
    } catch (error) {
      console.error("Error fetching channel:", error);

      setError(error.response?.data?.message || "Failed to load channel.");
    }
  };


  // FETCH CHANNEL VIDEOS

  const fetchChannelVideos = async () => {
    try {
      const response = await API.get(`/channels/${channelId}/videos`);

      console.log("Channel videos:", response.data);

      setVideos(response.data.data || []);
    } catch (error) {
      console.error("Error fetching channel videos:", error);

      setError(
        error.response?.data?.message || "Failed to load channel videos.",
      );
    }
  };


  // FETCH CHANNEL DATA

  const fetchChannelData = async () => {
    try {
      setLoading(true);
      setError("");

      await Promise.all([fetchChannel(), fetchChannelVideos()]);
    } catch (error) {
      console.error("Channel data error:", error);
    } finally {
      setLoading(false);
    }
  };

  
  // INITIAL LOAD
  
  useEffect(() => {
    if (channelId) {
      fetchChannelData();
    }
  }, [channelId]);

  
  // CHECK CHANNEL OWNER
  
  const currentUserId = user?._id 

  

  const channelOwnerId =
    channel?.user?._id ||
    channel?.user?.id ||
    channel?.owner?._id ||
    channel?.owner?.id ||
    channel?.userId ||
    channel?.ownerId;

  const isOwner =
    currentUserId &&
    channelOwnerId &&
    String(currentUserId) === String(channelOwnerId);

  // SORT VIDEOS
  
  const sortedVideos = useMemo(() => {
    const videosCopy = [...videos];

    if (sortBy === "Popular") {
      return videosCopy.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    if (sortBy === "Oldest") {
      return videosCopy.sort(
        (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
      );
    }

    // Latest
    return videosCopy.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    );
  }, [videos, sortBy]);

  // DELETE VIDEO
  
  const handleDeleteVideo = async (videoId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleteLoading(videoId);

      const response = await API.delete(`/videos/${videoId}`);

      console.log("Delete response:", response.data);

      setVideos((prevVideos) =>
        prevVideos.filter((video) => video._id !== videoId),
      );
    } catch (error) {
      console.error("Delete video error:", error);

      alert(error.response?.data?.message || "Failed to delete video.");
    } finally {
      setDeleteLoading(null);
    }
  };

  // LOADING
if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
      {/* Show reusable loader while channel data is loading */}
      <Loader />
    </div>
  );
}

  // ERROR
  
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <p className="text-red-500">{error}</p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-4 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // CHANNEL NOT FOUND
  
  if (!channel) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400">Channel not found.</p>
      </div>
    );
  }

  // CHANNEL DATA
  const channelName = channel.name || "Channel";

  const channelHandle =
    channel.handle ||
    channel.username ||
    channelName.toLowerCase().replace(/\s+/g, "");

  const subscriberCount = channel.subscribers || 0;

  // =========================
  // PAGE
  // =========================

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      {/* =====================================================
          CHANNEL CONTAINER
      ====================================================== */}

      <div className="mx-auto max-w-[1400px]">
        {/* =====================================================
            BANNER
        ====================================================== */}

        <ChannelHeader channel={channel} videos={videos} isOwner={isOwner} />

        {/* =====================================================
            CHANNEL TABS
        ====================================================== */}

        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex overflow-x-auto px-4 sm:px-6 md:px-8">
            {["Home", "Videos", "Shorts", "Live", "Playlists", "Community"].map(
              (tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`
                  relative
                  shrink-0
                  px-4
                  py-4
                  text-sm
                  font-medium
                  transition
                  ${
                    activeTab === tab
                      ? "text-black dark:text-white"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }
                `}
                >
                  {tab}

                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
                  )}
                </button>
              ),
            )}

            <button
              type="button"
              className="ml-2 shrink-0 px-4 py-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="px-4 py-6 sm:px-6 md:px-8">
          {/* =================================================
              HOME
          ================================================== */}

          {activeTab === "Home" && (
            <div>
              <h2 className="text-xl font-bold">Latest videos</h2>

              {videos.length === 0 ? (
                <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-10 text-center dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">
                    No videos available.
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {videos.slice(0, 8).map((video) => (
                    <VideoCard
                      key={video._id}
                      video={video}
                      isOwner={isOwner}
                      deleteLoading={deleteLoading}
                      onEdit={() => navigate(`/edit-video/${video._id}`)}
                      onDelete={() => handleDeleteVideo(video._id)}
                      onWatch={() => navigate(`/watch/${video._id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =================================================
              VIDEOS
          ================================================== */}

          {activeTab === "Videos" && (
            <div>
              {/* =========================
                  VIDEO HEADER
              ========================= */}

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Videos</h2>
              </div>

              {/* =========================
                  VIDEO GRID
              ========================= */}

              {sortedVideos.length === 0 ? (
                <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-10 text-center dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">
                    This channel hasn't uploaded any videos yet.
                  </p>

                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => navigate("/upload")}
                      className="
                        mt-4
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-blue-600
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        text-white
                        hover:bg-blue-700
                      "
                    >
                      <Plus size={17} />
                      Upload video
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {sortedVideos.map((video) => (
                    <VideoCard
                      key={video._id}
                      video={video}
                      isOwner={isOwner}
                      deleteLoading={deleteLoading}
                      onEdit={() => navigate(`/edit-video/${video._id}`)}
                      onDelete={() => handleDeleteVideo(video._id)}
                      onWatch={() => navigate(`/watch/${video._id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =================================================
              OTHER TABS
          ================================================== */}

          {["Shorts", "Live", "Playlists", "Community"].includes(activeTab) && (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {activeTab}
                </p>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  This section will be available soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


  //  VIDEO CARD

function VideoCard({
  video,
  isOwner,
  deleteLoading,
  onEdit,
  onDelete,
  onWatch,
}) {
  return (
    <div className="group min-w-0">
      {/* =========================
          THUMBNAIL
      ========================= */}

      <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800">
        <button type="button" onClick={onWatch} className="block h-full w-full">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="
              h-full
              w-full
              object-cover
              transition
              duration-200
              group-hover:scale-105
            "
          />
        </button>

        {/* =========================
            OWNER MENU
        ========================= */}

        {isOwner && (
          <div className="absolute right-2 top-2">
            <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
              <button
                type="button"
                onClick={onEdit}
                title="Edit video"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-black/75
                  text-white
                  hover:bg-black
                  cursor-pointer
                "
              >
                <Pencil size={16} />
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={deleteLoading === video._id}
                title="Delete video"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-black/75
                  text-white
                  hover:bg-red-600
                  disabled:opacity-50
                  cursor-pointer
                "
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================
          VIDEO INFORMATION
      ========================= */}

      <div className="mt-3 flex gap-3">
    

        {/* Text */}

        <div className="min-w-0 flex-1">
          <button type="button" onClick={onWatch} className="text-left">
            <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300">
              {video.title}
            </h3>
          </button>

          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            {video.channel?.name || "Channel"}
          </p>

          <p className="text-xs text-gray-600 dark:text-gray-400">
            {video.views || 0} views
            {" • "}
            {formatDate(video.createdAt)}
          </p>
        </div>

        {/* More */}

        <button
          type="button"
          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 sm:flex dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
}



export default ChannelPage;