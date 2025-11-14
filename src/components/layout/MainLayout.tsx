import React from "react";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="bg-gray-100 min-h-screen flex">
      
      {/* Sidebar (desktop only) */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b">
          <h1 className="text-2xl font-bold tracking-tight">Contract Redliner</h1>
        </header>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
