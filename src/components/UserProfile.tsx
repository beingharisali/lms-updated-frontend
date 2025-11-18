"use client";

import { useState, useEffect } from "react";
import { User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Define user data type
interface User {
  name: string;
  email: string;
  role: string;
  profileImage?: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        setUser(JSON.parse(userData) as User);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    } else {
      // 👇 If no user in localStorage, create a dummy one
      const dummyUser: User = {
        name: "Sehar Mughal",
        email: "sehar@example.com",
        role: "Instructor",
      };
      localStorage.setItem("user", JSON.stringify(dummyUser));
      setUser(dummyUser);
    }
  }, []);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const imageURL = URL.createObjectURL(file);
      const updatedUser: User = { ...user, profileImage: imageURL };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };
 const auth = useAuth();

  async function logout() {
    await auth.logoutUser();
  }
  return (
    <div className="relative z-[9999]">
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center shadow hover:ring-2 hover:ring-blue-400"
      >
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <UserIcon className="w-6 h-6" /> // Default Profile Icon
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg p-4 z-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-6 h-6" />
              )}
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

          {/* Upload Image Option */}
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700">
              Upload Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 text-sm"
              onChange={handleFileChange}
            />
          </div>
                    <button onClick={logout}>Logout</button>
          
        </div>
      )}
    </div>
  );
}
