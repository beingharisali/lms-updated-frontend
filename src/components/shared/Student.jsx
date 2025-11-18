"use client";
import { useState, useEffect } from "react";
import Adminsidebar from "../Adminsidebar";
import Header from "@/components/TeacherHeader";

import {
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaPlus,
  FaUser,
  FaBars,
  FaFilePdf,
  FaFileImage,
  FaFile,
  FaDownload,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { BsBell } from "react-icons/bs";
import DataTable from "../table/DataTable";

export default function StudentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        (student) =>
          student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("authToken") ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGFkZTk2MjRjMTMxNTM5NDFlMmZlOGMiLCJuYW1lIjoiVGFsYWwiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTYyMjc5NjIsImV4cCI6MTc1ODgxOTk2Mn0.OyCG7cd4lYkf1xMReRDojhaOD1nFRI9ricMThDhLjLY";

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/students`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();
      setStudents(data.students || []);
      setFilteredStudents(data.students || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      setMessage({
        text: "Failed to fetch students. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (student) => {
    setSelectedStudent(student);
    setModalType("view");
    setShowModal(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditFormData(student);
    setModalType("edit");
    setShowModal(true);
  };

  const handleDelete = (student) => {
    setSelectedStudent(student);
    setModalType("delete");
    setShowModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token =
        localStorage.getItem("authToken") ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGFkZTk2MjRjMTMxNTM5NDFlMmZlOGMiLCJuYW1lIjoiVGFsYWwiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTYyMjc5NjIsImV4cCI6MTc1ODgxOTk2Mn0.OyCG7cd4lYkf1xMReRDojhaOD1nFRI9ricMThDhLjLY";

      console.log("Sending data:", editFormData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/students/${selectedStudent._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFormData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);

        if (response.status === 401) {
          setMessage({
            text: "Session expired. Please login again.",
            type: "error",
          });
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
          return;
        }

        throw new Error("Failed to update student");
      }

      setMessage({ text: "Student updated successfully!", type: "success" });
      setShowModal(false);
      fetchStudents(); // Refresh the list
    } catch (error) {
      console.error("Error updating student:", error);
      setMessage({
        text: "Failed to update student. Please try again.",
        type: "error",
      });
    }
  };

  const confirmDelete = async () => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGFkZTk2MjRjMTMxNTM5NDFlMmZlOGMiLCJuYW1lIjoiVGFsYWwiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTYyMjc5NjIsImV4cCI6MTc1ODgxOTk2Mn0.OyCG7cd4lYkf1xMReRDojhaOD1nFRI9ricMThDhLjLY";

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/students/${selectedStudent._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      setMessage({ text: "Student deleted successfully!", type: "success" });
      setShowModal(false);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      setMessage({
        text: "Failed to delete student. Please try again.",
        type: "error",
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setEditFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setEditFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const renderFile = (file, label) => {
    if (!file) return null;

    const fileUrl = typeof file === "string" ? file : file.url || file;
    const fileName = typeof file === "string" ? label : file.name || label;
    const fileType = fileName.split(".").pop().toLowerCase();

    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileType);
    const isPdf = fileType === "pdf";

    const columns = ["Name", "Email", "Role"];
    const data = [
      { name: "Haris Ali", email: "haris@example.com", role: "Admin" },
      { name: "Ahmad", email: "ahmad@example.com", role: "Instructor" },
      { name: "Bilal", email: "bilal@example.com", role: "Student" },
      { name: "Sara", email: "sara@example.com", role: "Staff" },
    ];

    const handleEdit = (row) => {
      alert(`Editing ${row.name}`);
    };

    const handleDelete = (row) => {
      alert(`Deleting ${row.name}`);
    };

    return (
      <div className="mb-4">
        <p className="text-gray-600 font-medium mb-2">{label}:</p>
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
          {isImage ? (
            <FaFileImage className="text-blue-500 text-xl" />
          ) : isPdf ? (
            <FaFilePdf className="text-red-500 text-xl" />
          ) : (
            <FaFile className="text-gray-500 text-xl" />
          )}
          <span className="text-sm text-gray-700 flex-1 truncate">
            {fileName}
          </span>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
          >
            <FaDownload className="text-xs" /> View
          </a>
        </div>
      </div>
    );
  };

  const renderProfilePicture = (photo) => {
    if (!photo) {
      return (
        <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center">
          <FaUser className="text-gray-400 text-3xl" />
        </div>
      );
    }

    const photoUrl = typeof photo === "string" ? photo : photo.url || photo;

    return (
      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-gray-300">
        <img
          src={photoUrl}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div className="w-full h-full bg-gray-200  items-center justify-center hidden">
          <FaUser className="text-gray-400 text-2xl" />
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row bg-[#eff6f9]">
        <Adminsidebar />

        <div className="w-full px-5 mt-4 md:mt-0">
          <Header />

          <div className="mt-2">
            <h1 className="text-3xl font-bold text-gray-800 leading-none">
              Students
            </h1>
          </div>

          <main className="p-6">
            {message.text && (
              <div
                className={`mb-4 p-3 rounded-md ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 flex-1 max-w-md">
                  <FaSearch className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent outline-none flex-1"
                  />
                </div>
                <button
                  onClick={() =>
                    (window.location.href = "/admin/admission/addstudent")
                  }
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <FaPlus /> Add Student
                </button>
              </div>
            </div>

            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">Loading students...</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto"></div>
              </div>
            )}
          </main>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {modalType === "view" && "Student Details"}
                {modalType === "edit" && "Edit Student"}
                {modalType === "delete" && "Delete Student"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose size={24} />
              </button>
            </div>

            <div className="p-6">
              {modalType === "view" && selectedStudent && (
                <div className="space-y-6">
                  <div className="text-center">
                    {renderProfilePicture(selectedStudent.photo)}
                    <h3 className="mt-4 text-lg font-semibold">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <InfoField
                      label="Student ID"
                      value={selectedStudent.studentId}
                    />
                    <InfoField label="Email" value={selectedStudent.email} />
                    <InfoField label="Phone" value={selectedStudent.phone} />
                    <InfoField label="Gender" value={selectedStudent.gender} />
                    <InfoField
                      label="Date of Birth"
                      value={selectedStudent.dateOfBirth}
                    />
                    <InfoField
                      label="CNIC/B-Form Number"
                      value={selectedStudent.cnicBForm}
                    />
                    <InfoField
                      label="Address"
                      value={selectedStudent.address}
                    />

                    <InfoField
                      label="Parent/Guardian Name"
                      value={selectedStudent.parentGuardian?.name}
                    />
                    <InfoField
                      label="Parent Phone"
                      value={selectedStudent.parentGuardian?.phone}
                    />
                    <InfoField
                      label="Parent Email"
                      value={selectedStudent.parentGuardian?.email}
                    />
                    <InfoField
                      label="Parent CNIC Number"
                      value={selectedStudent.parentGuardian?.cnic}
                    />
                    <InfoField
                      label="Course"
                      value={selectedStudent.courses?.selectedCourse}
                    />
                    <InfoField
                      label="Total Fees"
                      value={selectedStudent.courses?.totalFees}
                    />
                    <InfoField
                      label="Down Payment"
                      value={selectedStudent.courses?.downPayment}
                    />
                    <InfoField
                      label="Number of Installments"
                      value={selectedStudent.courses?.numberOfInstallments}
                    />
                    <InfoField
                      label="Fee Per Installment"
                      value={selectedStudent.courses?.feePerInstallment}
                    />
                    <InfoField
                      label="Amount Paid"
                      value={selectedStudent.courses?.amountPaid}
                    />
                    <InfoField
                      label="Enrolled Date"
                      value={selectedStudent.courses?.enrolledDate}
                    />

                    <InfoField
                      label="Emergency Contact Name"
                      value={selectedStudent.emergencyContact?.name}
                    />
                    <InfoField
                      label="Emergency Contact Relationship"
                      value={selectedStudent.emergencyContact?.relationship}
                    />
                    <InfoField
                      label="Emergency Contact Phone"
                      value={selectedStudent.emergencyContact?.phoneNumber}
                    />
                  </div>

                  <div className="border-t pt-4 mt-6">
                    <h4 className="text-lg font-semibold mb-4">Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderFile(
                        selectedStudent.studentCnicBForm,
                        "Student CNIC/B-Form"
                      )}
                      {renderFile(selectedStudent.parentCnic, "Parent CNIC")}
                      {renderFile(
                        selectedStudent.medicalRecords,
                        "Medical Records"
                      )}
                      {renderFile(
                        selectedStudent.additionalDocuments,
                        "Additional Documents"
                      )}
                    </div>
                  </div>
                </div>
              )}

              {modalType === "edit" && selectedStudent && (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={editFormData.firstName || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={editFormData.lastName || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={editFormData.phone || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={editFormData.dateOfBirth || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={editFormData.gender || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CNIC/B-Form
                      </label>
                      <input
                        type="text"
                        name="cnicBForm"
                        value={editFormData.cnicBForm || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={editFormData.address || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={editFormData.status || "Active"}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent/Guardian Name
                      </label>
                      <input
                        type="text"
                        name="parentGuardian.name"
                        value={editFormData.parentGuardian?.name || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Phone
                      </label>
                      <input
                        type="tel"
                        name="parentGuardian.phone"
                        value={editFormData.parentGuardian?.phone || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Email
                      </label>
                      <input
                        type="email"
                        name="parentGuardian.email"
                        value={editFormData.parentGuardian?.email || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent CNIC
                      </label>
                      <input
                        type="text"
                        name="parentGuardian.cnic"
                        value={editFormData.parentGuardian?.cnic || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Selected Course
                      </label>
                      <input
                        type="text"
                        name="courses.selectedCourse"
                        value={editFormData.courses?.selectedCourse || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Fees
                      </label>
                      <input
                        type="number"
                        name="courses.totalFees"
                        value={editFormData.courses?.totalFees || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Down Payment
                      </label>
                      <input
                        type="number"
                        name="courses.downPayment"
                        value={editFormData.courses?.downPayment || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Installments
                      </label>
                      <input
                        type="number"
                        name="courses.numberOfInstallments"
                        value={editFormData.courses?.numberOfInstallments || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fee Per Installment
                      </label>
                      <input
                        type="number"
                        name="courses.feePerInstallment"
                        value={editFormData.courses?.feePerInstallment || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount Paid
                      </label>
                      <input
                        type="number"
                        name="courses.amountPaid"
                        value={editFormData.courses?.amountPaid || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Enrolled Date
                      </label>
                      <input
                        type="date"
                        name="courses.enrolledDate"
                        value={editFormData.courses?.enrolledDate || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        name="emergencyContact.name"
                        value={editFormData.emergencyContact?.name || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emergency Contact Relationship
                      </label>
                      <input
                        type="text"
                        name="emergencyContact.relationship"
                        value={
                          editFormData.emergencyContact?.relationship || ""
                        }
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emergency Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="emergencyContact.phoneNumber"
                        value={editFormData.emergencyContact?.phoneNumber || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Update Student
                    </button>
                  </div>
                </form>
              )}

              {modalType === "delete" && selectedStudent && (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <FaTrash className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Delete Student
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Are you sure you want to delete {selectedStudent.firstName}{" "}
                    {selectedStudent.lastName}? This action cannot be undone.
                  </p>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function InfoField({ label, value }) {
    return (
      <div>
        <p className="text-gray-600 font-medium">{label}:</p>
        <p className="text-gray-800 break-words">{value || "-"}</p>
      </div>
    );
  }
}
