import http from "./http";
import { Teacher } from "../types/teacher";

// ========== CRUD APIs for Teacher ==========
export async function getTeacher(): Promise<Teacher[]> {
  const res = await http.get("/teachers");
  return res.data.teachers;
}

export async function fetchTeacherById(id: string): Promise<Teacher> {
  const res = await http.get(`/teachers/${id}`);
  return res.data;
}

export async function createTeacher(data: Partial<Teacher>): Promise<Teacher> {
  const res = await http.post("/teachers", data);
  return res.data;
}

export async function updateTeacher(
  id: string,
  data: Partial<Teacher>
): Promise<Teacher> {
  try {
    const res = await http.patch(`/teachers/${id}`, data);
    return res.data;
  } catch {
    const res = await http.put(`/teachers/${id}`, data);
    return res.data;
  }
}

export async function deleteTeacher(id: string): Promise<void> {
  await http.delete(`/teachers/${id}`);
}
