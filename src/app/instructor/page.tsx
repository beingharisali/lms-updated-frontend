// // app/instructor/dashboard/page.tsx
// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import CourseCard, { Course } from "../instructor/CourseCard";
// import SearchBar from "../instructor/SearchBar";
// import { useRouter } from "next/navigation";
// import { useAuthContext } from "@/context/AuthContext";

// const MOCK_COURSES: Course[] = [
//   { id: "c68188", code: "FSWD 84", lectures: 18, enrolled: 33, otherStudents: 5, resources: 0 },
//   { id: "c23574", code: "FSWD 77", lectures: 15, enrolled: 19, otherStudents: 0, resources: 0 },
//   { id: "c24012", code: "FSWD 73", lectures: 0, enrolled: 25, otherStudents: 0, resources: 0 },
//   { id: "c26683", code: "DCSIT110", lectures: 7, enrolled: 7, otherStudents: 0, resources: 0 },
//   { id: "c47545", code: "FSWD 75", lectures: 14, enrolled: 31, otherStudents: 0, resources: 0 },
//   { id: "c53472", code: "FSWD 79", lectures: 21, enrolled: 49, otherStudents: 0, resources: 0 },
//   // add more or fetch from backend
// ];

// export default function InstructorDashboardPage() {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [query, setQuery] = useState("");
//   const router = useRouter();
//   const { user, loading } = useAuthContext();

//   // fetch courses from backend (example)
//   useEffect(() => {
//     async function load() {
//       try {
//         // uncomment and change endpoint to your real one
//         // const res = await fetch("/api/courses");
//         // const data = await res.json();
//         // setCourses(data.courses);

//         // for now use mock
//         setCourses(MOCK_COURSES);
//       } catch (e) {
//         console.error(e);
//       }
//     }
//     load();
//   }, []);

//   // optional: ensure only instructors can see this page (if not handled by layout)
//   useEffect(() => {
//     if (!loading && user && user.role !== "instructor" && user.role !== "teacher") {
//       router.replace("/unauthorized");
//     }
//   }, [user, loading]);

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return courses;
//     return courses.filter(
//       (c) =>
//         c.code.toLowerCase().includes(q) ||
//         c.id.toLowerCase().includes(q)
//     );
//   }, [courses, query]);

//   const handleSelect = (c: Course) => {
//     // navigate to course detail / attendance
//     router.push(`/instructor/courses/${c.id}`);
//   };

//   return (
//     <div className="p-8">
//       <div className="mb-6 text-sm text-gray-500">Pages / home</div>

//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-3xl font-bold text-[#1f2d4a]">Course Attendance</h1>
//         <div className="ml-4" />
//       </div>

//       <div className="mb-8">
//         <SearchBar value={query} onChange={setQuery} />
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filtered.map((course) => (
//           <CourseCard key={course.id} course={course} onSelect={handleSelect} />
//         ))}
//       </div>

//       <footer className="mt-10 py-4 text-center text-sm text-gray-600">
//         © {new Date().getFullYear()} Your Organization. All Rights Reserved.
//       </footer>
//     </div>
//   );
// }
