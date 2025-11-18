import { useState, useEffect } from "react";
import {
  getVisitors,
  createVisitor,
  updateVisitor,
  deleteVisitor,
} from "../../../services/visitor.api";
import { Visitor } from "../../../types/visitors";

export function useVisitor() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVisitors();
  }, []);

  async function loadVisitors() {
    setLoading(true);
    try {
      const data = await getVisitors();
      setVisitors(data);
    } finally {
      setLoading(false);
    }
  }

  async function addVisitor(member: Partial<Visitor>) {
    const newMember = await createVisitor(member);
    setVisitors((prev) => [...prev, newMember]);
  }

  async function editVisitor(id: string, member: Partial<Visitor>) {
    const updated = await updateVisitor(id, member);
    setVisitors((prev) =>
      prev.map((s) => (s._id === id ? { ...s, ...updated } : s))
    );
  }

  async function removeVisitor(id: string) {
    await deleteVisitor(id);
    setVisitors((prev) => prev.filter((s) => s._id !== id));
  }

  return {
    visitors,
    loading,
    addVisitor,
    editVisitor,
    removeVisitor,
    loadVisitors,
  };
}
