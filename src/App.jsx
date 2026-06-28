import { useState, useRef } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import UserTable from "./components/UserTable/UserTable";
import Pagination from "./components/Pagination/Pagination";
import FilterPopup from "./components/FilterPopup/FilterPopup";
import UserForm from "./components/UserForm/UserForm";
import ConfirmDelete from "./components/ConfirmDelete/ConfirmDelete";
import ErrorPopup from "./components/ErrorPopup/ErrorPopup";
import { useUsers } from "./hooks/useUsers";
import { useTableState } from "./hooks/useTableState";
import { useModalState } from "./hooks/useModalState";
import { createUser, updateUser, deleteUser } from "./api/userService";

function App() {
  const {
    users,
    loading,
    error: fetchError,
    addUser,
    updateUserLocal,
    deleteUserLocal,
  } = useUsers();

  const {
    searchQuery,
    setSearchQuery,
    sortField,
    sortDirection,
    pageSize,
    filters,
    paginatedUsers,
    paginationInfo: { totalPages, safeCurrentPage, startIndex, endIndex },
    handleApplyFilters,
    handleResetFilters,
    handleSort,
    handlePageSizeChange,
    setCurrentPage,
  } = useTableState(users);

  const filterModal = useModalState();
  const filterBtnRef = useRef(null);

  const userFormModal = useModalState();
  const [userFormMode, setUserFormMode] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);

  const confirmDeleteModal = useModalState();
  const [selectedUserForDelete, setSelectedUserForDelete] = useState(null);

  const [mutationError, setMutationError] = useState({
    message: "",
    source: null,
  });

  const handleOpenFilter = () => {
    filterModal.handleOpen(filterBtnRef.current?.getBoundingClientRect());
  };

  const handleCloseFilter = () => {
    filterModal.handleClose(".app-dashboard__filter-btn");
  };

  const handleApplyFiltersApp = (newFilters) => {
    handleApplyFilters(newFilters);
    handleCloseFilter();
  };

  const handleOpenAddUser = (rect) => {
    setUserFormMode("add");
    setSelectedUser(null);
    userFormModal.handleOpen(rect);
  };

  const handleOpenEditUser = (user, rect) => {
    setUserFormMode("edit");
    setSelectedUser(user);
    userFormModal.handleOpen(rect);
  };

  const handleCloseUserForm = () => {
    const focusSelector =
      userFormMode === "add"
        ? ".app-header__add-btn"
        : `.user-row__button[data-userid="${selectedUser?.id}"]`;
    userFormModal.handleClose(focusSelector);
  };

  const handleUserFormSubmit = async (formData) => {
    try {
      if (userFormMode === "add") {
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
        setCurrentPage(1);
      } else if (userFormMode === "edit" && selectedUser) {
        await updateUser(selectedUser.id, {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
        });

        const updatedUser = {
          ...selectedUser,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          department: formData.department,
        };

        updateUserLocal(updatedUser);
      }
      handleCloseUserForm();
    } catch (err) {
      setMutationError({
        message: err.message || "Failed to save user data. Please try again.",
        source: "form",
      });
    }
  };

  const handleOpenDeleteConfirm = (user, rect) => {
    setSelectedUserForDelete(user);
    confirmDeleteModal.handleOpen(rect);
  };

  const handleCloseDeleteConfirm = () => {
    confirmDeleteModal.handleClose(
      `.user-row__button[data-delete-userid="${selectedUserForDelete?.id}"]`
    );
  };

  const handleDeleteConfirm = async (user) => {
    try {
      await deleteUser(user.id);
      deleteUserLocal(user.id);
      confirmDeleteModal.handleClose();
    } catch (err) {
      setMutationError({
        message: err.message || "Failed to delete user. Please try again.",
        source: "delete",
      });
    }
  };

  let content = (
    <div className="app-dashboard">
      <div className="app-dashboard__controls">
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <button
          ref={filterBtnRef}
          className="app-dashboard__filter-btn"
          onClick={handleOpenFilter}
          aria-haspopup="dialog"
          aria-expanded={filterModal.isOpen}
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
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
        onEdit={handleOpenEditUser}
        onDelete={handleOpenDeleteConfirm}
      />
      {users.length > 0 && (
        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRecords={users.length}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
      <FilterPopup
        isOpen={filterModal.isOpen}
        onClose={handleCloseFilter}
        onApply={handleApplyFiltersApp}
        onReset={handleResetFilters}
        initialFilters={filters}
        buttonRect={filterModal.triggerRect}
      />

      <UserForm
        key={selectedUser ? selectedUser.id : "add-new"}
        isOpen={userFormModal.isOpen}
        onClose={handleCloseUserForm}
        onSubmit={handleUserFormSubmit}
        mode={userFormMode}
        initialData={selectedUser}
        buttonRect={userFormModal.triggerRect}
      />

      <ConfirmDelete
        key={selectedUserForDelete ? selectedUserForDelete.id : "delete-new"}
        isOpen={confirmDeleteModal.isOpen}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleDeleteConfirm}
        user={selectedUserForDelete}
        buttonRect={confirmDeleteModal.triggerRect}
      />
    </div>
  );

  if (loading) {
    content = (
      <div className="app-placeholder__text app-placeholder__text--column">
        <div className="app-spinner"></div>
        <span>Fetching data...</span>
      </div>
    );
  }

  // Fallback if data fetch failed
  if (fetchError && users.length === 0) {
    content = (
      <div className="app-placeholder__text app-placeholder__text--error">
        {fetchError ||
          "Unable to fetch active users from the database. Please verify your connection status and try again."}
      </div>
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

      <ErrorPopup
        isOpen={!!mutationError.message}
        message={mutationError.message}
        onRetry={() => setMutationError({ message: "", source: null })}
        onOk={() => {
          if (mutationError.source === "form") {
            handleCloseUserForm();
          } else if (mutationError.source === "delete") {
            handleCloseDeleteConfirm();
          }
          setMutationError({ message: "", source: null });
        }}
      />
    </div>
  );
}

export default App;
