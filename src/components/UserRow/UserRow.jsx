import { useRef } from "react";
import "./UserRow.css";

function UserRow({ user, onEdit, onDelete }) {
  const editBtnRef = useRef(null);
  const deleteBtnRef = useRef(null);

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
        <div
          className="user-row__actions"
          aria-label={`Actions for user ${user.id}`}
        >
          <button
            ref={editBtnRef}
            className="user-row__button"
            type="button"
            data-userid={user.id}
            onClick={() =>
              onEdit?.(user, editBtnRef.current?.getBoundingClientRect())
            }
          >
            Edit
          </button>

          <button
            ref={deleteBtnRef}
            className="user-row__button"
            type="button"
            data-delete-userid={user.id}
            onClick={() =>
              onDelete?.(user, deleteBtnRef.current?.getBoundingClientRect())
            }
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default UserRow;
