import UserRow from "../UserRow/UserRow";
import "./UserTable.css";

function UserTable({
  users,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
}) {
  if (!users.length) {
    return (
      <div className="user-table__empty-state" role="status" aria-live="polite">
        No users available.
      </div>
    );
  }

  const renderSortIndicator = (field) => {
    const isActive = sortField === field;
    return (
      <span
        className={`user-table__sort-indicator ${
          !isActive ? "user-table__sort-indicator--hidden" : ""
        }`}
        aria-hidden="true"
      >
        {isActive && sortDirection === "desc" ? "▼" : "▲"}
      </span>
    );
  };

  const getSortAria = (field) => {
    if (sortField !== field) return "none";
    return sortDirection === "asc" ? "ascending" : "descending";
  };

  return (
    <div className="user-table">
      <div className="user-table__scroll">
        <table className="user-table__element">
          <thead className="user-table__head">
            <tr>
              <th
                className="user-table__heading user-table__heading--sortable"
                scope="col"
                aria-sort={getSortAria("id")}
                onClick={() => onSort("id")}
              >
                ID {renderSortIndicator("id")}
              </th>
              <th
                className="user-table__heading user-table__heading--sortable"
                scope="col"
                aria-sort={getSortAria("firstName")}
                onClick={() => onSort("firstName")}
              >
                First Name {renderSortIndicator("firstName")}
              </th>
              <th
                className="user-table__heading user-table__heading--sortable"
                scope="col"
                aria-sort={getSortAria("lastName")}
                onClick={() => onSort("lastName")}
              >
                Last Name {renderSortIndicator("lastName")}
              </th>
              <th
                className="user-table__heading user-table__heading--sortable"
                scope="col"
                aria-sort={getSortAria("email")}
                onClick={() => onSort("email")}
              >
                Email {renderSortIndicator("email")}
              </th>
              <th
                className="user-table__heading user-table__heading--sortable"
                scope="col"
                aria-sort={getSortAria("department")}
                onClick={() => onSort("department")}
              >
                Department {renderSortIndicator("department")}
              </th>
              <th className="user-table__heading" scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserTable;
