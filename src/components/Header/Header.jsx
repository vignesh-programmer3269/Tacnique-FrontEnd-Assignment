import { useRef } from "react";
import "./Header.css";

function Header({ onAddUser }) {
  const btnRef = useRef(null);

  const handleClick = () => {
    if (onAddUser && btnRef.current) {
      onAddUser(btnRef.current.getBoundingClientRect());
    }
  };

  return (
    <header className="app-header">
      <div className="app-header__content">
        <h1 className="app-header__title">User Management Dashboard</h1>
        <button
          ref={btnRef}
          className="app-header__add-btn"
          onClick={handleClick}
          aria-haspopup="dialog"
        >
          Add User
        </button>
      </div>
    </header>
  );
}

export default Header;
