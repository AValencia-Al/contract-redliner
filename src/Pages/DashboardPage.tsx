import React from "react";
import ContractViewer from "../components/contracts/ContractViewer";
import InsightsPanel from "../components/insights/InsightsPanel";
import { mockClauses, mockInsights } from "../services/mockData";

const DashboardPage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ContractViewer clauses={mockClauses} />
      </div>
      <InsightsPanel insights={mockInsights} />
    </div>
  );
};

export default DashboardPage;
