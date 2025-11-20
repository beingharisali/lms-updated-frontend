
"use client";

import React, { useEffect, useState } from "react";
import http from "@/services/http";
import TeacherHeader from "@/components/TeacherHeader";

interface Course {
  _id: string;
  courseName: string;
  courseId: string;
}

interface Student {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
}

export default function CourseSelectionPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch all courses
  const loadCourses = async () => {
    try {
      setLoadingCourses(true);
      const res = await http.get("/courses?limit=500");
      setCourses(res.data.courses || []);
      setError("");
    } catch (err: any) {
      console.error("Failed to load courses:", err);
      setError("Failed to load courses.");
    } finally {
      setLoadingCourses(false);
    }
  };

  // 🔹 Fetch students for selected course
  const loadStudents = async (courseId: string) => {
    if (!courseId) {
      setStudents([]);
      return;
    }

    try {
      setLoadingStudents(true);
      const res = await http.get(`/api/students/course/${courseId}`);
      setStudents(res.data.students || []);
      setError("");
    } catch (err: any) {
      console.error("Failed to load students:", err);
      setError("Failed to load students.");
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    loadStudents(selectedCourseId);
  }, [selectedCourseId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherHeader pageTitle="Course Selection" breadcrumb="Courses" />

      <div className="p-6 mt-6">
        <h1 className="text-2xl font-bold mb-5">Select a Course</h1>

        {/* Course Dropdown */}
        <div className="flex items-center gap-2 mb-6">
          <label htmlFor="selectcourse">Select Course:</label>
          <select
            id="selectcourse"
            className="border px-3 py-2 rounded"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course.courseId}>
                {course.courseName} ({course.courseId})
              </option>
            ))}
          </select>
        </div>

        {/* Loading/Error */}
        {loadingCourses && <p>Loading courses...</p>}
        {loadingStudents && <p>Loading students...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Students Table */}
        {!loadingStudents && students.length > 0 && (
          <div className="overflow-x-auto border rounded-lg shadow-sm mt-4">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-blue-100 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left">#</th>
                  <th className="px-3 py-2 text-left">Full Name</th>
                  <th className="px-3 py-2 text-left">Phone</th>
                  <th className="px-3 py-2 text-left">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((s, idx) => (
                  <tr key={s._id}>
                    <td className="px-3 py-2">{idx + 1}</td>
                    <td className="px-3 py-2">{s.fullName}</td>
                    <td className="px-3 py-2">{s.phone}</td>
                    <td className="px-3 py-2">{s.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loadingStudents && selectedCourseId && students.length === 0 && !error && (
          <p>No students enrolled in this course.</p>
        )}
      </div>
    </div>
  );
}
