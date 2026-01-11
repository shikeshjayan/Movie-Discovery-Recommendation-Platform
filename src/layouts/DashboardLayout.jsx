import { useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import Sidebar from "../dashboard/components/Sidebar";
import { Outlet } from "react-router-dom";
import Topbar from "../dashboard/components/Topbar";
const DashboardLayout = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={`flex flex-col md:flex-row md:h-screen ${
        theme === "dark"
          ? "bg-blue-950 text-[#EBEBEB]"
          : "bg-blue-100 text-[#10367D]"
      }`}
    >
      {/* Mobile Top Nav */}
      <Topbar />

      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:block" />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
