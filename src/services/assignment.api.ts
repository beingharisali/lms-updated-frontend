import http from "./http"; // <- your axios instance
import {
  Assignment,
  AssignmentResponse,
  AssignmentsListResponse,
} from "../types/assignment";

// ✅ Create assignment (with file upload)
export async function createAssignment(data: FormData): Promise<AssignmentResponse> {
  const res = await http.post("/assignments", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ✅ Get all assignments
export async function getAssignments(): Promise<AssignmentsListResponse> {
  const res = await http.get("/assignments");
  return res.data;
}

// ✅ Get single assignment
export async function getAssignmentById(id: string): Promise<AssignmentResponse> {
  const res = await http.get(`/assignments/${id}`);
  return res.data;
}

// ✅ Update assignment
export async function updateAssignment(
  id: string,
  data: FormData
): Promise<AssignmentResponse> {
  const res = await http.put(`/assignments/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ✅ Delete assignment
export async function deleteAssignment(id: string): Promise<{ message: string }> {
  const res = await http.delete(`/assignments/${id}`);
  return res.data;
}

