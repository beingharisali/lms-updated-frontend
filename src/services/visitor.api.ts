import http from "./http";
import { Visitor } from "@/types/visitors";

// ========== CRUD APIs for Visitor ==========
export async function getVisitors(): Promise<Visitor[]> {
  const res = await http.get("/visitors");
  return res.data.visitors;
}

export async function fetchVisitorById(id: string): Promise<Visitor> {
  const res = await http.get(`/visitors/${id}`);
  return res.data;
}

export async function createVisitor(data: Partial<Visitor>): Promise<Visitor> {
  const res = await http.post("/visitors", data);
  return res.data;
}

export async function updateVisitor(
  id: string,
  data: Partial<Visitor>
): Promise<Visitor> {
  try {
    const res = await http.patch(`/visitors/${id}`, data);
    return res.data;
  } catch {
    const res = await http.put(`/visitors/${id}`, data);
    return res.data;
  }
}

export async function deleteVisitor(id: string): Promise<void> {
  await http.delete(`/visitors/${id}`);
}
