import { useState } from "react";

export default function useModal() {
  const [open, setOpen] = useState(false);

  const show = () => setOpen(true);
  const hide = () => setOpen(false);

  return { open, show, hide };
}
