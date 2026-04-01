import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { FaUser, FaBell, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          TaskEarn
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6 items-center">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Register
              </Link>
              <a
                href={import.meta.env.VITE_GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
              >
                Join as Developer
              </a>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Dashboard
              </Link>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{user?.coins || 0}</span> Coins
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative"
                >
                  <FaBell className="text-xl" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </button>
              </div>
              <div className="flex gap-3 items-center">
                <img
                  src={user?.photo_url || "https://via.placeholder.com/40"}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-sm">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-gray-600 text-xs">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 transition"
              >
                <FaSignOutAlt className="text-xl" />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
