import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CircleUserRound, Pencil, Trash2, Check, X } from "lucide-react";
import Spinner from "./Spinner";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../utils/commentService";
import { AuthContext } from "../context/AuthContext";

function CommentSection() {
  // Get video ID from URL
  const { id } = useParams();

  // Navigate to login
  const navigate = useNavigate();

  // Get logged-in user
  const { user } = useContext(AuthContext);

  // Store comments
  const [comments, setComments] = useState([]);

  // New comment input
  const [commentText, setCommentText] = useState("");

  // Loading comments
  const [loading, setLoading] = useState(true);

  // Adding comment
  const [addingComment, setAddingComment] = useState(false);

  // Comment currently being edited
  const [editingCommentId, setEditingCommentId] = useState(null);

  // Edited comment text
  const [editingText, setEditingText] = useState("");

  // Updating comment
  const [updatingComment, setUpdatingComment] = useState(false);

  // Comment currently being deleted
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  // Error message
  const [error, setError] = useState("");

  /*
   * Fetch comments
   */
  const fetchComments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getComments(id);

      console.log("Comments received:", data);

      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);

      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * Fetch comments when video ID changes
   */
  useEffect(() => {
    if (id) {
      fetchComments();
    }
  }, [id]);

  /*
   * Add comment
   */
  const handleAddComment = async () => {
    // User must be logged in
    if (!user) {
      navigate("/login");
      return;
    }

    // Prevent empty comment
    if (!commentText.trim()) {
      return;
    }

    try {
      setAddingComment(true);
      setError("");

      const newComment = await createComment(id, commentText.trim());

      console.log("New comment:", newComment);

      // Add new comment at top
      setComments((prevComments) => [newComment, ...prevComments]);

      // Clear input
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);

      setError("Failed to add comment.");
    } finally {
      setAddingComment(false);
    }
  };

  /*
   * Start editing
   */
  const handleStartEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.text);
    setError("");
  };

  /*
   * Cancel editing
   */
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  /*
   * Update comment
   */
  const handleUpdateComment = async (commentId) => {
    // Prevent empty comment
    if (!editingText.trim()) {
      return;
    }

    try {
      setUpdatingComment(true);
      setError("");

      const updatedComment = await updateComment(commentId, editingText.trim());

      console.log("Updated comment:", updatedComment);

      // Replace old comment with updated comment
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? updatedComment : comment,
        ),
      );

      // Exit edit mode
      setEditingCommentId(null);
      setEditingText("");
    } catch (error) {
      console.error("Error updating comment:", error);

      setError("Failed to update comment.");
    } finally {
      setUpdatingComment(false);
    }
  };

  /*
   * Delete comment
   */
  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingCommentId(commentId);
      setError("");

      await deleteComment(commentId);

      console.log("Comment deleted:", commentId);

      // Remove comment from state
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId),
      );
    } catch (error) {
      console.error("Error deleting comment:", error);

      setError("Failed to delete comment.");
    } finally {
      setDeletingCommentId(null);
    }
  };

  return (
    <section className="mt-6">
      {/* ================= COMMENTS HEADER ================= */}

      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Comments
      </h2>

      {/* ================= ADD COMMENT ================= */}

      <div className="mt-4 flex gap-3">
        {/* User avatar */}

        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-blue-600
            font-semibold
            text-white
          "
        >
          {user?.name ? (
            user.name.charAt(0).toUpperCase()
          ) : (
            <CircleUserRound size={22} />
          )}
        </div>

        {/* Input */}

        <div className="flex-1">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddComment();
              }
            }}
            placeholder={user ? "Add a comment..." : "Sign in to comment"}
            disabled={!user || addingComment}
            className="
              w-full
              border-b
              border-gray-300
              bg-transparent
              px-1
              py-2
              text-sm
              outline-none
              focus:border-black
              dark:border-gray-700
              dark:text-white
              dark:focus:border-white
            "
          />

          {/* Add comment buttons */}

          {commentText.trim() && (
            <div className="mt-2 flex justify-end gap-2">
              {/* Cancel */}

              <button
                onClick={() => setCommentText("")}
                className="
                  rounded-full
                  px-4
                  py-2
                  text-sm
                  font-medium
                  hover:bg-gray-100
                  dark:text-white
                  dark:hover:bg-gray-800
                "
              >
                Cancel
              </button>

              {/* Comment */}

              <button
                onClick={handleAddComment}
                disabled={addingComment}
                className="
                  rounded-full
                  bg-blue-600
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-white
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {addingComment ? "Commenting..." : "Comment"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= ERROR ================= */}

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {/* ================= COMMENTS ================= */}

      <div className="mt-6 space-y-5">
        {/* Loading */}

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            {/* Show spinner while comments are loading */}
            <Spinner />
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          /* No comments */

          <p className="text-sm text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment.
          </p>
        ) : (
          /* Comments list */

          comments.map((comment) => {
            /*
             * Check whether this comment belongs
             * to the currently logged-in user.
             *
             * String() is used because MongoDB IDs
             * can be ObjectId/string values.
             */
            const isOwner =
              user &&
              comment.user &&
              String(comment.user._id) === String(user._id);

            return (
              <div key={comment._id} className="flex gap-3">
                {/* ================= AVATAR ================= */}

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-600
                    font-semibold
                    text-white
                  "
                >
                  {comment.user?.name
                    ? comment.user.name.charAt(0).toUpperCase()
                    : "?"}
                </div>

                {/* ================= COMMENT BODY ================= */}

                <div className="min-w-0 flex-1">
                  {/* User name + actions */}

                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {comment.user?.name || "Unknown user"}
                    </p>

                    {/* Only owner can edit/delete */}

                    {isOwner && (
                      <div className="flex items-center gap-1">
                        {/* Edit */}

                        <button
                          onClick={() => handleStartEdit(comment)}
                          disabled={editingCommentId !== null}
                          title="Edit comment"
                          className="
                            rounded-full
                            p-2
                            text-gray-500
                            hover:bg-gray-100
                            hover:text-black
                            dark:text-gray-400
                            dark:hover:bg-gray-800
                            dark:hover:text-white
                          "
                        >
                          <Pencil size={16} />
                        </button>

                        {/* Delete */}

                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          disabled={deletingCommentId === comment._id}
                          title="Delete comment"
                          className="
                            rounded-full
                            p-2
                            text-gray-500
                            hover:bg-red-100
                            hover:text-red-600
                            dark:text-gray-400
                            dark:hover:bg-red-900
                            dark:hover:text-red-400
                          "
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ================= EDIT MODE ================= */}

                  {editingCommentId === comment._id ? (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUpdateComment(comment._id);
                          }

                          if (e.key === "Escape") {
                            handleCancelEdit();
                          }
                        }}
                        autoFocus
                        className="
                          w-full
                          border-b
                          border-gray-300
                          bg-transparent
                          py-2
                          text-sm
                          outline-none
                          focus:border-black
                          dark:border-gray-700
                          dark:text-white
                          dark:focus:border-white
                        "
                      />

                      {/* Edit buttons */}

                      <div className="mt-2 flex gap-2">
                        {/* Save */}

                        <button
                          onClick={() => handleUpdateComment(comment._id)}
                          disabled={updatingComment || !editingText.trim()}
                          className="
                            flex
                            items-center
                            gap-1
                            rounded-full
                            bg-blue-600
                            px-3
                            py-1.5
                            text-sm
                            text-white
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                          "
                        >
                          <Check size={15} />

                          {updatingComment ? "Saving..." : "Save"}
                        </button>

                        {/* Cancel */}

                        <button
                          onClick={handleCancelEdit}
                          disabled={updatingComment}
                          className="
                            flex
                            items-center
                            gap-1
                            rounded-full
                            px-3
                            py-1.5
                            text-sm
                            hover:bg-gray-100
                            dark:text-white
                            dark:hover:bg-gray-800
                          "
                        >
                          <X size={15} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ================= NORMAL COMMENT ================= */

                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {comment.text}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default CommentSection;