import { useState, useMemo } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import UserTable from "./components/UserTable/UserTable";
import { useUsers } from "./hooks/useUsers";

function App() {
  const { users, loading, error } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const lowerQuery = searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      const matchFirst = user.firstName.toLowerCase().includes(lowerQuery);
      const matchLast = user.lastName.toLowerCase().includes(lowerQuery);
      const matchEmail = user.email.toLowerCase().includes(lowerQuery);
      return matchFirst || matchLast || matchEmail;
    });
  }, [users, searchQuery]);

  let content = (
    <div className="app-dashboard">
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <UserTable users={filteredUsers} />
    </div>
  );

  if (loading) {
    content = <p className="app-placeholder__text">Loading users...</p>;
  }

  if (error) {
    content = (
      <p className="app-placeholder__text app-placeholder__text--error">
        {error}
      </p>
    );
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <div className="app-content">
          <div className="app-placeholder">{content}</div>
        </div>
      </main>
    </div>
  );
}

export default App;
