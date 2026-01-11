import { useContext, useEffect, useReducer, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  Timestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../ui/ConfirmModal";
import CommentItem from "../ui/CommentItem";
import { ThemeContext } from "../context/ThemeProvider";

/* ---------------- REDUCER ---------------- */

/**
 * Reducer to manage comments list
 * @param {Array} state - Current comments array
 * @param {Object} action - Action object
 * @returns {Array} New comments array
 */
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_COMMENTS":
      return action.payload;
    default:
      return state;
  }
};

/**
 * CommentBox Component
 * Renders a comment/review section for a movie/TV show.
 * - Shows existing comments
 * - Allows logged-in users to post a comment with rating
 * - Allows comment deletion with confirmation
 *
 * @param {string} contentId - ID of the movie/TV show
 * @param {string} contentTitle - Title of the movie/TV show
 * @param {string} contentType - Type ("movie" or "tv")
 */
const CommentBox = ({ contentId, contentTitle, contentType }) => {
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);

  // State
  const [comments, dispatch] = useReducer(reducer, []);
  const [form, setForm] = useState({ text: "", rating: 0 });
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* ---------------- FETCH COMMENTS ---------------- */

  // Subscribe to comments for this content
  useEffect(() => {
    if (!contentId || !contentType) return;

    setLoading(true);

    const q = query(
      collection(db, "comments"),
      where("contentId", "==", contentId),
      where("contentType", "==", contentType),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        dispatch({
          type: "SET_COMMENTS",
          payload: snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        });
        setLoading(false);
      },
      (error) => {
        console.error("Fetch comments error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [contentId, contentType]);

  /* ---------------- POST COMMENT ---------------- */

  /**
   * Handles form submission to post a new comment
   * @param {React.FormEvent} e - Form submit event
   */
  const postComment = async (e) => {
    e.preventDefault();
    if (!user || !form.text.trim() || form.rating === 0) return;

    await addDoc(collection(db, "comments"), {
      contentId,
      contentTitle,
      contentType,
      uid: user.uid,
      username: user.email.split("@")[0],
      text: form.text,
      rating: form.rating,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // Reset form
    setForm({ text: "", rating: 0 });
  };

  /* ---------------- DELETE FLOW ---------------- */

  /**
   * Opens the delete confirmation modal
   * @param {string} id - Comment ID to delete
   */
  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  /**
   * Deletes the comment from Firestore
   */
  const handleDelete = async () => {
    if (!deleteId) return;

    await deleteDoc(doc(db, "comments", deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
  };

  /* ---------------- UI ---------------- */

  return (
    <section className="p-6">
      <h3
        className="text-xl font-semibold mb-6"
        style={{ color: theme === "dark" ? "#FCFCF7" : "#171717" }}
      >
        User Reviews
      </h3>

      {/* COMMENT FORM */}
      {user && (
        <form
          onSubmit={postComment}
          className={`mb-8 space-y-4 p-6 rounded
            ${theme === "dark" ? "text-[#FAFAFA]" : "text-[#312F2C]"}
          `}
        >
          <textarea
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            className={`w-full p-4 border-b field-sizing-content focus:outline-none placeholder:text-[#0064E0] ${
              theme === "dark" ? "text-[#FAFAFA]" : "text-[#312F2C]"
            }`}
            placeholder="Write a review..."
          />

          <div className="flex gap-2">
            <select
              value={form.rating}
              onChange={(e) =>
                setForm({ ...form, rating: Number(e.target.value) })
              }
              className={`p-1 border rounded ${
                theme === "dark" ? "text-[#FAFAFA]" : "text-[#312F2C]"
              }`}
            >
              <option
                className={`${
                  theme === "dark"
                    ? "bg-[#312F2C] text-[#FAFAFA]"
                    : "bg-[#ECF0FF] text-[#312F2C]"
                }`}
                value={0}
              >
                ☆
              </option>
              {[1, 2, 3, 4, 5].map((r) => (
                <option
                  className={`${
                    theme === "dark"
                      ? "bg-[#312F2C] text-[#FAFAFA]"
                      : "bg-[#ECF0FF] text-[#312F2C]"
                  }`}
                  key={r}
                  value={r}
                >
                  {r} ★
                </option>
              ))}
            </select>

            <button
              disabled={!form.text.trim() || form.rating === 0}
              className="px-2 py-2 bg-[#0064E0] text-[#FCFCF7] hover:bg-[#0073ff] rounded disabled:bg-gray-400"
            >
              Comment
            </button>
          </div>
        </form>
      )}

      {/* COMMENTS LIST */}
      {loading ? (
        <p className="text-center text-gray-400">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-400">No reviews yet</p>
      ) : (
        comments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            user={user}
            onDelete={confirmDelete}
          />
        ))
      )}

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete Comment"
        message="This action cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </section>
  );
};

export default CommentBox;
