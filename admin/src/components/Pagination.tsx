// admin\src\components\Pagination.tsx
'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageNumbers = () => {
    const pages: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      // Show first 2, last 2, current ±1
      if (
        i === 1 ||
        i === 2 ||
        i === totalPages ||
        i === totalPages - 1 ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (
        (i === 3 && currentPage > 4) ||
        (i === totalPages - 2 && currentPage < totalPages - 3)
      ) {
        pages.push('...');
      }
    }

    // Remove duplicate ellipses
    return pages.filter((page, idx, arr) => !(page === '...' && arr[idx - 1] === '...'));
  };

  return (
    <div className="flex justify-center mt-6 space-x-2">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-200 text-gray-400" : "bg-indigo-600 text-white"}`}
      >
        Prev
      </button>

      {createPageNumbers().map((page, idx) =>
        page === '...' ? (
          <span key={idx} className="px-3 py-1 text-gray-500">…</span>
        ) : (
          <button
            key={idx}
            onClick={() => onPageChange(Number(page))}
            className={`px-3 py-1 rounded ${currentPage === page ? "bg-indigo-700 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            {page}
          </button>
        )
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-200 text-gray-400" : "bg-indigo-600 text-white"}`}
      >
        Next
      </button>
    </div>
  );
}
