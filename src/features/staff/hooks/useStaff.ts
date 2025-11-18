import { useState, useEffect } from "react";
import {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../../../services/staff.api";
import { Staff } from "../../../types/staff";

export function useStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStaff();
  }, []);

  async function loadStaff() {
    setLoading(true);
    try {
      const data = await getStaff();
      setStaff(data);
    } finally {
      setLoading(false);
    }
  }

  async function addStaff(member: Partial<Staff>) {
    const newMember = await createStaff(member);
    setStaff((prev) => [...prev, newMember]);
  }

  async function editStaff(id: string, member: Partial<Staff>) {
    const updated = await updateStaff(id, member);
    setStaff((prev) =>
      prev.map((s) => (s._id === id ? { ...s, ...updated } : s))
    );
  }

  async function removeStaff(id: string) {
    await deleteStaff(id);
    setStaff((prev) => prev.filter((s) => s._id !== id));
  }

  return {
    staff,
    loading,
    addStaff,
    editStaff,
    removeStaff,
    loadStaff,
  };
}
