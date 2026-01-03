// inside Overview.jsx
import { useNavigate } from "react-router-dom";

export default function Overview() {
  const navigate = useNavigate();

  return (
    <div className="overview-page flex flex-col justify-center items-center">
      <div className="layer">
        <h1 className="text-8xl text-white text-center">Recommended Movie Database</h1>
        <form className="flex gap-0.5">
          <input type="text" placeholder="Enter your emailaddress" className="border border-white w-4xl h-14" />
          <button className="text-2xl text-white border cursor-pointer bg-blue-700" onClick={() => navigate("/home")}>
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}