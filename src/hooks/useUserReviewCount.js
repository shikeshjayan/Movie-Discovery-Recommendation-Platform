import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

/**
 * Custom hook: useUserReviewCount
 * --------------------------------------------------
 * Listens to the "comments" collection in Firestore and returns
 * the count of reviews submitted by a specific user.
 *
 * @param {string} userId - The UID of the current user
 * @returns {number} count - Number of reviews/comments by the user
 */
export const useUserReviewCount = (userId) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) return; // No user, skip listener

    // Firestore query: only comments by the given user
    const q = query(
      collection(db, "comments"),
      where("uid", "==", userId),
      orderBy("createdAt", "desc")
    );

    // Real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCount(snapshot.size); // Firestore snapshot.size gives the number of documents
    });

    // Clean up listener on unmount or userId change
    return () => unsubscribe();
  }, [userId]);

  return count;
};
