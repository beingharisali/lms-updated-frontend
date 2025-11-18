"use client";

import { useAuth } from "@/hooks/useAuth";
import { Bell } from "lucide-react";
import React from "react";
import UserProfile from "./UserProfile";

type HeaderProps = {
  pageTitle?: string;
  breadcrumb?: string;
};

export default function Header({
  pageTitle = "Main Dashboard",
  breadcrumb = "Main Dashboard",
}: HeaderProps) {
  const auth = useAuth();

  // async function logout() {
  //   await auth.logoutUser();
  // }

  return (
    <div>
      {/* ✅ Main Header Section */}
      <div className="bg-transparent shadow py-2 mx-2 rounded-2xl sticky md:top-3 top-20 z-40 backdrop-blur-sm flex items-center justify-between min-w-[300px]">
        {/* ✅ Breadcrumb + Page Title */}
        <div>
          <h2 className="ml-4 text-sm sm:text-base md:text-base text-gray-500">
            Pages / {breadcrumb}
          </h2>
          <h2 className="ml-4 text-lg sm:text-xl md:text-2xl text-gray-800 font-semibold">
            {pageTitle}
          </h2>
        </div>

        {/* ✅ Right Icons and Controls */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mr-2 sm:mr-3 md:mr-4">
          <span className="bg-gray-200 text-gray-700 px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium shadow-sm animate-tilt-pulse">
            Main Branch
          </span>
          <Bell className="text-gray-600 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
          {/* <button
            onClick={logout}
            className="text-sm text-red-600 hover:text-red-800 transition"
          >
            Logout */}
          {/* </button> */}
          <UserProfile />
        </div>
      </div>
    </div>
  );
}
