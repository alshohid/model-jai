
import { useState, useCallback } from "react";
import type {
  SupportSide,
  SupportConfirmHandler,
} from "@/shared/components/watchLive/types";

interface UseSupportDialogReturn {
  isOpen: boolean;
  selectedSide: SupportSide;
  openDialog: (side: SupportSide) => void;
  closeDialog: () => void;
  handleConfirm: (
    supporterName: string,
    amount: number,
    onConfirm?: SupportConfirmHandler,
  ) => void;
}

export function useSupportDialog(): UseSupportDialogReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSide, setSelectedSide] = useState<SupportSide>("left");

  const openDialog = useCallback((side: SupportSide) => {
    setSelectedSide(side);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleConfirm = useCallback(
    (
      supporterName: string,
      amount: number,
      onConfirm?: SupportConfirmHandler,
    ) => {
      if (onConfirm) {
        onConfirm(selectedSide, supporterName, amount);
      }
    },
    [selectedSide],
  );

  return {
    isOpen,
    selectedSide,
    openDialog,
    closeDialog,
    handleConfirm,
  };
}
