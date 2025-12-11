import React from "react";
import type { Contract } from "../../types/contract";
import { Download } from "lucide-react";

interface Props {
  contract: Contract | null;
}

const ContractViewer: React.FC<Props> = ({ contract }) => {
  if (!contract) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-gray-400">
        Select a contract to view.
      </div>
    );
  }

  // Compute backend origin: prefer VITE_API_URL if set, otherwise use current origin
  const apiUrl = import.meta.env.VITE_API_URL || "/api";
  const backendOrigin =
    apiUrl && apiUrl.startsWith("http")
      ? apiUrl.replace(/\/api\/?$/, "")
      : window.location.origin;

  const fileMeta = contract.originalFile;
  const fileUrl = fileMeta?.url ? `${backendOrigin}${fileMeta.url}` : undefined;
  const mime = fileMeta?.mimeType || "";

  const isPdf = mime.includes("pdf");

  const isDocx =
    mime.includes(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) ||
    (fileMeta?.fileName
      ? fileMeta.fileName.toLowerCase().endsWith(".docx")
      : false);

  // Use preview PDF for DOCX files if available, otherwise use original
  const previewUrl = isDocx && contract.previewPdfUrl
    ? `${backendOrigin}${contract.previewPdfUrl}`
    : fileUrl;

  const canPreview = isPdf || (isDocx && contract.previewPdfUrl);

  const handleDownloadRevisedPdf = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to download the PDF");
      return;
    }

    try {
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
        .toLowerCase()}_revised.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download PDF. Please try again.");
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{contract.title}</h3>
          <p className="text-xs text-gray-500">
            Created{" "}
            {new Date(contract.createdAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        <div className="flex gap-2">
          {fileMeta && fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-50"
            >
              Open original ({fileMeta.fileName})
            </a>
          )}

          <button
            onClick={handleDownloadRevisedPdf}
            className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-green-600 text-white hover:bg-green-700"
          >
            <Download className="w-3 h-3" />
            Download revised PDF
          </button>
        </div>
      </div>

      {/* File preview panel */}
      <div className="flex flex-col h-[560px]">
        <h4 className="text-sm font-semibold mb-1">
          File preview {fileMeta ? `(${fileMeta.mimeType})` : ""}
        </h4>
        <div className="flex-1 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
          {!fileMeta || !fileUrl ? (
            <p className="text-xs text-gray-400">
              No original file attached to this contract.
            </p>
          ) : canPreview ? (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title="Document preview"
            />
          ) : isDocx ? (
            <div className="text-xs text-gray-600 text-center px-4">
              <p className="mb-2">
                Preview unavailable for this DOCX file.
              </p>
              <p className="mb-3">
                Use the button above or below to open the Word document in a
                new tab.
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Open Word document
              </a>
            </div>
          ) : (
            <div className="text-xs text-gray-600 text-center px-4">
              <p className="mb-2">
                No inline preview available for this file type.
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Download &amp; open
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractViewer;
