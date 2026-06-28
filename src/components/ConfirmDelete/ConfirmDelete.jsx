import { useState, useEffect, useRef } from "react";
import "./ConfirmDelete.css";

function ConfirmDelete({ isOpen, onClose, onConfirm, user, buttonRect }) {
  const [render, setRender] = useState(isOpen);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const popupRef = useRef(null);
  const cancelBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      setErrorMsg("");
      setIsDeleting(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        if (!popupRef.current) return;
        
        const focusableElements = popupRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    
    const timeoutId = setTimeout(() => {
      if (cancelBtnRef.current) {
        cancelBtnRef.current.focus();
      }
    }, 50);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [isOpen, onClose, isDeleting]);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setRender(false);
    }
  };

  const handleConfirm = async () => {
    setIsDeleting(true);
    setErrorMsg("");
    try {
      await onConfirm(user);
    } catch (error) {
      setErrorMsg(error.message || "Failed to delete user.");
      setIsDeleting(false);
    }
  };

  if (!render || !user) return null;

  return (
    <div
      className={`confirm-delete-overlay ${
        isOpen ? "confirm-delete-overlay--open" : "confirm-delete-overlay--closed"
      }`}
      onAnimationEnd={handleAnimationEnd}
      onClick={!isDeleting ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <div
        className={`confirm-delete-modal ${
          isOpen ? "confirm-delete-modal--open" : "confirm-delete-modal--closed"
        }`}
        ref={popupRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          "--origin-x": buttonRect ? `${buttonRect.left + buttonRect.width / 2}px` : "50vw",
          "--origin-y": buttonRect ? `${buttonRect.top + buttonRect.height / 2}px` : "50vh",
        }}
      >
        <div className="confirm-delete__header">
          <h2 id="confirm-delete-title" className="confirm-delete__title">
            Delete User
          </h2>
          <button
            className="confirm-delete__close-btn"
            onClick={onClose}
            aria-label="Close"
            disabled={isDeleting}
          >
            ✕
          </button>
        </div>

        <div className="confirm-delete__body">
          {errorMsg && <div className="confirm-delete__error">{errorMsg}</div>}
          <p className="confirm-delete__message">
            Are you sure you want to delete <strong>{user.firstName} {user.lastName}</strong>?
          </p>
          <p className="confirm-delete__warning">
            This action cannot be undone.
          </p>
        </div>

        <div className="confirm-delete__footer">
          <button
            ref={cancelBtnRef}
            type="button"
            className="confirm-delete__btn confirm-delete__btn--cancel"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="confirm-delete__btn confirm-delete__btn--delete"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDelete;
