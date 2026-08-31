import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, ImagePlus, X, Upload } from "lucide-react";

import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

function UploadVideo() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // =========================
  // CHANNEL
  // =========================

  const [channel, setChannel] = useState(null);
  const [channelLoading, setChannelLoading] = useState(true);

  // =========================
  // FORM
  // =========================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [videoPreview, setVideoPreview] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  // =========================
  // OTHER
  // =========================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // FETCH MY CHANNEL
  // =========================

  useEffect(() => {
    const fetchMyChannel = async () => {
      try {
        setChannelLoading(true);
        setError("");

        const response = await API.get("/channels/my-channel");

        console.log("My channel:", response.data);

        setChannel(response.data.data);
      } catch (error) {
        console.error("Get my channel error:", error);

        setError(
          error.response?.data?.message ||
            "You don't have a channel. Please create one first.",
        );
      } finally {
        setChannelLoading(false);
      }
    };

    if (user) {
      fetchMyChannel();
    } else {
      setChannelLoading(false);
    }
  }, [user]);

  // =========================
  // LOGIN CHECK
  // =========================

  useEffect(() => {
    if (!channelLoading && !user) {
      navigate("/login");
    }
  }, [user, channelLoading, navigate]);

  // =========================
  // VIDEO SELECT
  // =========================

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  // =========================
  // THUMBNAIL SELECT
  // =========================

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  // =========================
  // REMOVE VIDEO
  // =========================

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview("");
  };

  // =========================
  // REMOVE THUMBNAIL
  // =========================

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview("");
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Channel required
    if (!channel) {
      setError("Please create a channel before uploading a video.");
      return;
    }

    // Title
    if (!title.trim()) {
      setError("Video title is required.");
      return;
    }

    // Description
    if (!description.trim()) {
      setError("Video description is required.");
      return;
    }

    // Category
    if (!category) {
      setError("Please select a category.");
      return;
    }

    // Video
    if (!videoFile) {
      setError("Please select a video.");
      return;
    }

    // Thumbnail
    if (!thumbnail) {
      setError("Please select a thumbnail.");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // FORM DATA
      // =========================

      const formData = new FormData();

      formData.append("title", title.trim());

      formData.append("description", description.trim());

      formData.append("category", category);

      // Send channel ID
      formData.append("channel", channel._id);

      // Send files
      formData.append("video", videoFile);

      formData.append("thumbnail", thumbnail);

      // =========================
      // API REQUEST
      // =========================

      const response = await API.post("/videos/upload", formData);

      console.log("Video uploaded:", response.data);

      // =========================
      // SUCCESS
      // =========================

      navigate(`/channel/${channel._id}`);
    } catch (error) {
      console.error("Upload video error:", error);

      setError(error.response?.data?.message || "Failed to upload video.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CHANNEL LOADING
  // =========================

  if (channelLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400">Loading channel...</p>
      </div>
    );
  }

  // =========================
  // NOT LOGGED IN
  // =========================

  if (!user) {
    return null;
  }

  // =========================
  // NO CHANNEL
  // =========================

  if (!channel) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-gray-950">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Create a channel first
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You need to create a channel before uploading videos.
          </p>

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

          <button
            type="button"
            onClick={() => navigate("/create-channel")}
            className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create Channel
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN PAGE
  // =========================

  return (
    <div className="min-h-screen bg-white px-4 py-8 dark:bg-gray-950 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Upload video
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Upload a new video to{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {channel.name}
            </span>
          </p>
        </div>

        {/* FORM */}

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
          {/* VIDEO */}

          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Video
            </label>

            {videoPreview ? (
              <div className="relative mt-2 overflow-hidden rounded-xl bg-black">
                <video
                  src={videoPreview}
                  controls
                  className="aspect-video w-full object-contain"
                />

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
              </div>
            ) : (
              <label
                className="
                  mt-2
                  flex
                  aspect-video
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border-2
                  border-dashed
                  border-gray-300
                  bg-gray-50
                  text-gray-500
                  hover:bg-gray-100
                  dark:border-gray-700
                  dark:bg-gray-800
                  dark:text-gray-400
                "
              >
                <Video size={42} />

                <p className="mt-3 text-sm font-medium">Select video</p>

                <p className="mt-1 text-xs">
                  MP4, WebM or other supported video
                </p>

                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* THUMBNAIL */}

          <div className="mt-8">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Thumbnail
            </label>

            {thumbnailPreview ? (
              <div className="relative mt-2 overflow-hidden rounded-xl">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="aspect-video w-full object-cover"
                />

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
              </div>
            ) : (
              <label
                className="
                  mt-2
                  flex
                  aspect-video
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border-2
                  border-dashed
                  border-gray-300
                  bg-gray-50
                  text-gray-500
                  hover:bg-gray-100
                  dark:border-gray-700
                  dark:bg-gray-800
                  dark:text-gray-400
                "
              >
                <ImagePlus size={42} />

                <p className="mt-3 text-sm font-medium">Select thumbnail</p>

                <p className="mt-1 text-xs">JPG, PNG or WebP</p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* TITLE */}

          <div className="mt-8">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
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

          {/* DESCRIPTION */}

          <div className="mt-6">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your video"
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

          {/* CATEGORY */}

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

               <option value="">Select category</option>
              <option value="Music">Music</option>
              <option value="Gaming">Gaming</option>
              <option value="React">React</option>
              <option value="Programming">Programming</option>
              <option value="Technology">JavaScript</option>
              <option value="News">News</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Live">Live</option>
            </select>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          {/* BUTTONS */}

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
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

            <button
              type="submit"
              disabled={loading}
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
              <Upload size={16} />

              {loading ? "Uploading..." : "Upload video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadVideo;
