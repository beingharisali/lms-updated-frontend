"use client";

import { useState, useEffect } from "react";
import Adminsidebar from "@/components/Adminsidebar";
import Header from "@/components/Header";
import { Edit3, Save, X } from "lucide-react";

const FeeDetail = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("selectedStudent");
    if (data) setFormData(JSON.parse(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Updated Data:", formData);
    setIsEditing(false);
  };

  if (!formData) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <Adminsidebar />
        <div className="flex-1 flex flex-col overflow-x-auto p-8">
          <Header  />
          <p className="mt-10 text-center text-gray-500 text-lg font-medium">
            No student selected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-slate-100 to-slate-200">
      <Adminsidebar />

      <div className="flex-1 flex flex-col overflow-x-auto">
        <Header   />

        <main className="p-6 md:p-10 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
            <h1 className="text-2xl font-semibold text-gray-800">
              Fee Detail — <span className="text-blue-600">{formData.name}</span>
            </h1>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 font-medium ${
                isEditing
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
              }`}
            >
              {isEditing ? (
                <>
                  <X size={18} /> Cancel
                </>
              ) : (
                <>
                  <Edit3 size={18} /> Edit Fee
                </>
              )}
            </button>
          </div>

          <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-6 md:p-8 border border-slate-200 transition-all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Student Name", name: "name", type: "text" },
                { label: "Total Fees", name: "totalFees", type: "number" },
                { label: "Fee Paid", name: "feePaid", type: "number" },
                { label: "Fee Remaining", name: "feeRemaining", type: "number" },
                { label: "Due Date", name: "dueDate", type: "text" },
                { label: "Contact No.", name: "contact", type: "text" },
                { label: "Course", name: "course", type: "text" },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full rounded-lg border px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition ${
                      isEditing
                        ? "bg-white"
                        : "bg-gray-100 border-gray-200 cursor-not-allowed"
                    }`}
                  />
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition shadow-md"
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeeDetail;
