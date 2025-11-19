
"use client";
import React from "react";

export type Course = {
  id: string;        
  code: string;      
  lectures: number;  
  enrolled: number;  
  otherStudents: number; 
  resources: number;
};

interface CourseCardProps {
  course: Course;
  onSelect?: (c: Course) => void;
}

export default function CourseCard({ course, onSelect }: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 min-h-[180px] relative">
      <div className="absolute right-4 top-4">
        <span className="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
          {course.lectures} Lectures
        </span>
      </div>

      <h3 className="text-xl font-semibold mb-1">{course.code}</h3>
      <p className="text-sm text-gray-500 mb-4">ID: {course.id}</p>

      <div className="text-sm text-gray-700 space-y-2">
        <div className="flex justify-between">
          <span>Enrolled Students:</span>
          <span className="font-medium">{course.enrolled}</span>
        </div>
        <div className="flex justify-between">
          <span>Other Students:</span>
          <span className="font-medium">{course.otherStudents}</span>
        </div>
        <div className="flex justify-between">
          <span>Resources:</span>
          <span className="font-medium">{course.resources}</span>
        </div>
      </div>

      <div className="absolute right-4 bottom-4">
        <button
          onClick={() => onSelect?.(course)}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 text-sm"
        >
          Select
        </button>
      </div>
    </div>
  );
}
