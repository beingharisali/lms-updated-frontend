// src/features/courses/services/courseService.ts
import http from "@/services/http";
import { Course, Instructor, CourseStats } from "../types/courseTypes";

export const courseService = {
  async getAll(filters: Record<string, any> = {}) {
    const params = new URLSearchParams(filters).toString();
    const res = await http.get(`/courses?${params}`);
    return res.data.courses as Course[];
  },

  async getById(id: string) {
    const res = await http.get(`/courses/${id}`);
    return res.data.course as Course;
  },

  async create(formData: FormData) {
    const res = await http.post("/courses", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async update(id: string, formData: FormData) {
    const res = await http.patch(`/courses/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async remove(id: string) {
    const res = await http.delete(`/courses/${id}`);
    return res.data;
  },

  async getStats() {
    const res = await http.get("/courses/stats");
    return res.data.statistics as CourseStats;
  },

  async getMyCoursesAsTeacher() {
    const res = await http.get("/courses/my-courses");
    return res.data.courses as Course[];
  },

  async getInstructorsList() {
    const res = await http.get("/teachers/instructors-list");
    return res.data.instructors as Instructor[];
  },
};
