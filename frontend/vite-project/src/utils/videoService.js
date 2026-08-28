import API from "../api/api";


// Upload a new video
export const uploadVideo = async (formData) => {
  try {
    const response = await API.post("/videos/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Upload video error:", error);
    throw error;
  }
};

// Get videos uploaded by the current user
export const getMyVideos = async () => {
  try {
    const response = await API.get("/videos/my-videos");

    return response.data;
  } catch (error) {
    console.error("Get my videos error:", error);
    throw error;
  }
};

// Update video
export const updateVideo = async (videoId, formData) => {
  try {
    const response = await API.put(`/videos/${videoId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Update video error:", error);
    throw error;
  }
};

// Delete video
export const deleteVideo = async (videoId) => {
  try {
    const response = await API.delete(`/videos/${videoId}`);

    return response.data;
  } catch (error) {
    console.error("Delete video error:", error);
    throw error;
  }
};
