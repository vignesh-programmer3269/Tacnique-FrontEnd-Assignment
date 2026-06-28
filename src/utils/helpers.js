import { DEFAULT_DEPARTMENTS } from "../constants/constants";

function getDepartmentForUser(userId) {
  const idNumber = parseInt(userId, 10);
  if (isNaN(idNumber)) {
    return DEFAULT_DEPARTMENTS[0];
  }
  const index = Math.max(0, idNumber - 1) % DEFAULT_DEPARTMENTS.length;
  return DEFAULT_DEPARTMENTS[index];
}

export function mapApiUser(user) {
  const [firstName = "", ...lastNameParts] = (user.name || "")
    .trim()
    .split(/\s+/);

  return {
    id: user.id,
    firstName,
    lastName: lastNameParts.join(" "),
    email: user.email,
    department: getDepartmentForUser(user.id),
  };
}

export function mapApiUsers(users) {
  return users.map((user) => mapApiUser(user));
}

export function sortUsers(users, sortField, sortDirection) {
  if (!sortField || !sortDirection) {
    return users;
  }

  return [...users].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === "string") aValue = aValue.toLowerCase();
    if (typeof bValue === "string") bValue = bValue.toLowerCase();

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
}

export function paginateUsers(users, currentPage, pageSize) {
  const startIndex = (currentPage - 1) * pageSize;
  return users.slice(startIndex, startIndex + pageSize);
}

export function getPaginationInfo(totalRecords, currentPage, pageSize) {
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex =
    totalRecords === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endIndex = Math.min(safeCurrentPage * pageSize, totalRecords);

  return {
    totalPages,
    safeCurrentPage,
    startIndex,
    endIndex,
  };
}

export function applyAdvancedFilters(users, filters) {
  if (!filters) return users;

  return users.filter((user) => {
    if (
      filters.firstName &&
      !user.firstName
        .toLowerCase()
        .includes(filters.firstName.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      filters.lastName &&
      !user.lastName
        .toLowerCase()
        .includes(filters.lastName.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      filters.email &&
      !user.email.toLowerCase().includes(filters.email.trim().toLowerCase())
    ) {
      return false;
    }
    if (filters.department && user.department !== filters.department) {
      return false;
    }
    return true;
  });
}
