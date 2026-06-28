import "./UserRow.css";

function UserRow({ user }) {
  return (
    <tr className="user-row">
      <td className="user-row__cell">{user.id}</td>
      <td className="user-row__cell">{user.firstName}</td>
      <td className="user-row__cell">{user.lastName}</td>
      <td className="user-row__cell">
        <span className="user-row__email">{user.email}</span>
      </td>
      <td className="user-row__cell">{user.department}</td>
      <td className="user-row__cell">
        <div className="user-row__actions" aria-label={`Actions for user ${user.id}`}>
          <button className="user-row__button" type="button" disabled>
            Edit
          </button>
          <button className="user-row__button" type="button" disabled>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default UserRow;
