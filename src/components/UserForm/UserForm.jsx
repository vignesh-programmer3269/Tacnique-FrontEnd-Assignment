import { useState, useEffect, useRef } from "react";
import { DEFAULT_DEPARTMENTS } from "../../constants/constants";
import { validateUserForm } from "../../utils/validators";
import "./UserForm.css";

function UserForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  buttonRect,
  mode = "add",
}) {
  const [render, setRender] = useState(isOpen);
  const [formData, setFormData] = useState(
    initialData || {
      firstName: "",
      lastName: "",
      email: "",
      department: "",
    },
  );

  const [formErrors, setFormErrors] = useState({});
  const title =
    mode === "edit" ? `Edit User ${initialData?.id || ""}`.trim() : "Add User";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const popupRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      setFormData(
        initialData || {
          firstName: "",
          lastName: "",
          email: "",
          department: "",
        },
      );
      setErrorMsg("");
      setFormErrors({});
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialData]);

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
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    if (formErrors[name]) {
      const { errors } = validateUserForm(newFormData);
      if (!errors[name]) {
        setFormErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const { isValid, errors } = validateUserForm(formData);

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setErrorMsg(err.message || "An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClass = (fieldName) => {
    let baseClass =
      fieldName === "department" ? "user-form__select" : "user-form__input";
    if (formErrors[fieldName]) {
      return `${baseClass} user-form__input--error`;
    }
    return baseClass;
  };

  return (
    <div
      className={`user-form-overlay ${
        isOpen ? "user-form-overlay--open" : "user-form-overlay--closed"
      }`}
      onAnimationEnd={handleAnimationEnd}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-form-title"
    >
      <div
        className={`user-form-modal ${
          isOpen ? "user-form-modal--open" : "user-form-modal--closed"
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
        <div className="user-form__header">
          <h2 id="user-form-title" className="user-form__title">
            {title}
          </h2>
          <button
            className="user-form__close-btn"
            onClick={onClose}
            aria-label="Close"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <form className="user-form__form" onSubmit={handleSubmit} noValidate>
          <div className="user-form__body">
            {errorMsg && <div className="user-form__error">{errorMsg}</div>}

            <div className="user-form__grid">
              <div className="user-form__field">
                <label htmlFor="user-firstName" className="user-form__label">
                  First Name <span className="user-form__required">*</span>
                </label>
                <input
                  id="user-firstName"
                  name="firstName"
                  type="text"
                  className={getInputClass("firstName")}
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. John"
                  ref={firstInputRef}
                  disabled={isSubmitting}
                  aria-invalid={!!formErrors.firstName}
                  aria-describedby={
                    formErrors.firstName ? "firstName-error" : undefined
                  }
                />
                {formErrors.firstName && (
                  <p id="firstName-error" className="user-form__error-text">
                    {formErrors.firstName}
                  </p>
                )}
              </div>

              <div className="user-form__field">
                <label htmlFor="user-lastName" className="user-form__label">
                  Last Name <span className="user-form__required">*</span>
                </label>
                <input
                  id="user-lastName"
                  name="lastName"
                  type="text"
                  className={getInputClass("lastName")}
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Doe"
                  disabled={isSubmitting}
                  aria-invalid={!!formErrors.lastName}
                  aria-describedby={
                    formErrors.lastName ? "lastName-error" : undefined
                  }
                />
                {formErrors.lastName && (
                  <p id="lastName-error" className="user-form__error-text">
                    {formErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="user-form__field">
              <label htmlFor="user-email" className="user-form__label">
                Email <span className="user-form__required">*</span>
              </label>
              <input
                id="user-email"
                name="email"
                type="email"
                className={getInputClass("email")}
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. john@example.com"
                disabled={isSubmitting}
                aria-invalid={!!formErrors.email}
                aria-describedby={formErrors.email ? "email-error" : undefined}
              />
              {formErrors.email && (
                <p id="email-error" className="user-form__error-text">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div className="user-form__field">
              <label htmlFor="user-department" className="user-form__label">
                Department <span className="user-form__required">*</span>
              </label>
              <select
                id="user-department"
                name="department"
                className={getInputClass("department")}
                value={formData.department}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={!!formErrors.department}
                aria-describedby={
                  formErrors.department ? "department-error" : undefined
                }
              >
                <option value="">Select Department</option>
                {DEFAULT_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {formErrors.department && (
                <p id="department-error" className="user-form__error-text">
                  {formErrors.department}
                </p>
              )}
            </div>
          </div>

          <div className="user-form__footer">
            <button
              type="button"
              className="user-form__btn user-form__btn--cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="user-form__btn user-form__btn--submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : mode === "edit"
                  ? "Save Changes"
                  : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserForm;
