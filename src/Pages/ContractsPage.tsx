import React, { useEffect, useState } from "react";
import { apiGet, apiDelete } from "../services/api";
import type { Contract } from "../types/contract";
import UploadContractButton from "../components/upload/UploadContractButton";
import ContractViewer from "../components/contracts/ContractViewer";
import { Trash2 } from "lucide-react";

const ContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selected, setSelected] = useState<Contract | null>(null);

  const loadContracts = async () => {
    const data = await apiGet<Contract[]>("/contracts");
    setContracts(data);
    if (!selected && data.length > 0) {
      setSelected(data[0]);
    }
  };

  useEffect(() => {
    loadContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUploaded = (contract: Contract) => {
    // Put newest on top
    setContracts((prev) => [contract, ...prev]);
    setSelected(contract); // show the new one in the viewer
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDelete(`/contracts/${id}`);

      setContracts((prev) => {
        const next = prev.filter((c) => c._id !== id);

        // if we just deleted the selected contract, pick a new one
        if (selected?._id === id) {
          setSelected(next[0] || null);
        }

        return next;
      });
    } catch (err) {
      console.error("Failed to delete contract", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contracts</h2>
        <UploadContractButton onUploaded={handleUploaded} />
      </div>

      {/* Simple list on the left, viewer on the right */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y">
          {contracts.length === 0 ? (
            <p className="text-xs text-gray-400 p-4">
              No contracts yet – upload one to get started.
            </p>
          ) : (
            contracts.map((c) => (
              <div
                key={c._id}
                className={`flex items-stretch group ${
                  selected?._id === c._id
                    ? "bg-blue-50 border-l-2 border-blue-500"
                    : ""
                }`}
              >
                {/* select contract */}
                <button
                  onClick={() => setSelected(c)}
                  className="flex-1 text-left px-4 py-3 text-sm hover:bg-gray-50 focus:outline-none"
                >
                  <div className="font-medium truncate">
                    {c.title || "(Untitled contract)"}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </button>

                {/* delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // don't select when deleting
                    handleDelete(c._id);
                  }}
                  className="px-2 text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center"
                  title="Delete contract"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <ContractViewer contract={selected} />
      </div>
    </div>
  );
};

export default ContractsPage;
