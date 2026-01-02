import Banner from "../home/Banner"
import Moviecase from "../movies/Moviecase"
import Tvshowcase from "../tvshows/Tvshowcase"

const Home = () => {
  return (
    <section className="home-page py-4">
      <Banner />
      <hr className="text-blue-400 px-2" />
      <Moviecase />
      <hr className="text-blue-400 px-2" />
      <Tvshowcase />
    </section>
  )
}

export default Home