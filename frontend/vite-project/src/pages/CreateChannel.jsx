import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Upload, X } from "lucide-react";
import Spinner from "../components/Spinner";

import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

function CreateChannel() {
  const { user,checkAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [profilePic, setProfilePic] = useState(null);
  const [banner, setBanner] = useState(null);

  const [profilePreview, setProfilePreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * User must be logged in
   */
  if (!user) {
    navigate("/login");
    return null;
  }

  /*
   * Profile picture selected
   */
  const handleProfileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setProfilePic(file);

    setProfilePreview(URL.createObjectURL(file));
  };

  /*
   * Banner selected
   */
  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setBanner(file);

    setBannerPreview(URL.createObjectURL(file));
  };

  /*
   * Remove profile picture
   */
  const removeProfile = () => {
    setProfilePic(null);
    setProfilePreview("");
  };

  /*
   * Remove banner
   */
  const removeBanner = () => {
    setBanner(null);
    setBannerPreview("");
  };

  /*
   * Create channel
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    /*
     * Basic validation
     */
    if (!name.trim()) {
      setError("Channel name is required.");
      return;
    }

    if (!profilePic) {
      setError("Please select a profile picture.");
      return;
    }

    if (!banner) {
      setError("Please select a channel banner.");
      return;
    }

    try {
      setLoading(true);

      /*
       * FormData is required because
       * we are sending text + images.
       */
      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("description", description.trim());

      formData.append("profilePic", profilePic);
      formData.append("banner", banner);

      /*
       * Send request to backend
       *
       * Do NOT manually set Content-Type.
       * Axios/browser will create the correct
       * multipart/form-data boundary.
       */
      const response = await API.post("/channels", formData);

      console.log("Channel created:", response.data);

      const createdChannel = response.data.data;

      /*
       * Refresh user information from the backend.
       * This updates user.channel in AuthContext.
       */
      await checkAuth();

      /*
       * Redirect to newly created channel
       */
      navigate(`/channel/${createdChannel._id}`);
    } catch (error) {
      console.error("Create channel error:", error);

      setError(error.response?.data?.message || "Failed to create channel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 dark:bg-gray-950 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create your channel
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Create a channel to upload and share your videos.
          </p>
        </div>

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className="
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-sm
            dark:border-gray-800
            dark:bg-gray-900
          "
        >
          {/* ================= BANNER ================= */}

          <div className="relative">
            <div className="h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800 sm:h-56">
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Channel banner preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-gray-400">
                  <ImagePlus size={36} />

                  <p className="mt-2 text-sm">Channel banner</p>
                </div>
              )}
            </div>

            {/* Banner upload */}

            <label
              className="
                absolute
                bottom-4
                right-4
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
              <Upload size={16} />
              Change banner
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="hidden"
              />
            </label>

            {bannerPreview && (
              <button
                type="button"
                onClick={removeBanner}
                className="
                  absolute
                  left-4
                  top-4
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

          {/* ================= FORM CONTENT ================= */}

          <div className="p-6 sm:p-8">
            {/* Profile picture */}

            <div className="-mt-20 mb-8">
              <div className="relative h-28 w-28">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile preview"
                    className="
                      h-28
                      w-28
                      rounded-full
                      border-4
                      border-white
                      object-cover
                      dark:border-gray-900
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-28
                      w-28
                      items-center
                      justify-center
                      rounded-full
                      border-4
                      border-white
                      bg-gray-200
                      text-gray-400
                      dark:border-gray-900
                      dark:bg-gray-700
                    "
                  >
                    <ImagePlus size={30} />
                  </div>
                )}

                <label
                  className="
                    absolute
                    bottom-0
                    right-0
                    flex
                    h-9
                    w-9
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-600
                    text-white
                    shadow
                    hover:bg-blue-700
                  "
                >
                  <Upload size={16} />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {profilePreview && (
                <button
                  type="button"
                  onClick={removeProfile}
                  className="mt-2 text-xs text-red-500 hover:text-red-600"
                >
                  Remove profile picture
                </button>
              )}
            </div>

            {/* ================= CHANNEL NAME ================= */}

            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Channel name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your channel name"
                maxLength={100}
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
            </div>

            {/* ================= DESCRIPTION ================= */}

            <div className="mt-6">
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell viewers about your channel"
                rows={5}
                maxLength={500}
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
                {description.length}/500
              </p>
            </div>

            {/* ================= ERROR ================= */}

            {error && (
              <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}

            {/* ================= BUTTONS ================= */}

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
                  disabled:opacity-50
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
    justify-center
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
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    {/* Show spinner while channel is being created */}
                    <Spinner />
                    Creating...
                  </span>
                ) : (
                  "Create channel"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateChannel;
