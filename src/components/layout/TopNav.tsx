import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FileText, Settings, LogOut, LogIn, UserPlus } from "lucide-react";

interface TopNavProps {
  isAuthenticated: boolean;
}

const TopNav: React.FC<TopNavProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const baseLinkClasses =
    "text-sm px-3 py-1.5 rounded-md hover:bg-gray-100 transition";
  const activeClasses = "bg-gray-100 font-semibold";

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-sm sm:text-base">
            Contract Redliner
          </span>
        </Link>

        {/* Right side navigation */}
        {isAuthenticated ? (
          <nav className="flex items-center gap-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${baseLinkClasses} ${isActive ? activeClasses : ""}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/contracts"
              className={({ isActive }) =>
                `${baseLinkClasses} ${isActive ? activeClasses : ""}`
              }
            >
              Contracts
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `${baseLinkClasses} flex items-center gap-1 ${
                  isActive ? activeClasses : ""
                }`
              }
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </NavLink>

            <button
              onClick={handleLogout}
              className="ml-2 inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-md text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-md hover:bg-gray-100"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign up</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default TopNav;
