"use client";

import { useState, useEffect } from "react";
import {
  FaMicrophone,
  FaUser,
  FaForward,
  FaBackward,
  FaBars,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { BsBell } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Adminsidebar from "@/components/Adminsidebar";
import AdminHeader from "@/components/AdminHeader";
import { useCourse } from "@/features/courses/hooks/useCourse";
import ProtectedRoute from "@/components/ProtectedRoute";

function CoursesPage() {
  const router = useRouter();
  const { courses, loading, loadCourses, removeCourse } = useCourse();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = courses.filter(
        (course: any) =>
          course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.courseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructorName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [searchTerm, courses]);

  const handleDelete = async (courseId: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await removeCourse(courseId);
        alert("Course deleted successfully!");
      } catch (error) {
        alert("Failed to delete course");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-600";
      case "Completed":
        return "bg-blue-600";
      case "Upcoming":
        return "bg-yellow-600";
      case "Inactive":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#eff6f9] text-gray-800 relative">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow z-[9999] transition-transform duration-300 transform 
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <Adminsidebar />
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-[9998] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 pt-6 relative z-10 px-4">
        {/* Header */}
        <AdminHeader breadcrumb="Admin / Courses" title="Courses Management" />

        {/* Display Records + Add Course */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-sm text-gray-600 whitespace-nowrap">
              Total Courses: {filteredCourses.length}
            </div>
          </div>
          <div>
            <Link href="/admin/courses/add-courses">
              <button className="bg-[#067954] text-white rounded-md px-6 py-2 text-sm shadow-md hover:bg-[#353a40] transition whitespace-nowrap">
                + Add Course
              </button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full mt-4">
          <input
            type="text"
            placeholder="Search Courses by name, ID, or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 pr-10 text-sm"
          />
          <FiSearch className="absolute top-2.5 left-4 text-gray-500 text-[18px]" />
          <FaMicrophone className="absolute top-2.5 right-4 text-gray-500 text-[18px] cursor-pointer" />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center mt-10">
            <div className="text-gray-600">Loading courses...</div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <div className="flex flex-col justify-center items-center mt-10">
            <p className="text-gray-600 text-lg">No courses found</p>
            <Link href="/admin/courses/add-courses">
              <button className="mt-4 bg-[#067954] text-white rounded-md px-6 py-2 text-sm shadow-md hover:bg-[#353a40] transition">
                + Add Your First Course
              </button>
            </Link>
          </div>
        )}

        {/* Course Cards */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {filteredCourses.map((course: any) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden p-4 flex flex-col gap-2 text-center relative w-full sm:max-w-sm min-h-[420px]"
            >
              {/* Course Image */}
              <div className="w-[100px] h-[100px] rounded-full mx-auto overflow-hidden bg-gray-100">
                {course.courseImage ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${course.courseImage}`}
                    alt={course.courseName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-2xl">
                      {course.courseName?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="font-semibold text-[17px]">
                {course.courseName}
              </div>
              <div className="text-gray-600 text-sm">{course.courseId}</div>

              {/* Enrollment Badge */}
              <span className="bg-emerald-700 text-white text-xs px-3 py-[2px] rounded flex items-center justify-center mt-2 w-[130px] mx-auto">
                {course.noOfStudentsEnrolled} Enrollments
              </span>

              {/* Duration and Instructor */}
              <div className="flex flex-col gap-1 mt-2 text-xs text-gray-600">
                <div>Duration: {course.duration}</div>
                <div>Instructor: {course.instructorName}</div>
                <div>
                  Lectures: {course.lecturesDelivered}/{course.totalLectures}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-2 mt-3">
                <Link href={`/admin/courses/detail/${course._id}`}>
                  <button className="border px-4 py-1.5 rounded text-sm hover:bg-gray-100 transition">
                    Detail
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="bg-red-600 text-white px-4 py-1.5 rounded text-sm hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>

              {/* Status Indicator */}
              <span
                className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${getStatusColor(
                  course.status
                )}`}
              ></span>

              {/* Status Label */}
              <span className="text-xs text-gray-500 mt-1">
                {course.status}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function ProtectedCoursesPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <CoursesPage />
    </ProtectedRoute>
  );
}
