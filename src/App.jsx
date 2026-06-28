import { useState, useMemo, useEffect } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import UserTable from "./components/UserTable/UserTable";
import Pagination from "./components/Pagination/Pagination";
import { useUsers } from "./hooks/useUsers";
import { sortUsers, paginateUsers, getPaginationInfo } from "./utils/helpers";

function App() {
  const { users, loading, error } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

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

  const sortedUsers = useMemo(() => {
    return sortUsers(filteredUsers, sortField, sortDirection);
  }, [filteredUsers, sortField, sortDirection]);

  useEffect(() => {
    if (sortedUsers.length === 0) {
      setCurrentPage(1);
    } else {
      const totalPages = Math.ceil(sortedUsers.length / pageSize);
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    }
  }, [sortedUsers.length, pageSize, currentPage]);

  const { totalPages, safeCurrentPage, startIndex, endIndex } = getPaginationInfo(
    sortedUsers.length,
    currentPage,
    pageSize
  );

  const paginatedUsers = useMemo(() => {
    return paginateUsers(sortedUsers, safeCurrentPage, pageSize);
  }, [sortedUsers, safeCurrentPage, pageSize]);

  let content = (
    <div className="app-dashboard">
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <UserTable 
        users={paginatedUsers} 
        sortField={sortField} 
        sortDirection={sortDirection} 
        onSort={handleSort} 
      />
      {sortedUsers.length > 0 && (
        <Pagination 
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRecords={sortedUsers.length}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
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
