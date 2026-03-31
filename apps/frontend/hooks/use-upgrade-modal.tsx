import { UpgradeModal } from "@/components/upgrade-modal";
import { AxiosError } from "axios";
import { useState } from "react";

export const useUpgradeModal = () => {
  const [open, setOpen] = useState(false);

  const handleError = (error: unknown) => {
    if (error instanceof AxiosError && error.response?.status === 402) {
      setOpen(true);
      return;
    }
    return false;
  };

  const modal = <UpgradeModal open={open} onOpenChange={setOpen} />;
  return { handleError, modal };
};
