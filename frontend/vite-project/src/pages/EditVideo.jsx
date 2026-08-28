
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Video, ImagePlus, X, Save } from "lucide-react";

import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

function EditVideo() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Get video ID from URL
  // Example: /edit-video/123456
  const { id } = useParams();

  console.log(id);
  
  // =========================
  // OLD VIDEO DATA
  // =========================

  const [videoData, setVideoData] = useState(null);

  // =========================
  // FORM DATA
  // =========================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // =========================
  // NEW FILES
  // =========================

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  // =========================
  // PREVIEW
  // =========================

  const [videoPreview, setVideoPreview] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  // =========================
  // LOADING STATES
  // =========================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // LOGIN CHECK
  // =========================

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // =========================
  // GET OLD VIDEO DATA
  // =========================

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError("");

        // Get video using ID from URL
        const response = await API.get(`/videos/${id}`);

        console.log("Video data:", response.data);

        const video = response.data.data;

        // Save complete video object
        setVideoData(video);

        // Put old data into form
        setTitle(video.title || "");
        setDescription(video.description || "");
        setCategory(video.category || "");

        // Show old video
        setVideoPreview(video.videoUrl || "");

        // Show old thumbnail
        setThumbnailPreview(video.thumbnailUrl || "");
      } catch (error) {
        console.error("Fetch video error:", error);

        setError(
          error.response?.data?.message || "Failed to load video."
        );
      } finally {
        setLoading(false);
      }
    };

    // Only fetch when user and ID exist
    if (user && id) {
      fetchVideo();
    }
  }, [user, id]);

  // =========================
  // CHANGE VIDEO
  // =========================

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setVideoFile(file);

    // Create preview for newly selected video
    const previewUrl = URL.createObjectURL(file);

    setVideoPreview(previewUrl);
  };

  // =========================
  // CHANGE THUMBNAIL
  // =========================

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setThumbnailFile(file);

    // Create preview for newly selected thumbnail
    const previewUrl = URL.createObjectURL(file);

    setThumbnailPreview(previewUrl);
  };

  // =========================
  // REMOVE NEW VIDEO
  // =========================

  const removeVideo = () => {
    setVideoFile(null);

    // Show old video again
    setVideoPreview(videoData?.videoUrl || "");
  };

  // =========================
  // REMOVE NEW THUMBNAIL
  // =========================

  const removeThumbnail = () => {
    setThumbnailFile(null);

    // Show old thumbnail again
    setThumbnailPreview(videoData?.thumbnailUrl || "");
  };

  // =========================
  // UPDATE VIDEO
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Validate title
    if (!title.trim()) {
      setError("Video title is required.");
      return;
    }

    // Validate category
    if (!category) {
      setError("Please select a category.");
      return;
    }

    try {
      setSaving(true);

      // Create FormData
      const formData = new FormData();

      // Add text data
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("category", category);

      // Only add video if user selected a new video
      if (videoFile) {
        formData.append("video", videoFile);
      }

      // Only add thumbnail if user selected a new thumbnail
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      // Send update request
      const response = await API.put(`/videos/${id}`, formData);

      console.log("Video updated:", response.data);

      // Get channel ID
      const channelId =
        videoData?.channel?._id ||
        videoData?.channel ||
        videoData?.owner?.channel?._id;

      // Go back to channel
      if (channelId) {
        navigate(`/channel/${channelId}`);
      } else {
        navigate(-1);
      }
    } catch (error) {
      console.error("Update video error:", error);

      setError(
        error.response?.data?.message || "Failed to update video."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING SCREEN
  // =========================

  if (!user || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400">
          Loading...
        </p>
      </div>
    );
  }

  // =========================
  // VIDEO NOT FOUND
  // =========================

  if (!videoData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-gray-950">
        <div className="text-center">
          <p className="text-red-500">
            {error || "Video not found."}
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              mt-4
              rounded-full
              bg-blue-600
              px-5
              py-2
              text-sm
              font-medium
              text-white
              hover:bg-blue-700
            "
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div className="min-h-screen bg-white px-4 py-8 dark:bg-gray-950 sm:px-6">
      <div className="mx-auto max-w-3xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit video
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Update your video information.
          </p>
        </div>

        {/* =========================
            FORM
        ========================= */}

        <form
          onSubmit={handleSubmit}
          className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-6
            shadow-sm
            dark:border-gray-800
            dark:bg-gray-900
            sm:p-8
          "
        >

          {/* =========================
              VIDEO
          ========================= */}

          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Video
            </label>

            <div className="relative mt-2 overflow-hidden rounded-xl bg-black">

              <video
                src={videoPreview}
                controls
                className="aspect-video w-full object-contain"
              />

              {/* Change video */}

              <label
                className="
                  absolute
                  bottom-3
                  right-3
                  flex
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-full
                  bg-black/70
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-white
                  hover:bg-black
                "
              >
                <Video size={16} />

                Change video

                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
              </label>

              {/* Remove newly selected video */}

              {videoFile && (
                <button
                  type="button"
                  onClick={removeVideo}
                  className="
                    absolute
                    right-3
                    top-3
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-black/70
                    text-white
                    hover:bg-black
                  "
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Select a new video only if you want to replace the current
              video.
            </p>
          </div>

          {/* =========================
              THUMBNAIL
          ========================= */}

          <div className="mt-8">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Thumbnail
            </label>

            <div className="relative mt-2 overflow-hidden rounded-xl">

              <img
                src={thumbnailPreview}
                alt="Video thumbnail"
                className="aspect-video w-full object-cover"
              />

              {/* Change thumbnail */}

              <label
                className="
                  absolute
                  bottom-3
                  right-3
                  flex
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-full
                  bg-black/70
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-white
                  hover:bg-black
                "
              >
                <ImagePlus size={16} />

                Change thumbnail

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </label>

              {/* Remove newly selected thumbnail */}

              {thumbnailFile && (
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="
                    absolute
                    right-3
                    top-3
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-black/70
                    text-white
                    hover:bg-black
                  "
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Select a new thumbnail only if you want to replace the
              current thumbnail.
            </p>
          </div>

          {/* =========================
              TITLE
          ========================= */}

          <div className="mt-8">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={150}
              className="
                mt-2
                w-full
                rounded-lg
                border
                border-gray-300
                bg-transparent
                px-4
                py-3
                text-sm
                text-gray-900
                outline-none
                focus:border-blue-500
                dark:border-gray-700
                dark:text-white
              "
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {title.length}/150
            </p>
          </div>

          {/* =========================
              DESCRIPTION
          ========================= */}

          <div className="mt-6">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              maxLength={1000}
              className="
                mt-2
                w-full
                resize-none
                rounded-lg
                border
                border-gray-300
                bg-transparent
                px-4
                py-3
                text-sm
                text-gray-900
                outline-none
                focus:border-blue-500
                dark:border-gray-700
                dark:text-white
              "
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {description.length}/1000
            </p>
          </div>

          {/* =========================
              CATEGORY
          ========================= */}

          <div className="mt-6">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="
                mt-2
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                px-4
                py-3
                text-sm
                text-gray-900
                outline-none
                focus:border-blue-500
                dark:border-gray-700
                dark:bg-gray-900
                dark:text-white
              "
            >
              <option value="">Select category</option>
              <option value="Music">Music</option>
              <option value="Gaming">Gaming</option>
              <option value="Education">Education</option>
              <option value="Technology">Technology</option>
              <option value="Sports">Sports</option>
              <option value="Entertainment">Entertainment</option>
              <option value="News">News</option>
              <option value="Travel">Travel</option>
            </select>
          </div>

          {/* =========================
              ERROR
          ========================= */}

          {error && (
            <div
              className="
                mt-6
                rounded-lg
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-600
                dark:bg-red-950/30
                dark:text-red-400
              "
            >
              {error}
            </div>
          )}

          {/* =========================
              BUTTONS
          ========================= */}

          <div className="mt-8 flex justify-end gap-3">

            {/* Cancel */}

            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={saving}
              className="
                rounded-full
                px-5
                py-2.5
                text-sm
                font-medium
                text-gray-700
                hover:bg-gray-100
                dark:text-gray-300
                dark:hover:bg-gray-800
              "
            >
              Cancel
            </button>

            {/* Save */}

            <button
              type="submit"
              disabled={saving}
              className="
                flex
                items-center
                gap-2
                rounded-full
                bg-blue-600
                px-6
                py-2.5
                text-sm
                font-medium
                text-white
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <Save size={16} />

              {saving ? "Saving..." : "Save changes"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default EditVideo;

