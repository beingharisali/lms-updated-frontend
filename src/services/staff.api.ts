import http from "./http";
import { Staff } from "../types/staff";

// ========== CRUD APIs for Staff ==========
export async function getStaff(): Promise<Staff[]> {
  const res = await http.get("/staff");
  return res.data.staff;
}

export async function fetchStaffById(id: string): Promise<Staff> {
  const res = await http.get(`/staff/${id}`);
  return res.data;
}

export async function createStaff(data: Partial<Staff>): Promise<Staff> {
  const res = await http.post("/staff", data);
  return res.data;
}

export async function updateStaff(
  id: string,
  data: Partial<Staff>
): Promise<Staff> {
  try {
    const res = await http.patch(`/staff/${id}`, data);
    return res.data;
  } catch {
    const res = await http.put(`/staff/${id}`, data);
    return res.data;
  }
}

export async function deleteStaff(id: string): Promise<void> {
  await http.delete(`/staff/${id}`);
}
