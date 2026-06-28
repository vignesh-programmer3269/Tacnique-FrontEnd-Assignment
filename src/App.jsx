import { useState, useMemo, useEffect, useRef } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import UserTable from "./components/UserTable/UserTable";
import Pagination from "./components/Pagination/Pagination";
import FilterPopup from "./components/FilterPopup/FilterPopup";
import UserForm from "./components/UserForm/UserForm";
import { useUsers } from "./hooks/useUsers";
import {
  sortUsers,
  paginateUsers,
  getPaginationInfo,
  applyAdvancedFilters,
} from "./utils/helpers";
import { createUser } from "./api/userService";

function App() {
  const { users, loading, error, addUser } = useUsers();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterButtonRect, setFilterButtonRect] = useState(null);
  const filterBtnRef = useRef(null);

  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [addUserBtnRect, setAddUserBtnRect] = useState(null);

  const handleOpenFilter = () => {
    if (filterBtnRef.current) {
      setFilterButtonRect(filterBtnRef.current.getBoundingClientRect());
    }
    setIsFilterOpen(true);
  };

  const handleCloseFilter = () => {
    setIsFilterOpen(false);
    if (filterBtnRef.current) {
      filterBtnRef.current.focus();
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    handleCloseFilter();
  };

  const handleResetFilters = (emptyFilters) => {
    setFilters(emptyFilters);
    setCurrentPage(1);
  };

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

  const handleOpenAddUser = (rect) => {
    setAddUserBtnRect(rect);
    setIsUserFormOpen(true);
  };

  const handleCloseUserForm = () => {
    setIsUserFormOpen(false);
    setTimeout(() => {
      document.querySelector(".app-header__add-btn")?.focus();
    }, 10);
  };

  const handleAddUserSubmit = async (formData) => {
    await createUser({
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
    });

    const maxId =
      users.length > 0
        ? Math.max(...users.map((u) => parseInt(u.id, 10) || 0))
        : 0;

    const newUser = {
      id: maxId + 1,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      department: formData.department,
    };

    addUser(newUser);
    setIsUserFormOpen(false);
    setCurrentPage(1);

    setTimeout(() => {
      document.querySelector(".app-header__add-btn")?.focus();
    }, 10);
  };

  const searchedUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const lowerQuery = searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      const matchFirst = user.firstName.toLowerCase().includes(lowerQuery);
      const matchLast = user.lastName.toLowerCase().includes(lowerQuery);
      const matchEmail = user.email.toLowerCase().includes(lowerQuery);
      return matchFirst || matchLast || matchEmail;
    });
  }, [users, searchQuery]);

  const advancedFilteredUsers = useMemo(() => {
    return applyAdvancedFilters(searchedUsers, filters);
  }, [searchedUsers, filters]);

  const sortedUsers = useMemo(() => {
    return sortUsers(advancedFilteredUsers, sortField, sortDirection);
  }, [advancedFilteredUsers, sortField, sortDirection]);

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

  const { totalPages, safeCurrentPage, startIndex, endIndex } =
    getPaginationInfo(sortedUsers.length, currentPage, pageSize);

  const paginatedUsers = useMemo(() => {
    return paginateUsers(sortedUsers, safeCurrentPage, pageSize);
  }, [sortedUsers, safeCurrentPage, pageSize]);

  let content = (
    <div className="app-dashboard">
      <div className="app-dashboard__controls">
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <button
          ref={filterBtnRef}
          className="app-dashboard__filter-btn"
          onClick={handleOpenFilter}
          aria-haspopup="dialog"
          aria-expanded={isFilterOpen}
        >
          <span className="app-dashboard__filter-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.948 6.92127 20.9072 7.01881 20.8524 7.10828C20.7906 7.2092 20.7043 7.2955 20.5316 7.46824L14.4684 13.5318C14.2957 13.7045 14.2094 13.7908 14.1476 13.8917C14.0928 13.9812 14.052 14.0787 14.0276 14.1808C14 14.2959 14 14.4182 14 14.6627V19.4C14 19.9601 14 20.2401 13.891 20.454C13.7951 20.6422 13.6422 20.7951 13.454 20.891C13.2401 21 12.9601 21 12.4 21H11.6C11.0399 21 10.7599 21 10.546 20.891C10.3578 20.7951 10.2049 20.6422 10.109 20.454C10 20.2401 10 19.9601 10 19.4V14.6627C10 14.4182 10 14.2959 9.97236 14.1808C9.94796 14.0787 9.9072 13.9812 9.85239 13.8917C9.79064 13.7908 9.70433 13.7045 9.53165 13.5318L3.46835 7.46824C3.29567 7.2955 3.20936 7.2092 3.14761 7.10828C3.0928 7.01881 3.05204 6.92127 3.02764 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          Filter
        </button>
      </div>

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
      <FilterPopup
        isOpen={isFilterOpen}
        onClose={handleCloseFilter}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        initialFilters={filters}
        buttonRect={filterButtonRect}
      />

      <UserForm
        isOpen={isUserFormOpen}
        onClose={handleCloseUserForm}
        onSubmit={handleAddUserSubmit}
        title="Add New User"
        buttonRect={addUserBtnRect}
      />
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
      <Header onAddUser={handleOpenAddUser} />
      <main className="app-main">
        <div className="app-content">
          <div className="app-placeholder">{content}</div>
        </div>
      </main>
    </div>
  );
}

export default App;
