import { useEffect, useReducer, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import CommentItem from "../ui/CommentItem";
import ConfirmModal from "../ui/ConfirmModal";

/* ---------------- REDUCER ---------------- */
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_COMMENTS":
      return action.payload;
    default:
      return state;
  }
};

const Myreviews = ({ contentId, contentType, onReviewCountChange }) => {
  const { user } = useAuth();

  const [comments, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* ---------------- FETCH COMMENTS ---------------- */
  useEffect(() => {
    const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(
        "Fetched docs:",
        snapshot.docs.map((d) => d.data())
      );
      dispatch({
        type: "SET_COMMENTS",
        payload: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      });
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    onReviewCountChange?.(comments.length);
  }, [comments, onReviewCountChange]);

  /* ---------------- DELETE ---------------- */
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
      <h2 className="md:text-2xl font-semibold mb-6 text-gray-900">
        Reviews ({comments.length})
      </h2>

      {loading ? (
        <p className="text-center text-gray-400">Loading reviews...</p>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-400">No reviews found</p>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            user={user}
            onDelete={confirmDelete}
          />
        ))
      )}

      <ConfirmModal
        open={confirmOpen}
        title="Delete Review"
        message="Are you sure you want to delete this review?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </section>
  );
};

export default Myreviews;
