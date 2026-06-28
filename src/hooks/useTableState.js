import { useState, useMemo, useEffect } from "react";
import {
  sortUsers,
  paginateUsers,
  getPaginationInfo,
  applyAdvancedFilters,
} from "../utils/helpers";

export function useTableState(users) {
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

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
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

  const paginationInfo = getPaginationInfo(
    sortedUsers.length,
    currentPage,
    pageSize
  );

  const paginatedUsers = useMemo(() => {
    return paginateUsers(sortedUsers, paginationInfo.safeCurrentPage, pageSize);
  }, [sortedUsers, paginationInfo.safeCurrentPage, pageSize]);

  return {
    // State
    searchQuery,
    setSearchQuery,
    sortField,
    sortDirection,
    currentPage,
    setCurrentPage,
    pageSize,
    filters,
    
    // Derived state
    paginatedUsers,
    paginationInfo,
    
    // Handlers
    handleApplyFilters,
    handleResetFilters,
    handleSort,
    handlePageSizeChange,
  };
}
