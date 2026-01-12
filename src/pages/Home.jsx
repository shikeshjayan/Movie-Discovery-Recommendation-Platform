// -------------------- Home Page --------------------
import Banner from "../home/Banner";
import Moviecase from "../home/Moviecase";
import Tvshowcase from "../home/Tvshowcase";
import WatchHistory from "../home/WatchHistory";

const Home = () => {
  return (
    <section className="home-page py-4">
      {/* -------------------- Banner Section -------------------- */}
      <Banner />

      {/* Divider */}
      <hr className="text-blue-400 px-2" />

      {/* -------------------- Recently Watched / History -------------------- */}
      <WatchHistory />

      {/* Divider */}
      <hr className="text-blue-400 px-2" />

      {/* -------------------- Popular Movies Carousel -------------------- */}
      <Moviecase />

      {/* Divider */}
      <hr className="text-blue-400 px-2" />

      {/* -------------------- Popular TV Shows Carousel -------------------- */}
      <Tvshowcase />
    </section>
  );
};

export default Home;
