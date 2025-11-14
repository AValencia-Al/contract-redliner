import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, Settings } from "lucide-react";

const Sidebar: React.FC = () => {
  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Contracts",
      path: "/contracts",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r fixed left-0 top-0 p-6">
      <h1 className="text-2xl font-bold mb-8">Redliner</h1>

      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
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
  );
};

export default Sidebar;
