import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import getTimeAgo from "../utils/getTimeAgo";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { Forward } from "lucide-react";
import VideoPlayer from "../components/watch/VideoPlayer";
import { getLikeDislikeCount, reactToVideo } from "../utils/likeService";
import VideoInfo from "../components/watch/VideoInfo";
import CommentSection from "../components/CommentSection";
import { increaseVideoView } from "../utils/viewService";
import SubscribeButton from "../components/SubscribeButton";
import RecommendedVideos from "../components/watch/RecommendedVideos";
import Loader from "../components/Loader";



function WatchPage() {
  // Get video ID from URL
  const { id } = useParams();

  // Used to navigate to login page
  const navigate = useNavigate();

  // Get logged-in user from AuthContext
  const { user } = useContext(AuthContext);

  // Store video information
  const [video, setVideo] = useState(null);

  // Store whether user is subscribed
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Loading state for video
  const [loading, setLoading] = useState(true);

  // Subscribe button loading state
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  // Error state
  const [error, setError] = useState("");

  // Store like count
  const [likes, setLikes] = useState(0);

  // Store dislike count
  const [dislikes, setDislikes] = useState(0);

// Recommended videos
  const [recommendedVideos, setRecommendedVideos] = useState([]);

  // Store current user's reaction
  // true = liked
  // false = disliked
  // null = no reaction
  const [userReaction, setUserReaction] = useState(null);

  // Loading state for like/dislike button
  const [reactionLoading, setReactionLoading] = useState(false);

  /*
   * Fetch video by ID
   */
  const fetchVideo = async () => {
    try {
      // Start loading
      setLoading(true);

      // Clear previous error
      setError("");

      // Get video from backend
      const response = await API.get(`/videos/${id}`);

      console.log("Video received:", response.data);

      // Store video data
      setVideo(response.data.data);
    } catch (error) {
      // Log error for debugging
      console.error("Error fetching video:", error);

      // Show error message
      setError("Failed to load video.");
    } finally {
      // Stop loading
      setLoading(false);
    }
  };

  /*
   * Fetch like/dislike count
   */
  const fetchLikeDislikeCount = async () => {
    try {
      // Get like/dislike data from service
      const data = await getLikeDislikeCount(id);

      console.log("Like/dislike data:", data);

      // Update like count
      setLikes(data.likes);

      // Update dislike count
      setDislikes(data.dislikes);

      // Update current user's reaction
      //
      // Your backend currently needs to return
      // userReaction for this to work.
      setUserReaction(data.userReaction ?? null);
    } catch (error) {
      // Log error for debugging
      console.error("Error fetching like/dislike count:", error);
    }
  };



  const handleVideoView = async () => {
    try {
      const data = await increaseVideoView(id);

      console.log("Updated views:", data.views);

      // Update views immediately in UI
      setVideo((prev) => ({
        ...prev,
        views: data.views,
      }));
    } catch (error) {
      console.error("Failed to update video views:", error);
    }
  };


  const fetchRecommendedVideos = async () => {
    try {
      const response = await API.get("/videos");

      const remainingVideos = (response.data.data || []).filter(
        (item) => item._id !== id,
      );

      setRecommendedVideos(remainingVideos);
    } catch (error) {
      console.error("Error fetching recommended videos:", error);

      setRecommendedVideos([]);
    }
  };



  /*
   * Fetch video and like/dislike data
   * whenever video ID changes
   */
  useEffect(() => {
    fetchVideo();
    fetchLikeDislikeCount();
    handleVideoView();
      fetchRecommendedVideos();
  }, [id]);

  /*
   * Subscribe / Unsubscribe
   */
  const handleSubscribe = async () => {
    // User is not logged in
    if (!user) {
      navigate("/login");
      return;
    }

    // Make sure channel exists
    if (!video?.channel?._id) {
      console.error("Channel ID not found");
      return;
    }

    try {
      // Start subscribe loading
      setSubscribeLoading(true);

      // Get channel ID
      const channelId = video.channel._id;

      /*
       * Unsubscribe
       */
      if (isSubscribed) {
        // Send unsubscribe request
        const response = await API.delete(`/subscriptions/${channelId}`);

        console.log("Unsubscribe response:", response.data);

        // Check successful response
        if (response.data.success) {
          // Update subscription state
          setIsSubscribed(false);

          // Decrease subscriber count in UI
          setVideo((prev) => ({
            ...prev,
            channel: {
              ...prev.channel,
              subscribers: Math.max(0, (prev.channel?.subscribers || 0) - 1),
            },
          }));
        }
      } else {
        /*
         * Subscribe
         */

        // Send subscribe request
        const response = await API.post(`/subscriptions/${channelId}`);

        console.log("Subscribe response:", response.data);

        // Check successful response
        if (response.data.success) {
          // Update subscription state
          setIsSubscribed(true);

          // Increase subscriber count in UI
          setVideo((prev) => ({
            ...prev,
            channel: {
              ...prev.channel,
              subscribers: (prev.channel?.subscribers || 0) + 1,
            },
          }));
        }
      }
    } catch (error) {
      // Log subscribe/unsubscribe error
      console.error("Subscribe/unsubscribe error:", error);
    } finally {
      // Stop subscribe loading
      setSubscribeLoading(false);
    }
  };

  /*
   * Like / Dislike video
   */
  const handleReaction = async (isLike) => {
    try {
      // User must be logged in
      if (!user) {
        navigate("/login");
        return;
      }

      // Prevent multiple requests
      if (reactionLoading) {
        return;
      }

      // Start reaction loading
      setReactionLoading(true);

      // Send like/dislike request
      const response = await reactToVideo(id, isLike);

      console.log("Reaction response:", response);

      // Fetch updated counts
      await fetchLikeDislikeCount();
    } catch (error) {
      // Log error
      console.error("Like/dislike error:", error);
    } finally {
      // Stop reaction loading
      setReactionLoading(false);
    }
  };

  /*
   * Loading state
   */
  if (loading) {
  return <Loader />;
  }

  /*
   * Error state
   */
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  /*
   * Video not found
   */
  if (!video) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Video not found.</p>
      </div>
    );
  }

  // return (

  //   <div className="min-h-screen px-0 py-4 sm:px-6 lg:px-8">
  //     {/* ================= VIDEO PLAYER ================= */}
  //     <VideoPlayer video={video} />

  //     {/* ================= VIDEO INFORMATION ================= */}

  //     <div className="mt-4">
  //       <VideoInfo
  //         video={video}
  //         // Subscribe
  //         isSubscribed={isSubscribed}
  //         subscribeLoading={subscribeLoading}
  //         handleSubscribe={handleSubscribe}
  //         // Like / dislike
  //         likes={likes}
  //         dislikes={dislikes}
  //         userReaction={userReaction}
  //         reactionLoading={reactionLoading}
  //         handleReaction={handleReaction}
  //       />

  //       {/* ================= VIEWS AND UPLOAD TIME ================= */}

  //       <div
  //         className="
  //           mt-4
  //           text-sm
  //           text-gray-600
  //           dark:text-gray-400
  //         "
  //       >
  //         {video.views || 0} views
  //         {" • "}
  //         {video.createdAt && getTimeAgo(video.createdAt)}
  //       </div>

  //       {/* ================= DESCRIPTION ================= */}

  //       <div
  //         className="
  //           mt-4
  //           rounded-xl
  //           bg-gray-100
  //           p-4
  //           text-sm
  //           text-gray-800
  //           dark:bg-gray-800
  //           dark:text-gray-200
  //         "
  //       >
  //         {video.description || "No description available."}
  //       </div>

  //       {/* ================= COMMENTS ================= */}

  //       <CommentSection />
  //     </div>
  //   </div>
  // );



  return (
    <div className="min-h-screen px-3 py-4 sm:px-6 lg:px-8">
      {/* Main responsive layout */}
      <div
        className="
        grid
        grid-cols-1
        gap-6
        xl:grid-cols-[minmax(0,1fr)_380px]
      "
      >
        {/* ================= LEFT SIDE ================= */}
        <main className="min-w-0">
          {/* Video player */}
          <VideoPlayer video={video} />

          {/* Video information */}
          <div className="mt-4">
            <VideoInfo
              video={video}
              isSubscribed={isSubscribed}
              subscribeLoading={subscribeLoading}
              handleSubscribe={handleSubscribe}
              likes={likes}
              dislikes={dislikes}
              userReaction={userReaction}
              reactionLoading={reactionLoading}
              handleReaction={handleReaction}
            />

            {/* Views and upload time */}
            <div
              className="
              mt-4
              text-sm
              text-gray-600
              dark:text-gray-400
            "
            >
              {video.views || 0} views
              {" • "}
              {video.createdAt && getTimeAgo(video.createdAt)}
            </div>

            {/* Description */}
            <div
              className="
              mt-4
              rounded-xl
              bg-gray-100
              p-4
              text-sm
              text-gray-800
              dark:bg-gray-800
              dark:text-gray-200
            "
            >
              {video.description || "No description available."}
            </div>

            {/* Comments */}
            <CommentSection />
          </div>
        </main>

        {/* ================= RIGHT SIDE ================= */}
        <aside className="min-w-0">
          <RecommendedVideos videos={recommendedVideos} />
        </aside>
      </div>
    </div>
  );
}




export default WatchPage;
