import React, { useState } from "react";
import Sidebar from "./Sidebar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64 p-6">
        {/* Optional mobile toggle */}
        <button
          className="lg:hidden mb-4 px-3 py-2 rounded bg-gray-900 text-white"
          onClick={() => setSidebarOpen(true)}
        >
          Open menu
        </button>

        {children}
      </main>
    </div>
  );
};

export default MainLayout;
