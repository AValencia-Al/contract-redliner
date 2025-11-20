import React from "react";
import { mockContracts } from "../services/mockContracts";
import { Download, Trash2, FileText } from "lucide-react";

const ContractsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Contracts</h2>

      <div className="grid gap-4">
        {mockContracts.map((contract) => (
          <div
            key={contract.id}
            className="bg-white shadow-sm p-5 rounded-xl flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold">{contract.name}</p>
                <p className="text-sm text-gray-500">
                  Uploaded: {contract.uploadedAt} • {contract.size}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                View
              </button>
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractsPage;
