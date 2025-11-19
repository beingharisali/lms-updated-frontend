"use client";

import AddCourses from "@/components/shared/AddCourses";
import Adminsidebar from "@/components/Adminsidebar";
import AdminHeader from "@/components/AdminHeader";
import ProtectedRoute from "@/components/ProtectedRoute";

function AddCoursesPage() {
  return (
    <>
      <div className="flex-1 md:mt-8 mt-24 overflow-y-auto px-6">
        <AddCourses />
      </div>
    </>
  );
}

export default function ProtectedAddCoursesPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AddCoursesPage />
    </ProtectedRoute>
  );
}
