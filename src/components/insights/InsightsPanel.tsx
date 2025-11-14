import React from "react";
import { AlertTriangle } from "lucide-react";
import type { Insight } from "../../types/contract";

interface InsightsPanelProps {
  insights: Insight[];
}

const severityClasses: Record<string, string> = {
  high: "text-red-600",
  medium: "text-amber-600",
  low: "text-green-600",
};

const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights }) => {
  const [first, ...rest] = insights;

  return (
    <aside className="space-y-4">
      {first && (
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div
            className={`flex items-center gap-2 text-sm font-semibold ${
              severityClasses[first.severity] ?? "text-gray-700"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="capitalize">{first.severity}</span>
          </div>
          <p className="mt-2 font-semibold text-sm">{first.title}</p>
          <p className="mt-1 text-xs text-gray-600 leading-relaxed">
            {first.description}
          </p>
        </div>
      )}

      {rest.map((insight) => (
        <div key={insight.id} className="bg-white rounded-2xl shadow-sm p-4">
          <p className="font-semibold text-sm mb-1">{insight.title}</p>
          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            {insight.description}
          </p>

          {insight.id === "i2" && (
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Accept
              </button>
              <button className="flex-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                Reject
              </button>
              <button className="flex-1 px-3 py-1 text-xs font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">
                Explain
              </button>
            </div>
          )}
        </div>
      ))}
    </aside>
  );
};

export default InsightsPanel;
