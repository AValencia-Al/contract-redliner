import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import DashboardPage from "./Pages/DashboardPage";
import SettingsPage from "./Pages/SettingPage";
import ContractsPage from "./Pages/ContractsPage";


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/contracts" element={<ContractsPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default App;
