"use client";
import { Staff } from "../../../types/staff";
import { deleteStaff } from "../../../services/staff.api";

interface Props {
  staff: Staff;
  onClose: () => void;
}

export function DeleteStaffModal({ staff, onClose }: Props) {
  async function handleDelete() {
    try {
      await deleteStaff(staff._id);
      onClose();
    } catch (err) {
      console.error("Failed to delete staff", err);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Delete Staff</h2>
        <p>
          Are you sure you want to delete {staff.firstName} {staff.lastName}?
        </p>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
