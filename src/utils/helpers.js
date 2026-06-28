export function mapApiUser(user) {
  const [firstName = "", ...lastNameParts] = (user.name || "").trim().split(/\s+/);

  return {
    id: user.id,
    firstName,
    lastName: lastNameParts.join(" "),
    email: user.email,
    department: "IT",
  };
}

export function mapApiUsers(users) {
  return users.map((user) => mapApiUser(user));
}
