"use client";

import { useState } from "react";
import {
  FaMicrophone,
  FaUser,
  FaForward,
  FaBackward,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { BsBell } from "react-icons/bs";
import Link from "next/link";
import dynamic from "next/dynamic";
import Adminsidebar from "../../components/Adminsidebar";
import Header from "@/components/TeacherHeader";

const Courses = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f5f5f5] text-gray-800 relative">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow z-[9999] transition-transform duration-300 transform 
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <Adminsidebar onClose={() => setSidebarOpen(false)} />
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
        {/* Top Section */}
        {/* <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"> */}
        
          <Header/>
        {/* </div> */}
<br />
<br />
        {/* Title */}
        <div className="mt-0">
          <h1 className="text-3xl font-bold text-gray-800 leading-none">
            Courses
          </h1>
        </div>

        {/* Display Records + Add Course */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-sm text-gray-600 whitespace-nowrap">
              Display Records:
            </div>
            <select className="bg-white border border-gray-300 text-gray-700 rounded-md px-4 py-2 text-sm shadow-sm">
              <option>Show 100 (Optimal)</option>
            </select>
          </div>
          <div>
            <div>
              <button
                onClick={() => setShowAddCourse(true)}
                className="text-gray-700 rounded-md px-6 py-2 text-sm shadow-md border-b-gray-400 whitespace-nowrap"
              >
                + Add Course
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full mt-4">
          <input
            type="text"
            placeholder="Search Courses..."
            className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 pr-10 text-sm"
          />
          <FiSearch className="absolute top-2.5 left-4 text-gray-500 text-[18px]" />
          <FaMicrophone className="absolute top-2.5 right-4 text-gray-500 text-[18px] cursor-pointer" />
        </div>

        {/* Course Cards */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {/* Course Card 1 */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden p-4 flex flex-col gap-2 text-center relative w-full sm:max-w-sm min-h-[420px]">
            <div className="w-[100px] h-[100px] rounded-full mx-auto overflow-hidden">
              <img
                src="/iimg1.png"
                alt="Course"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="font-semibold text-[17px]">FSDM 92</div>
            <div className="text-gray-600 text-sm">C00092</div>
            <span className="bg-emerald-700 text-white text-xs px-3 py-[2px] rounded flex items-center justify-center mt-2 w-[110px] mx-auto">
              17 Enrollments
            </span>
            <div className="flex justify-center gap-1 mt-2 flex-wrap">
              <span className="bg-emerald-600 text-white text-xs px-2 py-[2px] rounded flex items-center gap-1">
                <FaForward className="text-[10px]" /> 21-Jun-25
              </span>
              <span className="bg-red-600 text-white text-xs px-2 py-[2px] rounded flex items-center gap-1">
                <FaBackward className="text-[10px]" /> 21-Dec-25
              </span>
            </div>
            <div className="flex justify-center gap-2 mt-3">
              <Link href="/staff/courses/detail">
                <button className="border px-4 py-1.5 rounded text-sm">
                  Detail
                </button>
              </Link>
              <button className="bg-red-600 text-white px-4 py-1.5 rounded text-sm">
                Delete
              </button>
            </div>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          </div>

          {/* Course Card 2 */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden p-4 flex flex-col gap-2 text-center relative w-full sm:max-w-sm min-h-[420px]">
            <div className="w-[100px] h-[100px] rounded-full mx-auto overflow-hidden">
              <img
                src="/iimg2.png"
                alt="Course"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="font-semibold text-[17px]">FSDM 91</div>
            <div className="text-gray-600 text-sm">C00091</div>
            <span className="bg-emerald-700 text-white text-xs px-3 py-[2px] rounded flex items-center justify-center mt-2 w-[110px] mx-auto">
              12 Enrollments
            </span>
            <div className="flex justify-center gap-1 mt-2 flex-wrap">
              <span className="bg-emerald-600 text-white text-xs px-2 py-[2px] rounded flex items-center gap-1">
                <FaForward className="text-[10px]" /> 31-May-25
              </span>
              <span className="bg-red-600 text-white text-xs px-2 py-[2px] rounded flex items-center gap-1">
                <FaBackward className="text-[10px]" /> 30-Nov-25
              </span>
            </div>
            <div className="flex justify-center gap-2 mt-3">
              <Link href="/staff/courses/detail">
                <button className="border px-4 py-1.5 rounded text-sm">
                  Detail
                </button>
              </Link>
              <button className="bg-red-600 text-white px-4 py-1.5 rounded text-sm">
                Delete
              </button>
            </div>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          </div>
        </div>
      </main>

      {/* Add Course Modal */}
      {showAddCourse && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-[9998]"
            onClick={() => setShowAddCourse(false)}
          />
          <div className="fixed inset-0 flex items-start justify-center pt-16 z-[9999] px-4">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setShowAddCourse(false)}
                className="absolute top-4 right-4 text-gray-600"
              >
                <FaTimes />
              </button>
              <AddCourses onClose={() => setShowAddCourse(false)} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Courses;
