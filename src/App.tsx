import React from "react";
import { Upload, AlertCircle } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow-sm rounded-2xl px-6 py-4 mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Contract Redliner</h1>
        <nav className="flex items-center gap-6">
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
            Dashboard
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
            Settings
          </a>
        </nav>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contract Viewer */}
        <section className="col-span-2 bg-white shadow-sm rounded-2xl p-6">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mb-6 transition">
            <Upload className="w-4 h-4" />
            Upload Contract
          </button>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Section 4: Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                Except in cases of gross negligence or willful misconduct, the total liability of the company shall not{" "}
                <span className="text-red-500 font-medium">exceed unlimited the amounts</span> paid under this agreement.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Section 5: Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                Either party may terminate this agreement upon written notice if the other party materially breaches its
                obligations and fails to cure such breach within thirty (30) days.
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard */}
        <aside className="bg-white shadow-sm rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">AI Insights</h2>

          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-red-700 font-semibold text-sm">High Risk</p>
            </div>
            <p className="font-semibold text-gray-900 mb-1">Limitation of Liability Clause</p>
            <p className="text-gray-600 text-sm">
              This clause may expose the company to significant financial risk. Consider limiting liability to a capped amount.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
            <p className="font-semibold text-gray-900 mb-1">
              Suggestion: Replace ‘unlimited’ with ‘capped at total fees paid’.
            </p>
            <p className="text-gray-600 text-sm mb-3">
              This change aligns with industry standards for service contracts.
            </p>
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700">Accept</button>
              <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300">Reject</button>
              <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-100">Explain</button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <p className="font-semibold text-gray-900 mb-1">Deviation Notice</p>
            <p className="text-gray-600 text-sm">
              Clause 7 (Indemnification) deviates from standard NDA terms. Recommend review by legal team.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
