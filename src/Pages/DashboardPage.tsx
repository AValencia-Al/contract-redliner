import React, { useEffect, useState } from "react";
import { apiGet, apiPost } from "../services/api";
import ContractViewer from "../components/contracts/ContractViewer";
import UploadContractButton from "../components/upload/UploadContractButton";
import InsightsPanel from "../components/insights/InsightsPanel";
import type { Contract, ContractSuggestion } from "../types/contract";
import { FileText, Sparkles, RefreshCw } from "lucide-react";
import { diffWords } from "diff";

const DashboardPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selected, setSelected] = useState<Contract | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ContractSuggestion[]>([]);

  const loadContracts = async () => {
    try {
      const data = await apiGet<Contract[]>("/contracts");
      setContracts(data);

      if (!selected && data.length > 0) {
        const first = data[0];
        setSelected(first);
        setAnalysis("");
        setSuggestions(first.aiSuggestions || []);
      } else if (selected) {
        const updated = data.find((c) => c._id === selected._id) || null;
        setSelected(updated);
        setAnalysis("");
        setSuggestions(updated?.aiSuggestions || []);
      }
    } catch (err) {
      console.error("Failed to load contracts", err);
    }
  };

  useEffect(() => {
    loadContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUploaded = (contract: Contract) => {
    setContracts((prev) => [contract, ...prev]);
    setSelected(contract);
    setAnalysis("");
    setSuggestions(contract.aiSuggestions || []);
  };

  const handleAnalyze = async () => {
    if (!selected) return;

    setLoading(true);
    setAnalysis("");

    try {
      const res = await apiPost<{ analysis: string }>(
        `/contracts/${selected._id}/analyze`,
        {}
      );
      setAnalysis(res.analysis);
    } catch (err) {
      console.error("Analyze failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestChanges = async () => {
    if (!selected) return;

    setLoading(true);

    try {
      const res = await apiPost<{ suggestions: ContractSuggestion[] }>(
        `/contracts/${selected._id}/suggest-changes`,
        {}
      );
      setSuggestions(res.suggestions || []);
    } catch (err) {
      console.error("Suggest changes failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = async (suggestionId: string) => {
    if (!selected) return;

    setLoading(true);

    try {
      const res = await apiPost<{ contract: Contract }>(
        `/contracts/${selected._id}/apply-suggestion`,
        { suggestionId }
      );

      setSelected(res.contract);
      setContracts((prev) =>
        prev.map((c) => (c._id === res.contract._id ? res.contract : c))
      );
      setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
      setAnalysis("");
    } catch (err) {
      console.error("Apply suggestion failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSuggestion = (suggestionId: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
  };

  const renderDiff = (original: string, suggestion: string) => {
    const diff = diffWords(original, suggestion);

    return diff.map((part, index) => {
      if (part.added) {
        return (
          <span key={index} className="bg-green-200">
            {part.value}
          </span>
        );
      }
      if (part.removed) {
        return (
          <span
            key={index}
            className="line-through text-red-600 bg-red-100"
          >
            {part.value}
          </span>
        );
      }
      return <span key={index}>{part.value}</span>;
    });
  };

  const insightsText =
    loading && !analysis
      ? "Analyzing this contract with AI…"
      : analysis ||
        selected?.aiInsights ||
        "No AI insights yet. Select a contract and click “Analyze with AI”.";

  const totalContracts = contracts.length;
  const lastCreated =
    contracts[0]?.createdAt &&
    new Date(contracts[0].createdAt).toLocaleString();

  return (
    <div className="w-full max-w-6xl mx-auto min-h-[calc(100vh-120px)] flex flex-col gap-6">
      {/* HEADER + SUMMARY CARDS */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Overview of your contracts and AI insights.
            </p>
          </div>

          <UploadContractButton onUploaded={handleUploaded} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total contracts</p>
              <p className="text-xl font-semibold">{totalContracts}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">Active contract</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {selected?.title || "None selected"}
            </p>
            {lastCreated && (
              <p className="mt-1 text-[11px] text-gray-400">
                Latest created: {lastCreated}
              </p>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">AI status</p>
              <p className="text-sm font-semibold text-gray-900">
                {loading ? "Working…" : "Idle"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID: VIEWER + INSIGHTS + SUGGESTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6 flex-1">
        {/* LEFT: contract viewer & controls */}
        <div className="flex flex-col gap-4">
          {/* Control bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Active contract
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {selected?.title || "No contract selected"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadContracts}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
              <button
                onClick={handleSuggestChanges}
                disabled={!selected || loading}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60"
              >
                <Sparkles className="w-3 h-3" />
                Suggest changes
              </button>
              <button
                onClick={handleAnalyze}
                disabled={!selected || loading}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                <Sparkles className="w-3 h-3" />
                {loading ? "Analyzing…" : "Analyze with AI"}
              </button>
            </div>
          </div>

          {/* Viewer */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex-1 min-h-[360px]">
            {selected ? (
              <ContractViewer contract={selected} />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                No contracts yet – upload one to get started.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: AI insights + suggestions + recent list */}
        <div className="flex flex-col gap-4">
          {/* AI insights panel */}
          <InsightsPanel insights={insightsText} loading={loading} />

          {/* AI suggestions panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-sm font-semibold mb-2">AI suggestions</h3>
            {suggestions.length === 0 ? (
              <p className="text-xs text-gray-400">
                No suggestions yet. Click “Suggest changes” to generate some.
              </p>
            ) : (
              <ul className="space-y-3 max-h-72 overflow-auto pr-1">
                {suggestions.map((s) => (
                  <li
                    key={s.id}
                    className="border border-gray-100 rounded-md p-2 text-xs"
                  >
                    {s.sectionTitle && (
                      <p className="font-semibold mb-1">{s.sectionTitle}</p>
                    )}

                    <p className="text-[11px] text-gray-500 mb-1">
                      Red = removed, green = added.
                    </p>

                    <div className="text-xs bg-gray-50 p-2 rounded border mb-2">
                      {renderDiff(s.original, s.suggestion)}
                    </div>

                    <p className="text-gray-400 mb-2">
                      <span className="font-medium">Reason:</span> {s.reason}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApplySuggestion(s.id)}
                        className="px-2 py-1 rounded bg-green-600 text-white"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectSuggestion(s.id)}
                        className="px-2 py-1 rounded border border-gray-200"
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent contracts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-sm font-semibold mb-2">Recent contracts</h3>
            {contracts.length === 0 ? (
              <p className="text-xs text-gray-400">
                You haven’t uploaded any contracts yet.
              </p>
            ) : (
              <ul className="space-y-1">
                {contracts.slice(0, 5).map((c) => (
                  <li
                    key={c._id}
                    className={`text-xs flex items-center justify-between gap-2 rounded-md px-2 py-1 cursor-pointer hover:bg-gray-50 ${
                      selected?._id === c._id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => {
                      setSelected(c);
                      setAnalysis("");
                      setSuggestions(c.aiSuggestions || []);
                    }}
                  >
                    <span className="truncate">{c.title || "(Untitled)"}</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
