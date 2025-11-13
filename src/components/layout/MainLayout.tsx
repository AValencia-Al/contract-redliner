import React from "react";
import { NavLink } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Top bar */}
      <header className="flex items-center justify-between px-10 py-4 bg-white border-b">
        <h1 className="text-2xl font-bold tracking-tight">Contract Redliner</h1>

        <nav className="flex gap-2 text-sm">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Settings
          </NavLink>
        </nav>
      </header>

      {/* Main content */}
      <main className="px-10 py-6">{children}</main>
    </div>
  );
};

export default MainLayout;
