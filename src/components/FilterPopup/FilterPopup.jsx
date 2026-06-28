import { useState, useEffect, useRef } from "react";
import { DEFAULT_DEPARTMENTS } from "../../constants/constants";
import "./FilterPopup.css";

function FilterPopup({
  isOpen,
  onClose,
  onApply,
  onReset,
  initialFilters,
  buttonRect,
}) {
  const [render, setRender] = useState(isOpen);
  const [localFilters, setLocalFilters] = useState(initialFilters);
  const popupRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      setLocalFilters(initialFilters);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialFilters]);

  // Focus trap and Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        if (!popupRef.current) return;

        const focusableElements = popupRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

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

    // Focus first input on open
    const timeoutId = setTimeout(() => {
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }, 50);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [isOpen, onClose]);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setRender(false);
    }
  };

  if (!render) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    const emptyFilters = {
      firstName: "",
      lastName: "",
      email: "",
      department: "",
    };
    setLocalFilters(emptyFilters);
    onReset(emptyFilters);
  };

  return (
    <div
      className={`filter-popup-overlay ${
        isOpen ? "filter-popup-overlay--open" : "filter-popup-overlay--closed"
      }`}
      onAnimationEnd={handleAnimationEnd}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-popup-title"
    >
      <div
        className={`filter-popup-modal ${
          isOpen ? "filter-popup-modal--open" : "filter-popup-modal--closed"
        }`}
        ref={popupRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          "--origin-x": buttonRect
            ? `${buttonRect.left + buttonRect.width / 2}px`
            : "50vw",
          "--origin-y": buttonRect
            ? `${buttonRect.top + buttonRect.height / 2}px`
            : "50vh",
        }}
      >
        <div className="filter-popup__header">
          <h2 id="filter-popup-title" className="filter-popup__title">
            Advanced Filters
          </h2>
          <button
            className="filter-popup__close-btn"
            onClick={onClose}
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onApply(localFilters);
          }}
        >
          <div className="filter-popup__body">
            <div className="filter-popup__field">
              <label htmlFor="filter-firstName" className="filter-popup__label">
                First Name
              </label>
              <input
                id="filter-firstName"
                name="firstName"
                type="text"
                className="filter-popup__input"
                value={localFilters.firstName}
                onChange={handleChange}
                placeholder="e.g. John"
                ref={firstInputRef}
              />
            </div>

            <div className="filter-popup__field">
              <label htmlFor="filter-lastName" className="filter-popup__label">
                Last Name
              </label>
              <input
                id="filter-lastName"
                name="lastName"
                type="text"
                className="filter-popup__input"
                value={localFilters.lastName}
                onChange={handleChange}
                placeholder="e.g. Doe"
              />
            </div>

            <div className="filter-popup__field">
              <label htmlFor="filter-email" className="filter-popup__label">
                Email
              </label>
              <input
                id="filter-email"
                name="email"
                type="text"
                className="filter-popup__input"
                value={localFilters.email}
                onChange={handleChange}
                placeholder="e.g. john@example.com"
              />
            </div>

            <div className="filter-popup__field">
              <label
                htmlFor="filter-department"
                className="filter-popup__label"
              >
                Department
              </label>
              <select
                id="filter-department"
                name="department"
                className="filter-popup__select"
                value={localFilters.department}
                onChange={handleChange}
              >
                <option value="">All Departments</option>
                {DEFAULT_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-popup__footer">
            <button
              type="button"
              className="filter-popup__btn filter-popup__btn--reset"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              type="submit"
              className="filter-popup__btn filter-popup__btn--apply"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FilterPopup;
