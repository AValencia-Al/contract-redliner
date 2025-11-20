// src/components/upload/UploadContractModal.tsx
import React, { useState } from "react";
import { apiPost } from "../../services/api";
import type { Contract } from "../../types/contract";

interface UploadContractModalProps {
  open: boolean;
  onClose: () => void;
  onUploaded: (contract: Contract) => void;
}

const UploadContractModal: React.FC<UploadContractModalProps> = ({
  open,
  onClose,
  onUploaded,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 👇 THIS is what keeps it from being your permanent landing page
  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (title.trim()) formData.append("title", title.trim());
      formData.append("file", file); // field name MUST be "file"

      const contract = await apiPost<Contract>("/contracts/upload", formData);

      onUploaded(contract);
      setFile(null);
      setTitle("");
      onClose();
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-5 space-y-4">
        <h3 className="text-lg font-semibold">Upload Contract</h3>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="border-2 border-dashed border-gray-300 rounded-lg py-10 text-center text-xs text-gray-500">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="contract-file-input"
            />
            <label
              htmlFor="contract-file-input"
              className="cursor-pointer text-blue-600 hover:underline"
            >
              Click to upload or drag &amp; drop
            </label>
            <p className="mt-2">
              Supported: PDF, DOCX, TXT (text extracted on the server)
            </p>
            {file && (
              <p className="mt-2 text-xs text-gray-700">
                Selected: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              Contract title
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. Service Agreement with Acme Ltd."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs rounded-md border border-gray-200 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save contract"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadContractModal;
