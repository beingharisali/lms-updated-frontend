import http from "./http";
import { Student } from "../types/student";

// ========== CRUD APIs for Students ==========
export async function getStudents(): Promise<Student[]> {
  const res = await http.get("/students");
  return res.data.students;
}

export async function fetchStudentById(id: string): Promise<Student> {
  const res = await http.get(`/students/${id}`);
  return res.data;
}

export async function createStudent(data: Partial<Student>): Promise<Student> {
  const res = await http.post("/students", data);
  return res.data;
}

export async function updateStudent(
  id: string,
  data: Partial<Student>
): Promise<Student> {
  try {
    // Use PUT directly (backend doesn't support PATCH)
    const res = await http.put(`/students/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
}

export async function deleteStudent(id: string): Promise<void> {
  await http.delete(`/students/${id}`);
}

// Optional: Add a function to handle both PATCH and PUT with fallback
export async function updateStudentWithFallback(
  id: string,
  data: Partial<Student>,
  method: "patch" | "put" = "patch"
): Promise<Student> {
  try {
    if (method === "patch") {
      const res = await http.patch(`/students/${id}`, data);
      return res.data;
    } else {
      const res = await http.put(`/students/${id}`, data);
      return res.data;
    }
  } catch (error) {
    console.error(`Error with ${method.toUpperCase()} method:`, error);

    // Fallback to the other method
    const fallbackMethod = method === "patch" ? "put" : "patch";

    try {
      if (fallbackMethod === "patch") {
        const res = await http.patch(`/students/${id}`, data);
        return res.data;
      } else {
        const res = await http.put(`/students/${id}`, data);
        return res.data;
      }
    } catch (fallbackError) {
      console.error(`Fallback method also failed:`, fallbackError);
      throw fallbackError;
    }
  }
}
