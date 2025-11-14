import React from "react";
import Sidebar from "./Sidebar";
import useSidebar from "../../hooks/useSidebar";
import { Menu } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const sidebar = useSidebar();

  return (
    <div className="bg-gray-100 min-h-screen flex">

      {/* Sidebar component */}
      <Sidebar open={sidebar.open} closeSidebar={sidebar.closeSidebar} />

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">

          {/* Hamburger (mobile only) */}
          <button
            className="lg:hidden p-2 rounded hover:bg-gray-200"
            onClick={sidebar.openSidebar}
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="text-xl font-bold tracking-tight">Contract Redliner</h1>

          <div className="w-6"></div> {/* Empty spacing for alignment */}
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
