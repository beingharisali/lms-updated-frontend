// src/features/courses/hooks/useCourse.ts
"use client";

import { useEffect, useState } from "react";
import { courseService } from "../../../services/courseService";
import { Course, Instructor, CourseStats } from "../../../types/courseTypes";

export const useCourse = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = async (filters: Record<string, any> = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.getAll(filters);
      setCourses(data);
      return data;
    } catch (err: any) {
      console.error("Error loading courses:", err);
      setError(err.response?.data?.msg || "Failed to load courses");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  
  const getCourse = (id: string) => courseService.getById(id);

  const createCourse = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      await courseService.create(formData);
      await loadCourses();
    } catch (err: any) {
      setError(err.response?.data?.msg || "Failed to create course");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editCourse = async (id: string, formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      await courseService.update(id, formData);
      await loadCourses();
    } catch (err: any) {
      setError(err.response?.data?.msg || "Failed to update course");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeCourse = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await courseService.remove(id);
      await loadCourses();
    } catch (err: any) {
      setError(err.response?.data?.msg || "Failed to delete course");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCourseStats = () => courseService.getStats();
  const getMyCoursesAsTeacher = () => courseService.getMyCoursesAsTeacher();
  const getInstructorsList = () => courseService.getInstructorsList();

  useEffect(() => {
    loadCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    loadCourses,
    getCourse,
    createCourse,
    editCourse,
    removeCourse,
    getCourseStats,
    getMyCoursesAsTeacher,
    getInstructorsList,
  };
};
