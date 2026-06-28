import { useRef } from "react";
import "./UserRow.css";

function UserRow({ user, onEdit, onDelete }) {
  const editBtnRef = useRef(null);
  const deleteBtnRef = useRef(null);

  return (
    <tr className="user-row">
      <th scope="row" className="user-row__cell">{user.id}</th>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default UserRow;
