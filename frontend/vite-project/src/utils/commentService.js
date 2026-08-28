import API from "../api/api";

// Get all comments for a video
export const getComments = async (videoId) => {
  // Send GET request to backend
  const response = await API.get(`/comments/${videoId}`);

  // Return only the comment data
  return response.data.data;
};

// Create a new comment
export const createComment = async (videoId, text) => {
  // Send POST request to backend
  const response = await API.post(`/comments/${videoId}`, {
    text,
  });

  // Return the newly created comment
  return response.data.data;
};

// Update an existing comment
export const updateComment = async (commentId, text) => {
  // Send PUT request to backend
  const response = await API.put(`/comments/${commentId}`, {
    text,
  });

  // Return the updated comment
  return response.data.data;
};

// Delete an existing comment
export const deleteComment = async (commentId) => {
  // Send DELETE request to backend
  const response = await API.delete(`/comments/${commentId}`);

  // Return backend response
  return response.data;
};
