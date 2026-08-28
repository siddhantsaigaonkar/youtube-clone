import API from "../api/api";


// Fetch like/dislike count for a video
export const getLikeDislikeCount = async (videoId) => {
  // Send GET request to backend
  const response = await API.get(`/likes/${videoId}`);

  // Return only the useful data
  return response.data.data;
};

// Like or dislike a video
export const reactToVideo = async (videoId, isLike) => {
  // Send like/dislike request to backend
  const response = await API.post(`/likes/${videoId}`, {
    isLike,
  });

  // Return backend response data
  return response.data.data;
};
