import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
  totalItems
}) => {
  if (totalPages <= 0) return null;

  // Generate page array with smart ellipsis logic
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination-wrapper glass-panel">
      <div className="pagination-info">
        <span className="page-status-label">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        {totalItems !== undefined && (
          <span className="total-items-badge">
            ({totalItems} total records)
          </span>
        )}
      </div>

      <div className="pagination-controls">
        <button
          className="btn btn-secondary pagination-btn"
          onClick={handlePrev}
          disabled={currentPage <= 1}
          aria-label="Previous Page"
        >
          <ChevronLeft size={18} />
          <span>Prev</span>
        </button>

        <div className="page-numbers">
          {pages.map((page, idx) => {
            if (page === '...') {
              return <span key={`ellipsis-${idx}`} className="pagination-ellipsis">...</span>;
            }
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                className={`page-num-btn ${isActive ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          className="btn btn-secondary pagination-btn"
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          aria-label="Next Page"
        >
          <span>Next</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {onLimitChange && (
        <div className="per-page-selector">
          <label htmlFor="limit-select" className="limit-label">Show:</label>
          <select
            id="limit-select"
            value={limit || 8}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="form-select limit-select"
          >
            <option value={8}>8 per page</option>
            <option value={16}>16 per page</option>
            <option value={24}>24 per page</option>
            <option value={32}>32 per page</option>
          </select>
        </div>
      )}
    </div>
  );
};
