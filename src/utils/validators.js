import { DEFAULT_DEPARTMENTS } from "../constants/constants";

export function validateUserForm(data) {
  const errors = {};

  if (!data.firstName || data.firstName.trim() === "") {
    errors.firstName = "First Name is required.";
  }

  if (!data.lastName || data.lastName.trim() === "") {
    errors.lastName = "Last Name is required.";
  }

  if (!data.email || data.email.trim() === "") {
    errors.email = "Email is required.";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = "Invalid email address.";
    }
  }

  if (!data.department || data.department.trim() === "") {
    errors.department = "Department is required.";
  } else if (!DEFAULT_DEPARTMENTS.includes(data.department)) {
    errors.department = "Selected department is invalid.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
