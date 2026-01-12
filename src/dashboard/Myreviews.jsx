import { useEffect, useReducer, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import CommentItem from "../ui/CommentItem";
import ConfirmModal from "../ui/ConfirmModal";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- REDUCER ---------------- */
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_COMMENTS":
      return action.payload;
    case "REMOVE_COMMENT":
      return state.filter((c) => c.id !== action.payload);
    default:
      return state;
  }
};
/**
 * Myreviews Component
 * -------------------
 * Displays and manages the current user’s reviews (comments) from Firestore.
 * - Shows a loading spinner while fetching
 * - Shows “No reviews” state when empty
 * - Lists reviews with delete confirmation
 * - Updates a parent counter via `onReviewCountChange`
 */
const Myreviews = ({ onReviewCountChange }) => {
  const { user } = useAuth();
  const [comments, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* ---------------- FETCH USER COMMENTS ---------------- */
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "comments"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch({ type: "SET_COMMENTS", payload: data });
        setLoading(false);

        // Notify parent of count change
        if (onReviewCountChange) onReviewCountChange(data.length);
      },
      (err) => {
        console.error(err);
        setError("Failed to load reviews");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  /* ---------------- DELETE ACTION ---------------- */
  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteDoc(doc(db, "comments", deleteId));
      dispatch({ type: "REMOVE_COMMENT", payload: deleteId });
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete review. Check your permissions.");
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  /* ---------------- RENDER ---------------- */
  if (error) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg border border-red-100">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="p-2 sm:p-6 max-w-4xl mx-auto">
      <header className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold">Your Activity</h2>
          <p className="text-gray-500 text-sm">Manage your published reviews</p>
        </div>
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
          {comments.length}
        </span>
      </header>

      {loading ? (
        <div className="flex flex-col items-center py-12 gap-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-400 animate-pulse">
            Synchronizing reviews...
          </p>
        </div>
      ) : comments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200"
        >
          <p className="text-gray-400 text-lg">No reviews found yet.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
              >
                <CommentItem
                  comment={comment}
                  user={user}
                  onDelete={() => confirmDelete(comment.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        title="Delete Review"
        message="Are you sure you want to permanently delete this review? This cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </section>
  );
};

export default Myreviews;
