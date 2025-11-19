// src/services/courseService.ts

export async function fetchAllInstructorCourses() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication token missing");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/courses`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Failed to fetch courses");
  }

  return res.json();
}
