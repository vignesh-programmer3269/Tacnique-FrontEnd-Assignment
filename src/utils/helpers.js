import { DEFAULT_DEPARTMENTS } from "./constants";

function getDepartmentForUser(userId) {
  const idNumber = parseInt(userId, 10);
  if (isNaN(idNumber)) {
    return DEFAULT_DEPARTMENTS[0];
  }
  const index = Math.max(0, idNumber - 1) % DEFAULT_DEPARTMENTS.length;
  return DEFAULT_DEPARTMENTS[index];
}

export function mapApiUser(user) {
  const [firstName = "", ...lastNameParts] = (user.name || "").trim().split(/\s+/);

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
