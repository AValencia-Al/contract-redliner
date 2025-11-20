import { X, Upload } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function UploadContractModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl animate-fadeIn">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upload Contract</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-600 hover:text-black" />
          </button>
        </div>

        {/* Drag and Drop box */}
        <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 w-full flex flex-col items-center gap-3 cursor-pointer hover:border-blue-500 transition">
          <Upload className="w-10 h-10 text-gray-500" />
          <p className="text-gray-600">Click to upload or drag & drop</p>
          <input type="file" className="hidden" />
        </label>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-500">
          Supported formats: PDF, TXT, DOCX (UI only)
        </p>

        {/* Footer */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
