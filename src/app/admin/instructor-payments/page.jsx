"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";
import Adminsidebar from "../../../components/Adminsidebar";
import Header from "@/components/TeacherHeader";

export default function InstructorPaymentSheet() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    instructor: "",
    batchName: "",
    batchNo: "",
    paymentType: "",
    cost: "",
    total: "",
    paid: "",
    balance: "",
    previousDue: "",
    lecture1: "",
    lecture2: "",
    lecture3: "",
    lecture4: "",
    lecture5: "",
    lecture6: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [records, setRecords] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isEmpty = Object.values(formData).some((val) => val === "");
    if (isEmpty) {
      setError(true);
      setSubmitted(false);
    } else {
      setError(false);
      setSubmitted(true);

      // Add the new record to the records array
      const newRecord = {
        id: Date.now(),
        instructor: formData.instructor,
        batchName: formData.batchName,
        batchNo: formData.batchNo,
        paymentType: formData.paymentType,
        status: "Paid", // Default status
        created: new Date().toLocaleDateString(),
      };

      setRecords([...records, newRecord]);

      setTimeout(() => {
        setShowModal(false);
        setSubmitted(false);
        setFormData({
          instructor: "",
          batchName: "",
          batchNo: "",
          paymentType: "",
          cost: "",
          total: "",
          paid: "",
          balance: "",
          previousDue: "",
          lecture1: "",
          lecture2: "",
          lecture3: "",
          lecture4: "",
          lecture5: "",
          lecture6: "",
        });
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#eff6f9]">
      <Adminsidebar />
      <div className="flex flex-col flex-1 overflow-x-hidden">
        {/* Sticky Header */}
       
        <Header/>

        <main className="p-2 sm:p-4 md:p-6 mt-22">
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Search by Instructor Name or Batch Name"
                className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <button className="px-2 sm:px-3 py-2 bg-white border border-gray-300 rounded-md text-sm cursor-pointer">
                ⟳
              </button>
            </div>
            <div className="flex gap-2">
              <select className="flex-1 sm:flex-none px-2 py-2 bg-white border border-gray-300 rounded-md text-sm cursor-pointer">
                <option>All</option>
              </select>
              <button
                className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm whitespace-nowrap cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                ＋ Add
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-md shadow text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-2 text-left text-xs sm:text-sm">SR#</th>
                  <th className="p-2 text-left text-xs sm:text-sm">
                    INSTRUCTOR
                  </th>
                  <th className="p-2 text-left text-xs sm:text-sm">BATCH</th>
                  <th className="p-2 text-left text-xs sm:text-sm">
                    BATCH NO.
                  </th>
                  <th className="p-2 text-left text-xs sm:text-sm">TYPE</th>
                  <th className="p-2 text-left text-xs sm:text-sm">STATUS</th>
                  <th className="p-2 text-left text-xs sm:text-sm">CREATED</th>
                  <th className="p-2 text-left text-xs sm:text-sm">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-4 text-gray-600 text-sm"
                    >
                      No Record Found
                    </td>
                  </tr>
                ) : (
                  records.map((record, index) => (
                    <tr
                      key={record.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-2 text-xs sm:text-sm">{index + 1}</td>
                      <td className="p-2 text-xs sm:text-sm">
                        {record.instructor}
                      </td>
                      <td className="p-2 text-xs sm:text-sm">
                        {record.batchName}
                      </td>
                      <td className="p-2 text-xs sm:text-sm">
                        {record.batchNo}
                      </td>
                      <td className="p-2 text-xs sm:text-sm">
                        {record.paymentType}
                      </td>
                      <td className="p-2 text-xs sm:text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          {record.status}
                        </span>
                      </td>
                      <td className="p-2 text-xs sm:text-sm">
                        {record.created}
                      </td>
                      <td className="p-2 text-xs sm:text-sm">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl overflow-hidden">
            <div className="text-gray-600 border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Add Instructor Batch Payment Record
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Instructor <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleChange}
                      placeholder="Choose an Instructor"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm bg-[#f9fafc]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Batch Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="batchName"
                      value={formData.batchName}
                      onChange={handleChange}
                      placeholder="Enter Batch Name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm bg-[#f9fafc]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Batch Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="batchNo"
                      value={formData.batchNo}
                      onChange={handleChange}
                      placeholder="Enter batch number"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm bg-[#f9fafc]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Payment Type{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="paymentType"
                      value={formData.paymentType}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm bg-[#f9fafc]"
                    >
                      <option value="">Choose Payment Type</option>
                      <option value="Hourly">Hourly</option>
                      <option value="Per Lecture">Per Lecture</option>
                      <option value="Fixed">Fixed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    ["cost", "Per Lecture Cost *", "Enter per lecture cost"],
                    [
                      "total",
                      "Total Dues *",
                      "Auto Calculated. Can't be manually edit",
                    ],
                    ["paid", "Paid *", "Enter per lecture cost"],
                    ["balance", "Balance *", "Enter remaining balance"],
                  ].map(([name, label, placeholder]) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label.split("*")[0]}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm bg-[#f9fafc]"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Previous Due <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="previousDue"
                    value={formData.previousDue}
                    onChange={handleChange}
                    placeholder="Enter any previous Dues (if any)"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm bg-[#f9fafc]"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm text-center font-semibold text-gray-700 mb-3">
                    Lecture Payment Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <div key={num}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lecture {num} Details{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name={`lecture${num}`}
                          value={formData[`lecture${num}`]}
                          onChange={handleChange}
                          placeholder={`Lecture ${num} Details`}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm bg-[#f9fafc]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remarks Section */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Remarks
                  </h3>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm bg-[#f9fafc] min-h-[100px]"
                    placeholder="Any remarks, for this payment record"
                  />
                </div>

                <div className="pt-4">
                  {error && (
                    <p className="text-red-600 text-sm font-medium">
                      All fields are required.
                    </p>
                  )}
                  {submitted && (
                    <div className="flex items-center text-green-600 font-medium gap-2 text-sm">
                      <FaCheckCircle /> Your submission is successful.
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border cursor-pointer border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
