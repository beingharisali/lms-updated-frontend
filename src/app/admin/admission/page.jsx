"use client";
import { Sidebar } from "lucide-react";
import Adminsidebar from "../../../components/Adminsidebar";
import { Bell } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#eff6f9]">
      <Adminsidebar />

      {/* <div className="flex flex-col flex-1 bg-[#eff6f9]"> */}
        {/* Sticky Header - unchanged * /}
        <div className="bg-transparent shadow py-2 mx-2 rounded-2xl sticky md:top-3 top-20 z-40 backdrop-blur-sm flex items-center justify-between">
          <div>
            <h2 className="ml-4 text-sm sm:text-base md:text-base">
              Pages / Admissions
            </h2>
            <h2 className="ml-4 text-lg sm:text-xl md:text-2xl text-gray-800">
              Admissions
            </h2>
          </div>

          {/* Top-right controls */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mr-2 sm:mr-3 md:mr-4">
            <span className="bg-gray-200 text-gray-700 px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium shadow-sm animate-tilt-pulse">
              Main Branch
            </span>
            <Bell className="text-gray-600 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs sm:text-sm">
              ?
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <h2 className="mt-10 text-center">
            Talal & Daniyal are currently working on it
          </h2>
        </div>
      {/* </div> */}
    </div>
  );
}
