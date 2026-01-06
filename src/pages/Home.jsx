import Banner from "../home/Banner"
import Moviecase from "../home/Moviecase"
import Tvshowcase from "../home/Tvshowcase"
import WatchHistory from "../home/WatchHistory"

const Home = () => {
  return (
    <section className="home-page py-4">
      <Banner />
      <hr className="text-blue-400 px-2" />
      <WatchHistory />
      <hr className="text-blue-400 px-2" />
      <Moviecase />
      <hr className="text-blue-400 px-2" />
      <Tvshowcase />
    </section>
  )
}

export default Home