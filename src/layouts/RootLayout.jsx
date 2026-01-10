import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { ThemeContext } from "../context/ThemeProvider";
import { useContext } from "react";
import Footer from "../components/Footer";

const RootLayout = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div>
      <Header />
      <main
        className={`mt-20 max-w-screen min-h-screen ${
          theme === "dark"
            ? "bg-[#312F2C] text-[#ECF0FF]"
            : "bg-[#ECF0FF] text-[#312F2C]"
        }`}
      >
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default RootLayout;
