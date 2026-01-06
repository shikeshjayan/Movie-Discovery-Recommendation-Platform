// inside Overview.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Overview() {
  const [name, setName] = useState(() => {
    const saved = localStorage.getItem('user_name')
    return saved || "";
  })

  useEffect(() => {
    localStorage.setItem('user_name', name)
  }, [name])


  const navigate = useNavigate();
  return (
    <div className="overview-page flex flex-col justify-center items-center p-8">
      <div className="layer flex flex-col justify-center items-center gap-8 bg-neutral-300/50 backdrop-blur-2xl p-4">
        <h1 className="sm:text-2xl md:text-3xl lg:text-6xl text-white">Recommended Movie Database</h1>
        <form className="flex gap-0.5">
          <input onChange={(e) => setName(e.target.value)} value={name || ""} type="text" placeholder="Enter your emailaddress" className="border border-white sm:w-1xl md:w-2xl lg:w-4xl md:h-12 lg:h-14 px-4" />
          <button className="text-1xl text-white border cursor-pointer bg-blue-700 px-4" onClick={() => navigate("/home")}>
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}