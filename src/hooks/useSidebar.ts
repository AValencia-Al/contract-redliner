import { useState } from "react";

export default function useSidebar() {
  const [open, setOpen] = useState(false);

  return {
    open,
    openSidebar: () => setOpen(true),
    closeSidebar: () => setOpen(false),
    toggleSidebar: () => setOpen((prev) => !prev),
  };
}
