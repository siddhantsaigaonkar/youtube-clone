import API from "../api/api";


// Increase video view count
export const increaseVideoView = async (videoId) => {
  try {
    const response = await API.post(`/videos/${videoId}/view`);

    console.log("View response:", response.data);

    return response.data.data;
  } catch (error) {
    console.error("Error increasing video view:", error);
    throw error;
  }
};
