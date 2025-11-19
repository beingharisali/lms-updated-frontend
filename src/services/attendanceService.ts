// src/services/attendanceService.ts

export async function fetchCourseAttendance(courseId: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) throw new Error("Authentication token not found. Please login.");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${courseId}/students-attendance`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Failed to fetch students' attendance.");
  }

  return res.json();
}
