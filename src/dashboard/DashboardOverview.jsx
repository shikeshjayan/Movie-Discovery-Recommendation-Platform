import { useEffect, useState } from "react";
import { useHistory } from "../context/HistoryContext";
import { useWishlist } from "../context/WishlistContext";
import { useWatchLater } from "../context/WatchLaterContext";
import { db } from "../services/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
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
  const { wishlistCount } = useWishlist();
  const { historyCount } = useHistory();
  const reviewCount = useReviewCount();
  const { watchLaterCount } = useWatchLater();
  return (
    <section className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-white">
        Welcome back, Shikesh 👋
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Wishlist */}
        <div className="flex flex-col items-center justify-center h-32 rounded-lg shadow-md bg-blue-500 text-white hover:shadow-lg transition">
          <p className="text-sm opacity-90">Wishlist Items</p>
          <p className="text-3xl font-bold">{wishlistCount}</p>
        </div>

        {/* History */}
        <div className="flex flex-col items-center justify-center h-32 rounded-lg shadow-md bg-green-500 text-white hover:shadow-lg transition">
          <p className="text-sm opacity-90">History Items</p>
          <p className="text-3xl font-bold">{historyCount}</p>
        </div>

        {/* Reviews */}
        <div className="flex flex-col items-center justify-center h-32 rounded-lg shadow-md bg-purple-500 text-white hover:shadow-lg transition">
          <p className="text-sm opacity-90">Reviews</p>
          <p className="text-3xl font-bold">{reviewCount}</p>
        </div>

        {/* Watchlater */}
        <div className="flex flex-col items-center justify-center h-32 rounded-lg shadow-md bg-purple-500 text-white hover:shadow-lg transition">
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
