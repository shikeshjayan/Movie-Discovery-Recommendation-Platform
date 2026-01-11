import { useEffect, useState } from "react";
import { useHistory } from "../context/HistoryContext";
import { useWishlist } from "../context/WishlistContext";
import { useWatchLater } from "../context/WatchLaterContext";
import { db } from "../services/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Recommendations from "./Recommendations";
import Trending from "./Trending";

/* ---------------- CUSTOM HOOK ---------------- */
const useReviewCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "comments"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCount(snapshot.size);
    });
    return () => unsubscribe();
  }, []);

  return count;
};

/* ---------------- COMPONENT ---------------- */
const DashboardOverview = () => {
  const { user } = useAuth();
  const { wishlistCount } = useWishlist();
  const { historyCount } = useHistory();
  const reviewCount = useReviewCount();
  const { watchLaterCount } = useWatchLater();

  // Helper: convert email like loganlucus@gmail.com → Logan Lucas
  const formatEmailToName = (email) => {
    if (!email) return "User";

    const localPart = email.split("@")[0].toLowerCase();

    // Map known email parts to proper names
    if (localPart === "loganlucus") {
      return "Logan Lucas";
    }
    if (localPart === "george") {
      return "George";
    }

    // Fallback: just capitalize first letter (e.g. john → John)
    return localPart.charAt(0).toUpperCase() + localPart.slice(1);
  };

  // Use displayName from Firebase Auth, fallback to formatted email name
  const displayName =
    user?.displayName || formatEmailToName(user?.email) || "User";

  return (
    <section className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-[#007BFF]">
        Welcome back, {displayName} 👋
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Wishlist */}
        <div className="flex flex-col items-center justify-center h-32 rounded-lg shadow-md bg-[#007BFF] text-[#1A1A1A] hover:shadow-lg transition">
          <p className="text-sm opacity-90">Wishlist Items</p>
          <p className="text-3xl font-bold">{wishlistCount}</p>
        </div>

        {/* History */}
        <div className="flex flex-col items-center justify-center h-32 rounded-lg shadow-md bg-[#E10098] text-[#1A1A1A] hover:shadow-lg transition">
          <p className="text-sm opacity-90">History Items</p>
          <p className="text-3xl font-bold">{historyCount}</p>
        </div>

        {/* Reviews */}
        <div className="flex flex-col items-center justify-center h-32 rounded-lg shadow-md bg-[#FFD300] text-[#1A1A1A] hover:shadow-lg transition">
          <p className="text-sm opacity-90">Reviews</p>
          <p className="text-3xl font-bold">{reviewCount}</p>
        </div>

        {/* Watchlater */}
        <div className="flex flex-col items-center justify-center h-32 rounded-lg shadow-md bg-[#FF7A00] text-[#1A1A1A] hover:shadow-lg transition">
          <p className="text-sm opacity-90">Watchlater</p>
          <p className="text-3xl font-bold">{watchLaterCount}</p>
        </div>
      </div>

      <hr />
      <Recommendations />
      <Trending />
    </section>
  );
};

export default DashboardOverview;
