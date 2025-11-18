"use client";
import { Staff } from "../../../types/staff";

interface Props {
  staff: Staff;
  onClose: () => void;
}

export function ViewStaffModal({ staff, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Staff Details</h2>
        <p>
          <strong>Name:</strong> {staff.firstName} {staff.lastName}
        </p>
        <p>
          <strong>Email:</strong> {staff.email}
        </p>
        <p>
          <strong>Staff ID:</strong> {staff.staffId}
        </p>
        <p>
          <strong>Role:</strong> {staff.role || "N/A"}
        </p>
        <p>
          <strong>Status:</strong> {staff.status || "N/A"}
        </p>
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
