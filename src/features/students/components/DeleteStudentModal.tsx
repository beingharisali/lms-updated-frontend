"use client";
import { Student } from "../../../types/student";
import { deleteStudent } from "../../../services/student.api";

interface DeleteStudentModalProps {
  student: Student;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteStudentModal({
  student,
  onClose,
  onDeleted,
}: DeleteStudentModalProps) {
  async function handleDelete() {
    try {
      await deleteStudent(student._id);
      onDeleted();
      onClose();
    } catch (err) {
      console.error("Failed to delete student", err);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold text-red-600 mb-4">Confirm Delete</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold">
            {student.firstName} {student.lastName}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
