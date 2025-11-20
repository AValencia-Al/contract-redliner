import React, { useEffect, useState } from "react";
import { Download, Trash2, FileText, Plus } from "lucide-react";
import { apiGet, apiPost, apiDelete } from "../services/api";

interface Contract {
  _id: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
}

const ContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const loadContracts = async () => {
    setLoading(true);
    try {
      const data = await apiGet("/contracts");
      setContracts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    await apiPost("/contracts", { title: newTitle, content: newContent });
    setNewTitle("");
    setNewContent("");
    loadContracts();
  };

  const handleDelete = async (id: string) => {
    await apiDelete(`/contracts/${id}`);
    setContracts((prev) => prev.filter((c) => c._id !== id));
  };

  const handleDownload = (contract: Contract) => {
    const blob = new Blob([contract.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contract.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Contracts</h2>

      {/* New Contract Form */}
      <form
        onSubmit={handleCreate}
        className="bg-white shadow-sm p-5 rounded-xl space-y-3"
      >
        <h3 className="font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Contract
        </h3>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          placeholder="Contract title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[120px]"
          placeholder="Paste or write your contract content here..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          Save contract
        </button>
      </form>

      {/* Contracts List */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading contracts...</p>
      ) : contracts.length === 0 ? (
        <p className="text-sm text-gray-500">
          No contracts yet – create one above.
        </p>
      ) : (
        <div className="grid gap-4">
          {contracts.map((contract) => (
            <div
              key={contract._id}
              className="bg-white shadow-sm p-5 rounded-xl flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-full">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{contract.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(contract.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    Status: {contract.status}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(contract)}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(contract._id)}
                  className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContractsPage;
