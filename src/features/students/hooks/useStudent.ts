import { useState, useEffect } from "react";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../../../services/student.api";
import { Student } from "../../../types/student";

export function useStudent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    setLoading(true);
    try {
      const data = await getStudents();
      setStudents(data);
    } finally {
      setLoading(false);
    }
  }

  async function addStudent(member: Partial<Student>) {
    const newMember = await createStudent(member);
    setStudents((prev) => [...prev, newMember]);
  }

  async function editStudent(id: string, member: Partial<Student>) {
    const updated = await updateStudent(id, member);
    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, ...updated } : s))
    );
  }

  async function removeStudent(id: string) {
    await deleteStudent(id);
    setStudents((prev) => prev.filter((s) => s._id !== id));
  }

  async function getStudentById(id: string) {
  setLoading(true);
  try {
    const res = await fetch(`/api/students/${id}`);
    if (!res.ok) throw new Error("Failed to fetch student");
    const data = await res.json();
    return data;
  } finally {
    setLoading(false);
  }
}



  return {
    students,
    loading,
    addStudent,
    editStudent,
    removeStudent,
    loadStudents,
    getStudentById,
  };
}
