import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { ThemeContext } from "../context/ThemeProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";

/**
 * RootLayout
 * --------------------------------------------------
 * Main layout wrapper for the app:
 * - Displays the Header at the top
 * - Renders page content in Outlet
 * - Shows Footer at the bottom
 * - Applies dark/light theme styling
 */
const RootLayout = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main content area */}
      <main
        className={`mt-20 flex-1 max-w-screen w-full ${
          theme === "dark"
            ? "bg-[#312F2C] text-[#ECF0FF]"
            : "bg-[#ECF0FF] text-[#312F2C]"
        }`}
      >
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RootLayout;
