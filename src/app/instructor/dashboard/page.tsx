
"use client";

import React, { useEffect, useMemo, useState } from "react";
import CourseCard, { Course } from "../CourseCard/page";
import SearchBar from "../SearchBar/page";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { fetchAllInstructorCourses } from "@/services/instructorcourseService";

export default function InstructorDashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [query, setQuery] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { user, loading } = useAuthContext();

  /**  Redirect if user is not an instructor */
  useEffect(() => {
    if (!loading && user && user.role !== "instructor") {
      router.replace("/unauthorized");
    }
  }, [user, loading]);

  /**  Fetch instructor courses */
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoadingCourses(true);
        setError(null);

        const data = await fetchAllInstructorCourses();

        const mapped: Course[] = data.courses.map((c: any) => ({
          id: c.courseId,
          code: c.courseName,
          lectures: c.totalLectures,
          enrolled: c.noOfStudentsEnrolled,
          otherStudents: c.freezedStudents || 0,
          resources: 0,
        }));

        setCourses(mapped);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, []);

  /**  Filter courses based on search */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    );
  }, [query, courses]);

  /**  Open Course Details Page */
  const handleSelect = (course: Course) => {
    router.push(`/instructor/courses/${course.id}`);
  };

  return (
    <div className="p-8">

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {/* Loading State */}
      {loadingCourses && (
        <div className="text-center text-gray-500">Loading courses...</div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-red-500">{error}</div>
      )}

      {/* No Results */}
      {!loadingCourses && !error && filtered.length === 0 && (
        <div className="text-center text-gray-500">No courses found.</div>
      )}

      {/* Course Grid */}
      {!loadingCourses && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}

    </div>
  );
}
