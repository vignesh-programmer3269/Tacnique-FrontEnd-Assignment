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
