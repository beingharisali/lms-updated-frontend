"use client";
import React, { useState, useMemo } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

export function DataTable({
  columns,
  data,
  loading,
  actions,
  externalSearch,
  pageSize = 10,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  // Improved filtering logic that handles accessor functions and nested data
  const filteredData = useMemo(() => {
    if (!externalSearch || externalSearch.trim() === "") {
      return data;
    }

    const searchLower = externalSearch.toLowerCase();

    return data.filter((row) => {
      // Check all column values including accessor functions
      const columnMatches = columns.some((col) => {
        let value;
        if (col.accessor && typeof col.accessor === "function") {
          value = col.accessor(row);
        } else {
          value = row[col.key];
        }

        return String(value || "")
          .toLowerCase()
          .includes(searchLower);
      });

      if (columnMatches) return true;

      // Also search through flattened nested properties
      const searchInNestedProps = (obj, prefix = "") => {
        for (const [key, value] of Object.entries(obj || {})) {
          const fullKey = prefix ? `${prefix}.${key}` : key;

          if (value && typeof value === "object" && !Array.isArray(value)) {
            // Recursively search nested objects
            if (searchInNestedProps(value, fullKey)) {
              return true;
            }
          } else {
            // Search primitive values
            if (
              String(value || "")
                .toLowerCase()
                .includes(searchLower)
            ) {
              return true;
            }
          }
        }
        return false;
      };

      return searchInNestedProps(row);
    });
  }, [data, externalSearch, columns]);

  // Improved sorting logic that handles accessor functions
  const sortedData = useMemo(() => {
    if (!sortConfig.key) {
      return filteredData;
    }

    return [...filteredData].sort((a, b) => {
      const column = columns.find((col) => col.key === sortConfig.key);
      let aValue, bValue;

      if (column?.accessor && typeof column.accessor === "function") {
        aValue = column.accessor(a);
        bValue = column.accessor(b);
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Convert to strings for comparison
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig, columns]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Get current page data
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset to first page when data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredData.length]);

  // Render sort icon
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <FaSort className="inline ml-1 opacity-50" />;
    if (sortConfig.direction === "asc")
      return <FaSortUp className="inline ml-1" />;
    return <FaSortDown className="inline ml-1" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="text-sm text-gray-700 mb-4 sm:mb-0">
          {externalSearch && (
            <span className="text-blue-600">
              Filtered results: {filteredData.length} of {data.length}
            </span>
          )}
          {!externalSearch && <span>Total records: {data.length}</span>}
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Show:</span>
            <select
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center">
                    {col.label}
                    {renderSortIcon(col.key)}
                  </div>
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center py-12"
                >
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-500">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center justify-center">
                    <FaSearch className="text-gray-400 text-3xl mb-2" />
                    <p className="text-gray-500 font-medium">
                      No records found
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {externalSearch
                        ? "Try adjusting your search query"
                        : "No data available"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              currentData.map((row, index) => (
                <tr
                  key={row._id || index}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                    >
                      {col.render
                        ? col.render(row)
                        : col.accessor
                        ? col.accessor(row) || "-"
                        : String(row[col.key] || "-")}
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {actions.map((action, idx) => (
                          <button
                            key={idx}
                            className={`p-2 rounded-full transition-colors ${
                              action.variant === "view"
                                ? "text-blue-600 hover:bg-blue-50"
                                : action.variant === "edit"
                                ? "text-yellow-600 hover:bg-yellow-50"
                                : action.variant === "delete"
                                ? "text-red-600 hover:bg-red-50"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                            onClick={() => action.onClick(row)}
                            title={action.label}
                          >
                            {action.variant === "view" && <FaEye size={16} />}
                            {action.variant === "edit" && <FaEdit size={16} />}
                            {action.variant === "delete" && (
                              <FaTrash size={16} />
                            )}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && sortedData.length > 0 && (
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, sortedData.length)}
            </span>{" "}
            of <span className="font-medium">{sortedData.length}</span> results
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="mr-1" />
              Previous
            </button>

            <div className="hidden md:flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-2 py-1.5 text-sm text-gray-500">...</span>
              )}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {totalPages}
                </button>
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <FaChevronRight className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
