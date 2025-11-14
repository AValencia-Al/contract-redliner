import useModal from "../../hooks/useModal";
import UploadContractModal from "./UploadContractModal";
import { Upload } from "lucide-react";

export default function UploadContractButton() {
  const modal = useModal();

  return (
    <>
      <button
        onClick={modal.show}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <Upload className="w-5 h-5" />
        Upload Contract
      </button>

      <UploadContractModal open={modal.open} onClose={modal.hide} />
    </>
  );
}
