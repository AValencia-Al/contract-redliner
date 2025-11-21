// src/components/upload/UploadContractButton.tsx
import React, { useState } from "react";
import UploadContractModal from "./UploadContractModal";
import type { Contract } from "../../types/contract";

interface Props {
  onUploaded: (contract: Contract) => void;
}

const UploadContractButton: React.FC<Props> = ({ onUploaded }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
      >
        Upload contract
      </button>

      <UploadContractModal
        open={open}
        onClose={() => setOpen(false)}
        onUploaded={onUploaded}
      />
    </>
  );
};

export default UploadContractButton;
