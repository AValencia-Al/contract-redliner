import React from "react";
import ContractViewer from "../components/contracts/ContractViewer";
import InsightsPanel from "../components/insights/InsightsPanel";
import UploadContractButton from "../components/upload/UploadContractButton";
import { mockClauses, mockInsights } from "../services/mockData";

const DashboardPage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Left side */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Upload Button */}
        <UploadContractButton />

        {/* Contract Viewer */}
        <ContractViewer clauses={mockClauses} />
      </div>

      {/* Right side */}
      <InsightsPanel insights={mockInsights} />
    </div>
  );
};

export default DashboardPage;
