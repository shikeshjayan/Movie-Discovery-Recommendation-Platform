import { useContext, useState } from "react";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import StarRating from "../components/StarRating";
import { ThemeContext } from "../context/ThemeProvider";

const CommentItem = ({ comment, user, onDelete }) => {
  const { theme } = useContext(ThemeContext);

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
    <div
      className={`p-4 rounded mx-6 shadow ${
        theme === "dark"
          ? "bg-[#1f1c18] text-[#FAFAFA]"
          : "bg-[#cfd3e0] text-[#312F2C]"
      }`}
    >
      {!editing ? (
        <>
          <div className="flex flex-col items-center gap-2 mb-4 lg:flex-row lg:justify-between lg:items-center lg:gap-0">
            {/* Avatar */}
            <div className="md:pl-10 flex justify-center lg:justify-start items-center gap-3">
              <img
                src="/avatar.png"
                alt=""
                className="w-10 h-10 rounded-full border"
              />
            </div>

            {/* Username */}
            <h4 className="font-medium">{comment.username}</h4>

            {/* Star Rating */}
            <div>
              <StarRating value={comment.rating} />
            </div>
          </div>

          <span className="pl-10 pt-4 italic text-sm wrap-break-word">
            {comment.createdAt?.seconds
              ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString()
              : "Just now"}
            {comment.updatedAt?.seconds > comment.createdAt?.seconds &&
              " (edited)"}
          </span>

          <p className="pl-10">{comment.text}</p>

          <div className="pl-10 flex justify-between text-sm text-gray-500">
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
