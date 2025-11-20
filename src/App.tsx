import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import ContractsPage from "./pages/ContractsPage";
import SettingsPage from "./pages/SettingPage";
import Sidebar from "./components/layout/Sidebar";
import { Menu } from "lucide-react";

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// ✅ Main layout using Sidebar
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar open={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      {/* Page content */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Top bar */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded hover:bg-gray-200"
            >
              <Menu className="w-6 h-6" />
            </button>

            <h1 className="font-bold text-lg">Contract Redliner</h1>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/contracts"
        element={
          <RequireAuth>
            <MainLayout>
              <ContractsPage />
            </MainLayout>
          </RequireAuth>
        }
      />

      <Route
        path="/settings"
        element={
          <RequireAuth>
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          </RequireAuth>
        }
      />

      {/* default */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
