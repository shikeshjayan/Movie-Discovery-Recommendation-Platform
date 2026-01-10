import { useState } from "react";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import StarRating from "../components/StarRating";

const CommentItem = ({ comment, user, onDelete }) => {
  console.log("AUTH UID:", user?.uid);
  console.log("COMMENT DATA:", comment);

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    text: comment.text,
    rating: comment.rating,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!editData.text.trim() || editData.rating === 0) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, "comments", comment.id), {
        text: editData.text,
        rating: editData.rating,
        updatedAt: Timestamp.now(),
      });
      setEditing(false);
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-white text-gray-900 rounded mb-6 shadow border">
      {!editing ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <img
                src="/avatar.png"
                alt=""
                className="w-10 h-10 rounded-full border"
              />
              <span className="font-bold">{comment.username}</span>
            </div>
            <div className="hidden md:block">
              <StarRating value={comment.rating} />
            </div>
          </div>
          <div className="block md:hidden my-4">
              <StarRating value={comment.rating} />
            </div>

          <p className="mb-4">{comment.text}</p>

          <div className="flex justify-between text-sm text-gray-500">
            <span>
              {comment.createdAt?.seconds
                ? new Date(
                    comment.createdAt.seconds * 1000
                  ).toLocaleDateString()
                : "Just now"}
              {comment.updatedAt?.seconds > comment.createdAt?.seconds &&
                " (edited)"}
            </span>

            {user?.uid === comment.userId ||
              (comment.uid && (
                <div className="flex gap-4">
                  <button
                    onClick={() => setEditing(true)}
                    className="text-blue-600 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="text-red-600 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <textarea
            value={editData.text}
            onChange={(e) => setEditData({ ...editData, text: e.target.value })}
            className="w-full p-4 border rounded"
          />

          <select
            value={editData.rating}
            onChange={(e) =>
              setEditData({ ...editData, rating: Number(e.target.value) })
            }
            className="p-2 border rounded"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} ⭐
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
