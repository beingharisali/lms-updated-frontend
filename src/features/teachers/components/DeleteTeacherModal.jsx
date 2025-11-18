"use client";
import { deleteTeacher } from "../../../services/teacher.api";
import { FaTrash, FaTimes } from "react-icons/fa";
import { useState } from "react";

export function DeleteTeacherModal({ teacher, onClose }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTeacher(teacher._id);
      onClose();
    } catch (err) {
      console.error("Failed to delete teacher", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Delete Teacher
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <FaTrash className="h-6 w-6 text-red-600" />
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Confirm Deletion
          </h3>

          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete {teacher.firstName}{" "}
            {teacher.lastName}? This action cannot be undone and all associated
            data will be permanently removed.
          </p>

          <div className="flex justify-center space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Deleting..." : "Delete Teacher"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
