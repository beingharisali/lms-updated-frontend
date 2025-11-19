
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchCourseAttendance } from "@/services/attendanceService";

interface StudentAttendance {
  srNo: number;
  name: string;
  contact: string;
  attendance: Record<string, string>;
}

interface AttendanceResponse {
  lectures: string[];
  students: {
    name: string;
    contact: string;
    attendance: Record<string, string>;
  }[];
}

export default function CourseStudentsPage() {
  const { courseId } = useParams();
  const router = useRouter();

  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [lectures, setLectures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setLoading(true);
        setError("");

        const data: AttendanceResponse = await fetchCourseAttendance(String(courseId));

        setLectures(data.lectures || []);

        const mappedStudents = data.students.map((s, index) => ({
          srNo: index + 1,
          name: s.name,
          contact: s.contact,
          attendance: s.attendance || {},
        }));

        setStudents(mappedStudents);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) loadAttendance();
  }, [courseId]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        <p>{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => router.push("/instructor/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course ID: {courseId}</h1>

        <button
          onClick={() => router.push("/instructor/dashboard")}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Back
        </button>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-blue-100 sticky top-0">
            <tr>
              <th className="px-3 py-2 font-medium text-gray-700">SR#</th>
              <th className="px-3 py-2 font-medium text-gray-700">Name</th>
              <th className="px-3 py-2 font-medium text-gray-700">Contact</th>

              {lectures.map((lec) => (
                <th
                  key={lec}
                  className="px-3 py-2 font-medium text-gray-700 text-center whitespace-nowrap"
                >
                  {lec}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((s) => (
              <tr key={s.srNo}>
                <td className="px-3 py-2">{s.srNo}</td>
                <td className="px-3 py-2">{s.name}</td>
                <td className="px-3 py-2">{s.contact}</td>

                {lectures.map((lec) => (
                  <td key={lec} className="px-3 py-2 text-center">
                    {s.attendance[lec] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
