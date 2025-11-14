import React from "react";
import { Upload } from "lucide-react";
import type { Clause } from "../../types/contract";

interface ContractViewerProps {
  clauses: Clause[];
}

const ContractViewer: React.FC<ContractViewerProps> = ({ clauses }) => {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-6">
      <button className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
        <Upload className="w-4 h-4" />
        Upload Contract
      </button>

      <div className="space-y-6">
        {clauses.map((clause) => (
          <div key={clause.id}>
            <h2 className="text-xl font-semibold mb-2">{clause.title}</h2>
            {clause.body ? (
              <p className="text-sm leading-relaxed text-gray-700">
                {clause.body.split("exceed unlimited").length > 1 ? (
                  <>
                    {clause.body.split("exceed unlimited")[0]}
                    <span className="text-red-500 font-semibold">
                      exceed unlimited
                    </span>
                    {clause.body.split("exceed unlimited")[1]}
                  </>
                ) : (
                  clause.body
                )}
              </p>
            ) : (
              <>
                <div className="h-3 w-3/4 bg-gray-100 rounded-full mb-2" />
                <div className="h-3 w-2/3 bg-gray-100 rounded-full" />
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContractViewer;
