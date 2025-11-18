import { useState, useEffect } from "react";
import {
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../../../services/teacher.api";
import { Teacher } from "../../../types/teacher";

export function useTeacher() {
  const [teacher, setTeacher] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTeacher();
  }, []);

  async function loadTeacher() {
    setLoading(true);
    try {
      const data = await getTeacher();
      setTeacher(data);
    } finally {
      setLoading(false);
    }
  }

  async function addTeacher(member: Partial<Teacher>) {
    const newMember = await createTeacher(member);
    setTeacher((prev) => [...prev, newMember]);
  }

  async function editTeacher(id: string, member: Partial<Teacher>) {
    const updated = await updateTeacher(id, member);
    setTeacher((prev) =>
      prev.map((s) => (s._id === id ? { ...s, ...updated } : s))
    );
  }

  async function removeTeacher(id: string) {
    await deleteTeacher(id);
    setTeacher((prev) => prev.filter((s) => s._id !== id));
  }

  return {
    teacher,
    loading,
    addTeacher,
    editTeacher,
    removeTeacher,
    loadTeacher,
  };
}
