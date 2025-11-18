"use client";

import Adminsidebar from "@/components/Adminsidebar";
import React, { useState } from "react";
import Image from "next/image";
import { Bell, User, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import http from "@/services/http";
import AdminHeader from "../../../../components/AdminHeader";

function VisitorPortal() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      // Make API request using the http service
      const response = await http.post("/visitors", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200 && response.status !== 201) {
        const errorData = await response.data;
        throw new Error(errorData.message || "Failed to create visitor lead");
      }

      const result = await response.data;
      setMessage({
        text: "Visitor lead created successfully!",
        type: "success",
      });

      // Reset form after successful submission
      setFormData({
        userName: "",
        email: "",
      });
    } catch (error: any) {
      console.error("Error creating visitor lead:", error);
      setMessage({
        text:
          error.message || "Failed to create visitor lead. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4fafd] overflow-x-hidden relative">
      {/* Sidebar (Desktop + Mobile Drawer) */}
      {/* Desktop */}
      <div className="hidden md:block w-[250px] min-w-[250px]">
        <Adminsidebar />
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-[250px] bg-white shadow-lg h-full">
            <Adminsidebar />
          </div>
          {/* Backdrop */}
          <div
            className="flex-1 bg-black bg-opacity-30"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 px-4 md:px-0">
        {/* Top Bar */}
        {/* Use the new AdminHeader component */}
        <AdminHeader
          breadcrumb="Super Admin / Add Visitor Leads"
          title="Add Visitor Leads"
        />{" "}
        {/* Message Display */}
        {message.text && (
          <div
            className={`mb-4 mx-0 md:mx-8 p-3 rounded-md ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}
        {/* Form Card */}
        <div className="pb-8 px-0 md:px-8">
          <div className="bg-white rounded-xl shadow-md px-4 md:px-8 py-8 w-full overflow-hidden">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Add Visitor User
            </h2>

            {/* Form Inputs */}
            <form
              className="flex flex-col md:flex-row flex-wrap gap-4"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col w-full md:max-w-[300px]">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  User Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="userName"
                  placeholder="Enter User Name"
                  value={formData.userName}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded-md px-4 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>

              <div className="flex flex-col w-full md:max-w-[300px]">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded-md px-4 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>

              {/* Save Button */}
              <div className="w-full flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" />
                      </svg>
                      Save
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the protected version
export default function ProtectedVisitorPortal() {
  return (
    <ProtectedRoute allowedRoles={["admin", "staff"]}>
      <VisitorPortal />
    </ProtectedRoute>
  );
}
