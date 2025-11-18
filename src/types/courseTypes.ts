// src/features/courses/types/courseTypes.ts

export interface Course {
  instructor: any;
  instructorName: string;
  _id: string;
  courseId: string;
  courseName: string;
  duration: string;
  noOfStudentsEnrolled: number;
  certifiedStudents: number;
  freezedStudents: number;
  totalLectures: number;
  lecturesDelivered: number;
  phoneNumber: string;
  instructorEmail: string;
  description: string;
  status: string;
  courseImage?: string;
}

export interface Instructor {
  id: string;
  email: string;
  fullDisplay: string;
}

export interface CourseStats {
  totalCourses: number;
  activeCourses: number;
  completedCourses: number;
}

export interface ApiResponse<T> {
  data: T;
  msg?: string;
}
