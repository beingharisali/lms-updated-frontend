"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import {
  FiUser,
  FiSettings,
  FiMoon,
  FiMessageSquare,
  FiLogOut,
} from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  pageTitle: string;
  breadcrumb?: string;
}

export default function Staffheader({ pageTitle, breadcrumb }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-transparent shadow py-2 mx-2 rounded-2xl sticky md:top-3 top-20 z-40 backdrop-blur-sm flex items-center justify-between">
      <div>
        <h2 className="ml-4 text-sm sm:text-base md:text-base">
          Pages / {breadcrumb || pageTitle}
        </h2>
        <h2 className="ml-4 text-lg sm:text-xl md:text-2xl text-gray-800">
          {pageTitle}
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mr-2 sm:mr-3 md:mr-4">
        <span className="bg-gray-200 text-gray-700 px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium shadow-sm animate-tilt-pulse">
          Main Branch
        </span>
        <Bell className="text-gray-600 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />

        {/* Profile dropdown */}
        <div className="relative group" ref={dropdownRef}>
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 overflow-hidden cursor-pointer relative"
            onClick={toggleDropdown}
            title="Profile Picture"
          >
            <img
              src="https://i.pinimg.com/736x/7d/6e/eb/7d6eeb79b0b43bb0987bf4c6935fa148.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Dropdown menu */}
          <div
            className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ${
              isDropdownOpen ? "block" : "hidden"
            }`}
          >
            <Link
              href="/staff/your-profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              <div className="flex items-center">
                <FiUser className="w-4 h-4 mr-2" />
                Your Profile
              </div>
            </Link>
            <Link
              href="/staff/settings-privacy"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              <div className="flex items-center">
                <FiSettings className="w-4 h-4 mr-2" />
                Settings and Privacy
              </div>
            </Link>

            <Link
              href="/staff/logout"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              <div className="flex items-center">
                <FiLogOut className="w-4 h-4 mr-2" />
                Logout
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
