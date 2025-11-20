import React, { useEffect, useState } from "react";
import ContractViewer from "../components/contracts/ContractViewer";
import InsightsPanel from "../components/insights/InsightsPanel";
import UploadContractButton from "../components/upload/UploadContractButton";
import { apiGet, apiPost } from "../services/api";

interface Contract {
  _id: string;
  title: string;
  content: string;
  aiInsights?: string;
}

const DashboardPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selected, setSelected] = useState<Contract | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const loadContracts = async () => {
    const data = await apiGet("/contracts");
    setContracts(data);
    if (data.length > 0 && !selected) {
      setSelected(data[0]);
    }
  };

  useEffect(() => {
    loadContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnalyze = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await apiPost(`/contracts/${selected._id}/analyze`, {});
      setAnalysis(res.analysis);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUploaded = async (title: string, content: string) => {
    await apiPost("/contracts", { title, content });
    await loadContracts();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left side */}
      <div className="lg:col-span-2 space-y-4">
        <UploadContractButton onUploaded={handleUploaded} />

        {selected ? (
          <ContractViewer
            contract={selected}
            contracts={contracts}
            onSelectContract={(id: string) =>
              setSelected(contracts.find((c) => c._id === id) || null)
            }
            onAnalyze={handleAnalyze}
            loading={loading}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-6 text-sm text-gray-500">
            No contracts yet – upload or create one from the Contracts page.
          </div>
        )}
      </div>

      {/* Right side */}
      <InsightsPanel insights={analysis || selected?.aiInsights || ""} />
    </div>
  );
};

export default DashboardPage;
