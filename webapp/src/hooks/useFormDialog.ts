import { useState, useCallback } from "react";

interface UseFormDialogReturn<T> {
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  handleSave: (data: T) => void;
}

const useFormDialog = <T = any>(
  onSaveCallback?: (data: T) => void
): UseFormDialogReturn<T> => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSave = useCallback(
    (data: T) => {
      try {
        if (onSaveCallback) {
          onSaveCallback(data);
        }
      } catch (error) {
        console.error("Error during save callback:", error);
      }
      handleClose();
    },
    [onSaveCallback, handleClose]
  );

  return {
    isOpen,
    handleOpen,
    handleClose,
    handleSave,
  };
};

export default useFormDialog;
