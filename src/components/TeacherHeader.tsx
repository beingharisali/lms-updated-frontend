"use client";

import { useAuth } from "@/hooks/useAuth";
import { Bell } from "lucide-react";
import React, { useState } from "react";
import UserProfile from "./UserProfile";

interface TeacherHeaderProps {
  pageTitle: string;
  breadcrumb: string;
}

export default function TeacherHeader({ pageTitle, breadcrumb }: TeacherHeaderProps) {
  const auth = useAuth();

// export default function LogoutPage() {
 

  return (
    <div>
      <div className="bg-transparent shadow py-2 mx-2 rounded-2xl sticky md:top-3 top-20 z-40 backdrop-blur-sm flex items-center justify-between min-w-[300px]">
        <div>
          <h2 className="ml-4 text-sm sm:text-base md:text-base">
            Pages / {breadcrumb}
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
           <UserProfile />

        </div>
      </div>
    </div>
  );
}
