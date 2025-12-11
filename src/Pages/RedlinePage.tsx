import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../services/api";
import type { Contract, ContractSuggestion } from "../types/contract";
import { ArrowLeft, Check, X, Download, FileText, PartyPopper } from "lucide-react";
import { diffWords } from "diff";

const RedlinePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    loadContract();
  }, [id]);

  const loadContract = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const contracts = await apiGet<Contract[]>("/contracts");
      const found = contracts.find((c) => c._id === id);
      setContract(found || null);
    } catch (err) {
      console.error("Failed to load contract:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = async (suggestionId: string) => {
    if (!contract) return;

    setApplying(true);
    try {
      const res = await apiPost<{ contract: Contract }>(
        `/contracts/${contract._id}/apply-suggestion`,
        { suggestionId }
      );
      setContract(res.contract);
    } catch (err) {
      console.error("Apply suggestion failed:", err);
      alert("Failed to apply suggestion. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const handleRejectSuggestion = (suggestionId: string) => {
    if (!contract) return;
    const updatedSuggestions = (contract.aiSuggestions || []).filter(
      (s) => s.id !== suggestionId
    );
    setContract({ ...contract, aiSuggestions: updatedSuggestions });
  };

  const handleDownloadPDF = async () => {
    if (!contract) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to download the PDF");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "/api";
      const backendOrigin =
        apiUrl && apiUrl.startsWith("http")
          ? apiUrl.replace(/\/api\/?$/, "")
          : window.location.origin;

      const response = await fetch(
        `${backendOrigin}/api/contracts/${contract._id}/download-pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(contract.title || "contract")
        .replace(/\s+/g, "_")
        .toLowerCase()}_final.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download PDF. Please try again.");
    }
  };

  const handleDownloadDOCX = async () => {
    if (!contract) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to download the DOCX");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "/api";
      const backendOrigin =
        apiUrl && apiUrl.startsWith("http")
          ? apiUrl.replace(/\/api\/?$/, "")
          : window.location.origin;

      const response = await fetch(
        `${backendOrigin}/api/contracts/${contract._id}/download-docx`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download DOCX");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(contract.title || "contract")
        .replace(/\s+/g, "_")
        .toLowerCase()}_final.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download DOCX. Please try again.");
    }
  };

  const renderDiff = (original: string, suggestion: string) => {
    const diff = diffWords(original, suggestion);

    return (
      <div className="text-sm leading-relaxed">
        {diff.map((part, index) => {
          if (part.added) {
            return (
              <span
                key={index}
                className="bg-green-200 text-green-900 px-1 rounded"
              >
                {part.value}
              </span>
            );
          }
          if (part.removed) {
            return (
              <span
                key={index}
                className="line-through bg-red-100 text-red-700 px-1 rounded"
              >
                {part.value}
              </span>
            );
          }
          return <span key={index}>{part.value}</span>;
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading contract...</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500">Contract not found</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const suggestions = contract.aiSuggestions || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Redline Review</h1>
              <p className="text-sm text-gray-500">{contract.title}</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {suggestions.length} suggestion{suggestions.length !== 1 ? "s" : ""}{" "}
            pending
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {suggestions.length === 0 ? (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-sm border border-green-200 p-12 text-center">
            <PartyPopper className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Congratulations! 🎉
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              You've completed reviewing all suggestions. Here's your final contract!
            </p>
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <Download className="w-5 h-5" />
                Download as PDF
              </button>
              <button
                onClick={handleDownloadDOCX}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <FileText className="w-5 h-5" />
                Download as DOCX
              </button>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-600 hover:text-gray-800 underline text-sm"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Suggestion Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                          {index + 1}
                        </span>
                        {suggestion.sectionTitle && (
                          <h3 className="font-semibold text-gray-900">
                            {suggestion.sectionTitle}
                          </h3>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Reason:</span>{" "}
                        {suggestion.reason}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRejectSuggestion(suggestion.id)}
                        disabled={applying}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 text-sm"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleApplySuggestion(suggestion.id)}
                        disabled={applying}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 text-sm"
                      >
                        <Check className="w-4 h-4" />
                        Accept
                      </button>
                    </div>
                  </div>
                </div>

                {/* Diff View */}
                <div className="p-6">
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">
                      <span className="inline-block w-3 h-3 bg-red-100 border border-red-300 rounded mr-1"></span>
                      Deleted text
                      <span className="inline-block w-3 h-3 bg-green-200 border border-green-300 rounded ml-4 mr-1"></span>
                      Added text
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {renderDiff(suggestion.original, suggestion.suggestion)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RedlinePage;
