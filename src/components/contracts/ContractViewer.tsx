import React from "react";
import type { Clause } from "../../types/contract";
import { ZoomIn, ZoomOut, Highlighter } from "lucide-react";

interface ContractViewerProps {
  clauses: Clause[];
}

const ContractViewer: React.FC<ContractViewerProps> = ({ clauses }) => {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-0 overflow-hidden">

      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-800">Contract Document</h3>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded hover:bg-gray-200">
            <ZoomOut className="w-5 h-5 text-gray-600" />
          </button>

          <button className="p-2 rounded hover:bg-gray-200">
            <ZoomIn className="w-5 h-5 text-gray-600" />
          </button>

          <button className="p-2 rounded hover:bg-gray-200">
            <Highlighter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="p-6 h-[70vh] overflow-y-auto text-[15px] leading-relaxed text-gray-700 contract-scroll">

        {clauses.map((clause) => (
          <div key={clause.id} className="mb-8">

            {/* Heading */}
            <h2 className="text-lg font-bold mb-2 text-gray-900">
              {clause.title}
            </h2>

            {/* Paragraph or skeleton */}
            {clause.body ? (
              <p className="whitespace-pre-line">
                {highlightRiskyText(clause.body)}
              </p>
            ) : (
              <>
                <div className="h-3 w-4/5 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-3/5 bg-gray-200 rounded"></div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

/* Highlight risky words by wrapping in <span class="text-red-600 font-semibold"> */
function highlightRiskyText(text: string) {
  const riskyWords = ["unlimited", "liability", "breach", "terminate"];

  const regex = new RegExp(`\\b(${riskyWords.join("|")})\\b`, "gi");

  return text.split(regex).map((part, index) => {
    if (riskyWords.some(w => w.toLowerCase() === part.toLowerCase())) {
      return (
        <span key={index} className="text-red-600 font-semibold">
          {part}
        </span>
      );
    }
    return part;
  });
}

export default ContractViewer;
