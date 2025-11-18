import { useEffect, useState } from "react";
import {
  createAssignment,
  deleteAssignment,
  getAssignments,
  updateAssignment,
} from "@/services/assignment.api";
import { Assignment } from "@/types/assignment";

export function useAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);

  // Load all assignments
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getAssignments();
        setAssignments(res.assignments);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ Add assignment
  async function addAssignment(data: FormData) {
    const res = await createAssignment(data);
    setAssignments((prev) => [...prev, res.assignment]);
  }

  // ✅ Update assignment
  async function editAssignment(id: string, data: FormData) {
    const res = await updateAssignment(id, data);
    setAssignments((prev) =>
      prev.map((a) => (a._id === id ? res.assignment : a))
    );
  }

  // ✅ Delete assignment
  async function removeAssignment(id: string) {
    await deleteAssignment(id);
    setAssignments((prev) => prev.filter((a) => a._id !== id));
  }

  return {
    assignments,
    loading,
    addAssignment,
    editAssignment,
    removeAssignment,
  };
}
