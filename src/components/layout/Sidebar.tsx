import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, Settings, X } from "lucide-react";

interface SidebarProps {
  open: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, closeSidebar }) => {
  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Contracts", path: "/contracts", icon: <FileText className="w-5 h-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* DARK OVERLAY (mobile only) */}
      {open && (
        <div
          onClick={closeSidebar}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        ></div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed z-50 top-0 left-0 h-full w-64 bg-white border-r shadow-lg 
          transform transition-transform duration-300 
          ${open ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:relative lg:z-auto
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h1 className="text-xl font-bold">Redliner</h1>

          {/* Close button (mobile only) */}
          <button
            className="lg:hidden p-2 rounded hover:bg-gray-200"
            onClick={closeSidebar}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-2 p-4">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium
                transition
                ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
