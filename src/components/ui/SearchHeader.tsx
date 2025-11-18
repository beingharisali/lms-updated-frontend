"use client";
import { FaSearch, FaPlus, FaFilter } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface StatItem {
  label: string;
  count: number;
  color?: string;
}

interface FilterOption {
  value: string;
  label: string;
}

interface SearchHeaderProps {
  placeholder?: string; // e.g. "Search students by name, email, or ID..."
  searchTerm: string; // Controlled input value
  onSearchChange: (value: string) => void; // Handles search input change
  addLabel: string; // e.g. "Add Student"
  addRedirect: string; // e.g. "/admin/admission/addstudent"

  // Optional statistics display
  stats?: StatItem[]; // e.g. [{ label: "Total", count: 50 }, { label: "Active", count: 45, color: "text-green-600" }]

  // Optional filtering
  filterOptions?: FilterOption[]; // e.g. [{ value: "all", label: "All Status" }, { value: "active", label: "Active" }]
  selectedFilter?: string;
  onFilterChange?: (value: string) => void;

  // Optional sorting
  sortOptions?: FilterOption[]; // e.g. [{ value: "name", label: "Name" }, { value: "date", label: "Date Added" }]
  selectedSort?: string;
  onSortChange?: (value: string) => void;
}

export default function SearchHeader({
  placeholder = "Search...",
  searchTerm,
  onSearchChange,
  addLabel,
  addRedirect,
  stats = [],
  filterOptions = [],
  selectedFilter = "",
  onFilterChange,
  sortOptions = [],
  selectedSort = "",
  onSortChange,
}: SearchHeaderProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Statistics Section */}
      {stats.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {stats.map((stat, index) => (
                  <span key={stat.label}>
                    <span
                      className={`font-medium ${stat.color || "text-gray-800"}`}
                    >
                      {stat.label}: {stat.count}
                    </span>
                    {index < stats.length - 1 && (
                      <span className="mx-2">•</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Controls Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Search Input */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 flex-1 max-w-md">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent outline-none flex-1"
            />
          </div>

          {/* Controls Section */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Dropdown */}
            {filterOptions.length > 0 && onFilterChange && (
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-500 text-sm" />
                <select
                  value={selectedFilter}
                  onChange={(e) => onFilterChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {filterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort Dropdown */}
            {sortOptions.length > 0 && onSortChange && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={selectedSort}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Add Button */}
            <button
              onClick={() => router.push(addRedirect)}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              <FaPlus /> {addLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
