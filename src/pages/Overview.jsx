import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Overview = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Welcome to Movie App</h1>
      <p>Please login to access the platform</p>

      <div className="flex gap-4">
        <Link to="/signin" className="px-4 py-2 bg-blue-600 text-white rounded">
          Login
        </Link>
        <Link to="/signup" className="px-4 py-2 border rounded">
          Sign Up
        </Link>
      </div>
    </section>
  );
};

export default Overview;
