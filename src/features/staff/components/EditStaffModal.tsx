"use client";
import { useState } from "react";
import { Staff } from "../../../types/staff";
import { updateStaff } from "../../../services/staff.api";

interface Props {
  staff: Staff;
  onClose: () => void;
}

export function EditStaffModal({ staff, onClose }: Props) {
  const [firstName, setFirstName] = useState(staff.firstName);
  const [lastName, setLastName] = useState(staff.lastName);
  const [email, setEmail] = useState(staff.email);
  const [role, setRole] = useState(staff.role || "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateStaff(staff._id, { firstName, lastName, email, role });
      onClose();
    } catch (err) {
      console.error("Failed to update staff", err);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Staff</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border px-3 py-2 rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
          <input
            className="w-full border px-3 py-2 rounded"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="w-full border px-3 py-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
