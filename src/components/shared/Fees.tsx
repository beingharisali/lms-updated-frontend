"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Download,
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FaMicrophone } from "react-icons/fa";
import Adminsidebar from "../../components/Adminsidebar";
import Header from "@/components/Header";
import { useStudent } from "@/features/students/hooks/useStudent";

export default function Fees() {
  const router = useRouter();
  const { students, loading, loadStudents } = useStudent();

  const [searchQuery, setSearchQuery] = useState("");
  const [sorting, setSorting] = useState("Newest");
  const [recordsToShow, setRecordsToShow] = useState("4");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    loadStudents();
    setCurrentTime(
      new Date().toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    );
  }, []);

  const isOverdue = (dueDate: string | undefined) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  // --- Transform student data into fee table records ---
  const reportData = students.map((student: any) => {
    const course = student?.courses || {};
    const totalFees = Number(course.totalFees) || 0;
    const paid = Number(course.amountPaid) || 0;
    const remaining = totalFees - paid;

    return {
      _id: student._id, // ✅ real MongoDB ID
      id: student.studentId || "N/A", // optional human ID if you still want to show it
      name: `${student.fullName || ""}`.trim(),
      totalFees,
      feePaid: paid,
      feeRemaining: remaining,
      dueDate: course.dueDate || course.enrolledDate || "N/A",
      contact: student.phone || student.parentGuardian?.phone || "N/A",
      course: course.selectedCourse || "N/A",
      installments: course.numberOfInstallments || "N/A",
      feePerInstallment: course.feePerInstallment || "N/A",
      isCompleted: remaining <= 0,
    };
  });

  // --- Filter and Sort ---
  const filteredData = reportData.filter((item) =>
    Object.values(item).some(
      (val) =>
        typeof val === "string" &&
        val.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sorting === "Highest Due") return b.feeRemaining - a.feeRemaining;
    if (sorting === "Lowest Due") return a.feeRemaining - b.feeRemaining;
    return 0;
  });

  const itemsPerPage =
    recordsToShow === "all" ? sortedData.length : parseInt(recordsToShow);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#e6effa] to-[#f9fbfd]">
      <Adminsidebar />
      <div className="flex-1 flex flex-col overflow-x-auto">
        <Header/>

        <main className="p-6 md:ml-4 space-y-6">
          {/* --- Action Buttons --- */}
          <div className="flex justify-between items-center">
            <button className="flex items-center gap-2 px-5 py-2 bg-white hover:bg-gray-100 transition-all rounded-xl shadow-sm text-sm font-medium border border-gray-200">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Aging Report</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow text-sm font-medium transition-all">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>

          {/* --- Filters --- */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white shadow-sm p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-sm font-semibold text-gray-600">
                Display:
              </span>
              <select
                value={recordsToShow}
                onChange={(e) => {
                  setCurrentPage(1);
                  setRecordsToShow(e.target.value);
                }}
                className="p-2 border border-gray-300 rounded-lg text-sm bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="4">4</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="all">All</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-sm font-semibold text-gray-600">Sort:</span>
              <select
                value={sorting}
                onChange={(e) => setSorting(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg text-sm bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option>Newest</option>
                <option>Oldest</option>
                <option>Highest Due</option>
                <option>Lowest Due</option>
              </select>
            </div>

            <div className="text-xs sm:text-sm text-gray-500 italic ml-auto">
              Updated: {currentTime}
            </div>
          </div>

          {/* --- Search --- */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search student fees..."
              value={searchQuery}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchQuery(e.target.value);
              }}
              className="w-full bg-white pl-10 pr-12 py-3 rounded-2xl shadow-sm text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none border border-gray-200 transition-all"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 cursor-pointer transition-all">
              <FaMicrophone />
            </span>
          </div>

          {/* --- Table --- */}
          <div className="overflow-x-auto rounded-2xl shadow-lg bg-white border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-blue-100 border-b border-gray-200">
                <tr className="text-left text-gray-700">
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Total Fees</th>
                  <th className="px-4 py-3 font-semibold">Paid</th>
                  <th className="px-4 py-3 font-semibold">Remaining</th>
                  <th className="px-4 py-3 font-semibold">Due / Status</th>
                  <th className="px-4 py-3 font-semibold">Installments</th>
                  <th className="px-4 py-3 font-semibold">Per Installment</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Course</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="text-center py-6 text-gray-500">
                      Loading student fee data...
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-6 text-gray-500">
                      No student fee records found.
                    </td>
                  </tr>
                ) : (
                  currentData.map((item) => {
                    const overdue = isOverdue(item.dueDate);
                    let dateColor = "text-gray-600";

                    if (item.isCompleted)
                      dateColor = "text-green-600 font-semibold";
                    else if (overdue) dateColor = "text-red-600 font-semibold";
                    else dateColor = "text-yellow-600 font-semibold";

                    return (
                      <tr
                        key={item._id}
                        onClick={() => {
                          localStorage.setItem(
                            "selectedStudent",
                            JSON.stringify({
                              id: item._id,
                              name: item.name,
                              totalFees: item.totalFees,
                              feePaid: item.feePaid,
                              feeRemaining: item.feeRemaining,
                              dueDate: item.dueDate,
                              contact: item.contact,
                              course: item.course,
                              installments: item.installments,
                              perInstallment: item.feePerInstallment, // ✅ renamed to match FeeDetail
                              status: item.isCompleted ? "Active" : "Inactive",
                            })
                          );

                          router.push(`/admin/fees/${item._id}`);
                        }}
                        className="hover:bg-blue-50 cursor-pointer transition-all border-b border-gray-100"
                      >
                        <td className="px-4 py-3 font-medium text-gray-700">
                          {item.id}
                        </td>
                        <td className="px-4 py-3 text-gray-800">{item.name}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {item.totalFees.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {item.feePaid.toLocaleString()}
                        </td>
                        <td
                          className={`px-4 py-3 font-semibold ${
                            item.feeRemaining > 0
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          {item.feeRemaining.toLocaleString()}
                        </td>

                        {/* DUE DATE with dynamic color */}
                        <td className={`px-4 py-3 ${dateColor}`}>
                          {item.dueDate !== "N/A"
                            ? new Date(item.dueDate).toLocaleDateString()
                            : "N/A"}
                        </td>

                        <td className="px-4 py-3 text-gray-700">
                          {item.installments}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {item.feePerInstallment}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {item.contact}
                        </td>
                        <td className="px-4 py-3 text-gray-800 font-medium">
                          {item.course}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* --- Pagination --- */}
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 pt-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
