"use client";

import { useState, useEffect } from "react";
import Adminsidebar from "@/components/Adminsidebar";
import Header from "@/components/Header";
import { Edit3, Save, X, History } from "lucide-react";
import { useStudent } from "@/features/students/hooks/useStudent";
import { useCourse } from "@/features/courses/hooks/useCourse";

interface FeeEditRecord {
  date: string;
  updatedBy: string;
  previousPaid: number;
  newPaid: number;
  previousRemaining: number;
  newRemaining: number;
}

interface StudentFeeData {
  id?: string;
  name: string;
  totalFees: number;
  feePaid: number;
  feeRemaining: number;
  dueDate: string;
  contact: string;
  course: string;
  installments?: number;
  perInstallment?: number;
  status?: "Active" | "Inactive";
  isFullyPaid?: boolean;
}

const FeeDetail = () => {
  const { editStudent } = useStudent();
  const { courses, loadCourses, loading: coursesLoading } = useCourse();
  const [updateHistory, setUpdateHistory] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentFeeData | null>(null);
  const [saving, setSaving] = useState(false);
  const [feeHistory, setFeeHistory] = useState<FeeEditRecord[]>([]);

  // const { editStudent } = useStudent();
  // const { courses, loadCourses, loading: coursesLoading } = useCourse();

  useEffect(() => {
    loadCourses();

    const data = localStorage.getItem("selectedStudent");
    if (data) {
      const parsed = JSON.parse(data);
      setFormData(parsed);

      const historyData = localStorage.getItem(`feeHistory_${parsed.id}`);
      if (historyData) setFeeHistory(JSON.parse(historyData));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!formData) return;

    let { name, value } = e.target;
    let numericValue = Number(value);

    // Copy current data
    let updatedData = { ...formData, [name]: value };

    // ✅ Automatically recalculate feeRemaining when total or paid changes
    if (name === "feePaid" || name === "totalFees") {
      const total = Number(
        name === "totalFees" ? numericValue : updatedData.totalFees
      );
      const paid = Number(
        name === "feePaid" ? numericValue : updatedData.feePaid
      );

      // 🚫 Prevent feePaid from exceeding totalFees
      if (paid > total) {
        alert("⚠️ Paid fee cannot be greater than Total Fee!");
        updatedData.feePaid = total;
        updatedData.feeRemaining = 0;
        updatedData.isFullyPaid = true; // ✅ mark as fully paid
      } else {
        updatedData.feeRemaining = Math.max(total - paid, 0);
        updatedData.isFullyPaid = paid >= total; // ✅ true if equal
      }
    }

    setFormData(updatedData);
  };

  const handleSave = async () => {
    if (!formData || !formData.id) return;
    setSaving(true);

    try {
      const updatedData = {
        ...formData,
        feeRemaining: formData.totalFees - formData.feePaid,
      };

      const previousData = JSON.parse(
        localStorage.getItem("selectedStudent") || "{}"
      );
      const newRecord: FeeEditRecord = {
        date: new Date().toLocaleString(),
        updatedBy: "Admin",
        previousPaid: previousData?.feePaid || 0,
        newPaid: updatedData.feePaid,
        previousRemaining: previousData?.feeRemaining || 0,
        newRemaining: updatedData.feeRemaining,
      };

      const historyKey = `feeHistory_${formData.id}`;
      const existingHistory =
        JSON.parse(localStorage.getItem(historyKey) || "[]") || [];
      const updatedHistory = [newRecord, ...existingHistory];

      localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
      setFeeHistory(updatedHistory);

      await editStudent(formData.id!, updatedData);
      localStorage.setItem("selectedStudent", JSON.stringify(updatedData));

      setFormData(updatedData);
      alert("✅ Fee details updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating student fee:", error);
      alert("⚠️ Failed to update student fee details.");
    } finally {
      setSaving(false);
    }
  };

  if (!formData) {
    return (
      <>
        <p className="mt-10 text-center text-gray-500 text-lg font-medium">
          No student selected.
        </p>
      </>
    );
  }

  return (
    <>
      <main className="p-6 md:p-10 mt-6 space-y-8">
        {/* ======= Summary Cards ======= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-2xl p-6 border text-center">
            <h3 className="text-sm font-semibold text-gray-500">Total Fee</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              Rs. {formData.totalFees?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6 border text-center">
            <h3 className="text-sm font-semibold text-gray-500">Paid Fee</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">
              Rs. {formData.feePaid?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6 border text-center">
            <h3 className="text-sm font-semibold text-gray-500">
              Remaining Fee
            </h3>
            <p className="text-2xl font-bold text-red-600 mt-2">
              Rs.{" "}
              {(formData.totalFees - formData.feePaid)?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {/* ======= Fee History Section (Moved Up) ======= */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <History size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Fee Edit History
            </h2>
          </div>

          {feeHistory.length === 0 ? (
            <p className="text-gray-500 italic">No edit history found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="py-2 px-4 border">Date</th>
                    <th className="py-2 px-4 border">Updated By</th>
                    <th className="py-2 px-4 border">Previous Paid</th>
                    <th className="py-2 px-4 border">New Paid</th>
                    <th className="py-2 px-4 border">Previous Remaining</th>
                    <th className="py-2 px-4 border">New Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {feeHistory.map((record, index) => (
                    <tr
                      key={index}
                      className="text-center hover:bg-gray-50 transition"
                    >
                      <td className="py-2 px-4 border">{record.date}</td>
                      <td className="py-2 px-4 border">{record.updatedBy}</td>
                      <td className="py-2 px-4 border text-red-500">
                        Rs. {record.previousPaid.toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border text-green-600">
                        Rs. {record.newPaid.toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border text-red-500">
                        Rs. {record.previousRemaining.toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border text-green-600">
                        Rs. {record.newRemaining.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ======= Editable Form (Moved to Bottom) ======= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 mt-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Fee Detail — <span className="text-blue-600">{formData.name}</span>
          </h1>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-300 ${
              isEditing
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
            }`}
            disabled={saving}
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

        <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 md:p-8 border border-slate-200 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Student Name", name: "name", type: "text" },
              { label: "Total Fees", name: "totalFees", type: "number" },
              { label: "Fee Paid", name: "feePaid", type: "number" },
              {
                label: "Fee Remaining",
                name: "feeRemaining",
                type: "number",
              },
              { label: "Due Date / Status", name: "dueDate", type: "text" },
              { label: "Installments", name: "installments", type: "number" },
              {
                label: "Per Installment",
                name: "perInstallment",
                type: "number",
              },
              { label: "Contact No.", name: "contact", type: "text" },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="text-sm font-semibold text-gray-600 mb-1">
                  {field.label}
                </label>

                <input
                  type={field.type}
                  name={field.name}
                  value={
                    typeof formData[field.name as keyof StudentFeeData] ===
                    "boolean"
                      ? ""
                      : (formData[field.name as keyof StudentFeeData] as
                          | string
                          | number) || ""
                  }
                  onChange={handleChange}
                  disabled={
                    !isEditing ||
                    (field.name === "feeRemaining" && formData.isFullyPaid)
                  }
                  className={`w-full rounded-lg border px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition ${
                    !isEditing ||
                    (field.name === "feeRemaining" && formData.isFullyPaid)
                      ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                      : "bg-white"
                  }`}
                />
              </div>
            ))}

            {/* Course Dropdown */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                Course
              </label>
              <select
                name="course"
                value={formData.course || ""}
                onChange={handleChange}
                disabled={!isEditing || coursesLoading}
                className={`w-full rounded-lg border px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition ${
                  isEditing
                    ? "bg-white"
                    : "bg-gray-100 border-gray-200 cursor-not-allowed"
                }`}
              >
                {coursesLoading ? (
                  <option>Loading courses...</option>
                ) : courses && courses.length > 0 ? (
                  <>
                    <option value="">Select a course</option>
                    {courses.map((c: any) => (
                      <option key={c._id} value={c.courseName}>
                        {c.courseName}
                      </option>
                    ))}
                  </>
                ) : (
                  <option disabled>No courses found</option>
                )}
              </select>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-5 py-2 rounded-md transition shadow-md ${
                  saving
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* 🧾 Update History Table */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Update History
          </h2>
          {updateHistory.length > 0 ? (
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left">Date & Time</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Course</th>
                  <th className="p-3 text-left">Total Fee</th>
                  <th className="p-3 text-left">Paid Fee</th>
                  <th className="p-3 text-left">Remaining</th>
                  <th className="p-3 text-left">Contact</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {updateHistory.map((item, index) => (
                  <tr key={index}>
                    <td className="p-3 text-gray-700">{item.date}</td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.course}</td>
                    <td className="p-3">{item.totalFees}</td>
                    <td className="p-3">{item.feePaid}</td>
                    <td className="p-3 text-red-600 font-semibold">
                      {item.feeRemaining}
                    </td>
                    <td className="p-3">{item.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 italic">No updates yet.</p>
          )}
        </div>
      </main>
    </>
  );
};

export default FeeDetail;
