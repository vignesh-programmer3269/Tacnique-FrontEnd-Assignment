import { useState, useCallback } from "react";

export function useModalState() {
  const [isOpen, setIsOpen] = useState(false);
  const [triggerRect, setTriggerRect] = useState(null);

  const handleOpen = useCallback((rect = null) => {
    setTriggerRect(rect);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback((focusSelector = null) => {
    setIsOpen(false);
    if (focusSelector) {
      setTimeout(() => {
        document.querySelector(focusSelector)?.focus();
      }, 10);
    }
  }, []);

  return {
    isOpen,
    triggerRect,
    handleOpen,
    handleClose,
  };
}
