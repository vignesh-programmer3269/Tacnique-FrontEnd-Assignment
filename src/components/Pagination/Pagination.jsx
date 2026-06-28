import "./Pagination.css";

function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalRecords,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
}) {
  return (
    <div className="pagination">
      <div className="pagination__info">
        Showing <span className="pagination__bold">{startIndex}</span> to{" "}
        <span className="pagination__bold">{endIndex}</span> of{" "}
        <span className="pagination__bold">{totalRecords}</span> users
      </div>

      <div className="pagination__controls">
        <div className="pagination__page-size">
          <label htmlFor="page-size-select" className="pagination__label sr-only">
            Rows per page
          </label>
          <select
            id="page-size-select"
            className="pagination__select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="pagination__actions">
          <button
            className="pagination__button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            Previous
          </button>
          
          <span className="pagination__page-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            className="pagination__button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
