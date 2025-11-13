import React from "react";
import { Upload, AlertTriangle } from "lucide-react";

const DashboardPage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: contract viewer card */}
      <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
        <button className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          <Upload className="w-4 h-4" />
          Upload Contract
        </button>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Section 4. Limitation of Liability
            </h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Except in cases of gross negligence or willful misconduct, the total liability of
              the company shall not{" "}
              <span className="text-red-500 font-semibold">
                exceed unlimited the amounts
              </span>{" "}
              paid under this agreement.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Section 5. Termination</h2>
            <div className="h-3 w-3/4 bg-gray-100 rounded-full mb-2" />
            <div className="h-3 w-2/3 bg-gray-100 rounded-full" />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Section 5. Termination</h2>
            <div className="h-3 w-4/5 bg-gray-100 rounded-full mb-2" />
            <div className="h-3 w-1/2 bg-gray-100 rounded-full" />
          </div>
        </div>
      </section>

      {/* Right: AI insights */}
      <aside className="space-y-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-red-600">
            <AlertTriangle className="w-4 h-4" />
            <span>High</span>
          </div>
          <p className="mt-2 font-semibold text-sm">Limitation of Liability Clause</p>
          <p className="mt-1 text-xs text-gray-600 leading-relaxed">
            This clause may expose the company to significant financial risk. Consider limiting
            liability.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="font-semibold text-sm mb-1">
            Consider changing ‘unlimited’ to ‘capped at’
          </p>
          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            Limiting liability aligns this clause with industry standards.
          </p>

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
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="font-semibold text-sm mb-1">Deviation from standard NDA</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            Clause 7 differs from typical NDA terms. Recommend review by legal team.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default DashboardPage;
