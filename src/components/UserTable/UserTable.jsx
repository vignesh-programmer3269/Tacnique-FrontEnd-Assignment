import UserRow from "../UserRow/UserRow";
import "./UserTable.css";

function UserTable({ users }) {
  if (!users.length) {
    return (
      <div className="user-table__empty-state" role="status" aria-live="polite">
        No users available.
      </div>
    );
  }

  return (
    <div className="user-table">
      <div className="user-table__scroll">
        <table className="user-table__element">
          <thead className="user-table__head">
            <tr>
              <th className="user-table__heading" scope="col">
                ID
              </th>
              <th className="user-table__heading" scope="col">
                First Name
              </th>
              <th className="user-table__heading" scope="col">
                Last Name
              </th>
              <th className="user-table__heading" scope="col">
                Email
              </th>
              <th className="user-table__heading" scope="col">
                Department
              </th>
              <th className="user-table__heading" scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserTable;
