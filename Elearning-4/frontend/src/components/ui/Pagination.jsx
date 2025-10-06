import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = []
  
  // Generate page numbers with ellipsis
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i)
    }
  }

  const paginationItems = []
  let lastPage = 0
  
  pages.forEach(page => {
    if (lastPage && page - lastPage > 1) {
      paginationItems.push(
        <span key={`ellipsis-${lastPage}`} className="px-3 py-2 text-gray-500">
          ...
        </span>
      )
    }
    paginationItems.push(
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`px-3 py-2 rounded-md transition-colors ${
          currentPage === page
            ? 'bg-primary-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        {page}
      </button>
    )
    lastPage = page
  })

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      {paginationItems}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}

export default Pagination