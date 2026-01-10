import { useEffect, useReducer, useState } from "react";
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

/* ---------------- REDUCER ---------------- */
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_COMMENTS":
      return action.payload;
    default:
      return state;
  }
};

const CommentBox = ({ contentId, contentTitle, contentType }) => {
  const { user } = useAuth();

  const [comments, dispatch] = useReducer(reducer, []);
  const [form, setForm] = useState({ text: "", rating: 0 });
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* ---------------- FETCH COMMENTS ---------------- */
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

    setForm({ text: "", rating: 0 });
  };

  /* ---------------- DELETE FLOW ---------------- */
  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    await deleteDoc(doc(db, "comments", deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
  };

  /* ---------------- UI ---------------- */
  return (
    <section className="p-6">
      <h3 className="text-xl font-semibold mb-6 text-white">User Reviews</h3>

      {/* COMMENT FORM */}
      {user && (
        <form onSubmit={postComment} className="mb-8 space-y-4 bg-white p-6 text-gray-900 rounded">
          <textarea
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            className="w-full p-4 rounded border"
            placeholder="Write a review..."
          />

          <select
            value={form.rating}
            onChange={(e) =>
              setForm({ ...form, rating: Number(e.target.value) })
            }
            className="p-2 border rounded"
          >
            <option value={0}>Select rating</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} ★
              </option>
            ))}
          </select>

          <button
            disabled={!form.text.trim() || form.rating === 0}
            className="ml-4 px-6 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Post Comment
          </button>
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
