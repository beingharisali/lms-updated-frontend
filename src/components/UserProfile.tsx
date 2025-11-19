"use client";

import { useState } from "react";
import { User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function UserProfile() {
  const [open, setOpen] = useState<boolean>(false);
  const { user, logoutUser } = useAuth();

  return (
    <div className="relative z-[9999]">
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center shadow hover:ring-2 hover:ring-blue-400"
      >
        <UserIcon className="w-6 h-6" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg p-4 z-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {user?.name || "No name"}
              </p>
              <p className="text-sm text-gray-500">
                {user?.email || "No email"}
              </p>
            </div>
          </div>

          <hr className="my-2" />
          <p className="text-sm">
            <strong>Role:</strong> {user?.role || "No role"}
          </p>

          <button onClick={logoutUser}>Logout</button>
        </div>
      )}
    </div>
  );
}
