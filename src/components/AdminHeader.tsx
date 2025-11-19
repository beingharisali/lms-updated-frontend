"use client";
import { useAuth } from "../hooks/useAuth";
import UserProfile from "./UserProfile";
import { BsBell } from "react-icons/bs";

interface AdminHeaderProps {
  breadcrumb: string;
  title?: string;
  showBranch?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  showLogout?: boolean;
}

export default function AdminHeader({
  breadcrumb,
  title,
  showBranch = true,
  showNotifications = true,
  showProfile = true,
  showLogout = true,
}: AdminHeaderProps) {
  const auth = useAuth();

  async function logout() {
    await auth.logoutUser();
  }

  return (
    <div className="bg-transparent shadow py-2 mx-2 rounded-2xl sticky md:top-3 top-20 z-40 backdrop-blur-sm flex items-center justify-between min-w-[300px] mt-4">
      <div>
        <h2 className="ml-4 text-sm sm:text-base md:text-base text-gray-500">
          {breadcrumb}
        </h2>
        <h2 className="ml-4 text-lg sm:text-xl md:text-2xl text-gray-800 font-semibold">
          {title}
        </h2>
      </div>

      {/* Top-right controls */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mr-2 sm:mr-3 md:mr-4">
        {showBranch && (
          <span className="bg-gray-200 text-gray-700 px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium shadow-sm animate-tilt-pulse">
            Main Branch
          </span>
        )}

        {showNotifications && (
          <BsBell className="text-gray-600 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:text-blue-600 transition-colors" />
        )}

        {showLogout && (
          <button
            onClick={logout}
            className="text-gray-600 hover:text-red-600 px-2 py-1 rounded text-sm hover:bg-gray-100 transition"
          >
            Logout
          </button>
        )}

        {showProfile && <UserProfile />}
      </div>
    </div>
  );
}
