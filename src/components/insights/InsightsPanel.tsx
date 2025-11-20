import React from "react";

interface InsightsPanelProps {
  insights: string;
  loading?: boolean;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights, loading }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold mb-2">AI Insights</h3>

      <div className="flex-1 text-xs text-gray-700 whitespace-pre-wrap">
        {loading
          ? "Running analysis…"
          : insights || "No AI insights yet. Run an analysis to see results here."}
      </div>
    </div>
  );
};

export default InsightsPanel;
