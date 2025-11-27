import React from "react";
import type { Contract } from "../../types/contract";

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

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  const backendOrigin = apiUrl.replace(/\/api\/?$/, "");

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

  const revisedPdfUrl = `${backendOrigin}/api/contracts/${contract._id}/download-pdf`;

  return (
    <div className="h-full flex flex-col gap-4">
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

          <a
            href={revisedPdfUrl}
            className="text-xs px-3 py-1 rounded-full bg-green-600 text-white hover:bg-green-700"
          >
            Download revised PDF
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[560px]">
        <div className="flex flex-col">
          <h4 className="text-sm font-semibold mb-1">Extracted text</h4>
          <div className="flex-1 border border-gray-200 rounded-lg bg-white text-xs text-gray-800 p-3 overflow-y-auto whitespace-pre-wrap">
            {contract.content || (
              <span className="text-gray-400">
                This contract has no stored text yet.
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <h4 className="text-sm font-semibold mb-1">
            File preview {fileMeta ? `(${fileMeta.mimeType})` : ""}
          </h4>
          <div className="flex-1 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
            {!fileMeta || !fileUrl ? (
              <p className="text-xs text-gray-400">
                No original file attached to this contract.
              </p>
            ) : isPdf ? (
              <iframe
                src={fileUrl}
                className="w-full h-full border-0"
                title="PDF preview"
              />
            ) : isDocx ? (
              <div className="text-xs text-gray-600 text-center px-4">
                <p className="mb-2">
                  Your browser may not fully preview DOCX files inline.
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
    </div>
  );
};

export default ContractViewer;
