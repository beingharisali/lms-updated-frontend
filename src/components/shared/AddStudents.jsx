"use client";
import { useState } from "react";
import { useEffect } from "react";
import ProtectedRoute from "../ProtectedRoute";
import Adminsidebar from "../Adminsidebar";
import AdminHeader from "../AdminHeader";
import { Eye, EyeOff, RotateCcw } from "lucide-react";
import http from "@/services/http";

const AddStudents = () => {
  const [studentId, setStudentId] = useState(
    "STD" + Math.floor(100 + Math.random() * 900)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    password: "",
    cnicBForm: "",
    address: "",
    parentGuardian: {
      name: "",
      phone: "",
    },
    courses: {
      selectedCourse: "",
      csr: "",
      totalFees: 0,
      numberOfInstallments: 1,
      feePerInstallment: 0,
      amountPaid: 0,
      enrolledDate: new Date().toISOString().split("T")[0],
      SubmitFee: "",
      customPaymentMethod: "", // ✅ new field
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phoneNumber: "",
    },
  });

  // Helper to set nested values in state
  const setNestedValue = (obj, path, value) => {
    const parts = path.split(".");
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
  };

  // Updated handleInputChange to support deep nesting with dots
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      setNestedValue(newData, name, value);
      return newData;
    });
  };

  // Load courses from backend
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function loadCourses() {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/v1/courses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal,
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();

        const list = Array.isArray(data) ? data : data.courses || [];
        const mapped = list.map((c) => ({
          _id: c._id || c.id,
          name: c.name || c.courseName || c.title,
          totalFees: c.totalFees || 0,
        }));

        setCourses(mapped);
      } catch (err) {
        if (err.name !== "AbortError")
          setError(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
    return () => controller.abort();
  }, []);

  const [files, setFiles] = useState({
    photo: null,
    studentCnicBForm: null,
    parentCnic: null,
    medicalRecords: null,
    additionalDocuments: null,
  });

  const [fileStatus, setFileStatus] = useState({
    photo: "No file chosen",
    studentCnicBForm: "No file chosen",
    parentCnic: "No file chosen",
    medicalRecords: "No file chosen",
    additionalDocuments: "No file chosen",
  });

  const generateID = () => {
    const id = "STD" + Math.floor(100 + Math.random() * 900);
    setStudentId(id);
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    setFiles((prev) => ({ ...prev, [fileType]: file }));
    const fileName = file?.name || "No file chosen";
    setFileStatus((prev) => ({
      ...prev,
      [fileType]: fileName,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    if (formData.password.length < 6) {
      setMessage({
        text: "Password must be at least 6 characters long",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = new FormData();

      submitData.append("studentId", studentId);
      submitData.append("fullName", formData.fullName);
      submitData.append("dateOfBirth", formData.dateOfBirth);
      submitData.append("gender", formData.gender);
      submitData.append("phone", formData.phone);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      submitData.append("cnicBForm", formData.cnicBForm);
      submitData.append("address", formData.address);
      submitData.append("parentGuardian[name]", formData.parentGuardian.name);
      submitData.append("parentGuardian[phone]", formData.parentGuardian.phone);
      submitData.append("courses[csr]", formData.courses.csr);
      submitData.append("courses[SubmitFee]", formData.courses.SubmitFee);
      submitData.append(
        "courses[customPaymentMethod]",
        formData.courses.customPaymentMethod
      );
      submitData.append(
        "courses[selectedCourse]",
        formData.courses.selectedCourse
      );
      submitData.append(
        "courses[totalFees]",
        formData.courses.totalFees.toString()
      );
      submitData.append(
        "courses[numberOfInstallments]",
        formData.courses.numberOfInstallments.toString()
      );
      submitData.append(
        "courses[feePerInstallment]",
        formData.courses.feePerInstallment.toString()
      );
      submitData.append(
        "courses[amountPaid]",
        formData.courses.amountPaid.toString()
      );
      submitData.append("courses[enrolledDate]", formData.courses.enrolledDate);
      submitData.append(
        "emergencyContact[name]",
        formData.emergencyContact.name
      );
      submitData.append(
        "emergencyContact[relationship]",
        formData.emergencyContact.relationship
      );
      submitData.append(
        "emergencyContact[phoneNumber]",
        formData.emergencyContact.phoneNumber
      );

      Object.entries(files).forEach(([key, file]) => {
        if (file) submitData.append(key, file);
      });

      const response = await http.post("/students", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (![200, 201].includes(response.status)) {
        throw new Error(response.data.message || "Failed to create student");
      }

      setMessage({ text: "Student created successfully!", type: "success" });

      setFormData((prev) => ({
        ...prev,
        fullName: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        email: "",
        password: "",
        cnicBForm: "",
        address: "",
        parentGuardian: { name: "", phone: "" },
        courses: {
          selectedCourse: "",
          csr: "",
          totalFees: 0,
          numberOfInstallments: 1,
          feePerInstallment: 0,
          amountPaid: 0,
          enrolledDate: new Date().toISOString().split("T")[0],
          SubmitFee: "",
        },
        emergencyContact: { name: "", relationship: "", phoneNumber: "" },
      }));

      setFiles({
        photo: null,
        studentCnicBForm: null,
        parentCnic: null,
        medicalRecords: null,
        additionalDocuments: null,
      });

      setFileStatus({
        photo: "No file chosen",
        studentCnicBForm: "No file chosen",
        parentCnic: "No file chosen",
        medicalRecords: "No file chosen",
        additionalDocuments: "No file chosen",
      });

      setShowPassword(false);
      generateID();
    } catch (error) {
      console.error("Error creating student:", error);
      setMessage({
        text: error.message || "Failed to create student. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex-1 md:mt-8 mt-24 overflow-y-auto px-6">
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

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
              <span className="text-gray-400 text-3xl">?</span>
            </div>

            <label className="block font-medium text-gray-700">
              Upload Student Photo
            </label>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm w-full mx-auto">
              <label className="px-4 py-2.5 text-white bg-[#202938] hover:bg-[#353a40] hover:text-white cursor-pointer transition-colors duration-200 border-r border-gray-300">
                Choose file
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "photo")}
                  accept="image/*"
                />
              </label>
              <div className="px-4 py-2.5 text-gray-400 overflow-hidden">
                <span>{fileStatus.photo}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              SVG, PNG, JPG or GIF (MAX. 800x400px) & Max Size:1MB.
            </p>
          </div>

          <div className="grid mb-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Student ID*
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="studentId"
                  value={studentId}
                  readOnly
                  className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
                />
                <button
                  type="button"
                  onClick={generateID}
                  className="ml-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-md shadow-sm transition-colors duration-150"
                >
                  <RotateCcw className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Parent/Guardian Name
              </label>
              <input
                type="text"
                name="parentGuardian.name"
                placeholder="Parent/Guardian Name"
                value={formData.parentGuardian.name}
                onChange={handleInputChange}
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Gender*
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none text-gray-700"
              >
                <option value="" className="text-gray-400">
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Phone*
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
                onKeyDown={(e) => {
                  const allowedKeys = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "Tab",
                  ];
                  if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, "");
                }}
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Email*
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Password*
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password (min 6 characters)"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500">Minimum 6 characters</p>
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                CNIC/BForm (without dashes)*
              </label>
              <input
                type="text"
                name="cnicBForm"
                placeholder="3520160941677"
                value={formData.cnicBForm}
                onChange={handleInputChange}
                required
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
                maxLength="13"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, "");
                }}
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Parent/Guardian Phone
              </label>
              <input
                type="tel"
                name="parentGuardian.phone"
                placeholder="Phone"
                value={formData.parentGuardian.phone}
                onChange={handleInputChange}
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
                onKeyDown={(e) => {
                  const allowedKeys = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "Tab",
                  ];
                  if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, "");
                }}
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Address
              </label>
              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none min-h-[100px]"
              ></textarea>
            </div>
          </div>

          <div className="text-white font-semibold bg-[#353a40] rounded-lg px-4 text-center shadow-sm">
            Course
          </div>

          <div className="grid mb-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Select Course*
              </label>

              {loading ? (
                <div>Loading courses...</div>
              ) : error ? (
                <div className="text-red-500 text-sm">Error: {error}</div>
              ) : (
                <select
                  name="courses.selectedCourse"
                  value={formData.courses.selectedCourse}
                  onChange={(e) => {
                    handleInputChange(e);
                    const selectedCourse = courses.find(
                      (c) => c.name === e.target.value
                    );
                    if (selectedCourse) {
                      setFormData((prev) => ({
                        ...prev,
                        courses: {
                          ...prev.courses,
                          totalFees: selectedCourse.totalFees,
                        },
                      }));
                    }
                  }}
                  required
                  className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Total Fees*
              </label>
              <input
                type="number"
                name="courses.totalFees"
                value={formData.courses.totalFees}
                onChange={handleInputChange}
                required
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                No of Installment*
              </label>
              <input
                type="number"
                name="courses.numberOfInstallments"
                value={formData.courses.numberOfInstallments}
                onChange={handleInputChange}
                required
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Fee per Installment
              </label>
              <input
                type="number"
                name="courses.feePerInstallment"
                placeholder="Fee per installment"
                value={formData.courses.feePerInstallment}
                onChange={handleInputChange}
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Amount Paid
              </label>
              <input
                type="number"
                name="courses.amountPaid"
                placeholder="Amount paid"
                value={formData.courses.amountPaid}
                onChange={handleInputChange}
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Enrolled Date
              </label>
              <input
                type="date"
                name="courses.enrolledDate"
                value={formData.courses.enrolledDate}
                onChange={handleInputChange}
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none cursor-pointer"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">CSR</label>
              <input
                type="text"
                name="courses.csr"
                value={formData.courses.csr}
                onChange={handleInputChange}
                required
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none cursor-pointer"
              ></input>
            </div>

            <div className="flex-3">
              <label className="text-sm font-medium text-gray-500">
                Payment Method
              </label>
              <select
                name="courses.SubmitFee"
                placeholder="Select Type"
                value={formData.courses.SubmitFee}
                onChange={handleInputChange}
                required
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="Jazz Cash">Jazz Cash</option>
                <option value="Custom">Add Custom Payment Method</option>
              </select>
            </div>

            {/* ✅ Input appears side-by-side when "Custom" is selected */}
            {formData.courses.SubmitFee === "Custom" && (
              <div className="flex-2">
                <label className="text-sm font-medium text-gray-500">
                  Custom Method
                </label>
                <input
                  type="text"
                  name="courses.customPaymentMethod"
                  value={formData.courses.customPaymentMethod || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., Bank Transfer"
                  className="w-full border border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
                  required
                />
              </div>
            )}
          </div>

          <div className="rounded-lg bg-gray-50 p-4 shadow-sm mt-6">
            <h3 className="font-semibold text-gray-700 mb-2">Fee Guidelines</h3>
            <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
              <li>The fee installment is the key factor</li>
              <li>
                Installments are calculated as (total fees - down payment)
              </li>
              <li>
                The due date for each installment is from one month from the
                previous installment
              </li>
            </ul>
          </div>

          <div className="text-white font-semibold bg-[#353a40] rounded-lg px-4 text-center shadow-sm mt-6">
            Emergency Contact Form
          </div>
          <div className="grid mb-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">Name</label>
              <input
                type="text"
                name="emergencyContact.name"
                placeholder=""
                value={formData.emergencyContact.name}
                onChange={handleInputChange}
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Relationship
              </label>
              <input
                type="text"
                name="emergencyContact.relationship"
                placeholder="-"
                value={formData.emergencyContact.relationship}
                onChange={handleInputChange}
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Phone Number
              </label>
              <input
                type="text"
                name="emergencyContact.phoneNumber"
                placeholder="-"
                value={formData.emergencyContact.phoneNumber}
                onChange={handleInputChange}
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
                onKeyDown={(e) => {
                  const allowedKeys = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "Tab",
                  ];
                  if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, "");
                }}
              />
            </div>
          </div>

          <div className="text-white font-semibold bg-[#353a40] rounded-lg px-4 text-center shadow-sm mt-6">
            Related Documents
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Student CNIC/B-Form
              </label>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <label className="px-4 py-2.5 text-white bg-[#202938] hover:bg-[#353a40] hover:text-white cursor-pointer transition-colors duration-200 border-r border-gray-300">
                  Choose file
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "studentCnicBForm")}
                  />
                </label>
                <div className="flex-1 px-4 py-2.5 text-gray-400 overflow-hidden">
                  <span>{fileStatus.studentCnicBForm}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">Max Size:1MB.</p>
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Parent CNIC
              </label>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <label className="px-4 py-2.5 text-white bg-[#202938] hover:bg-[#353a40] hover:text-white cursor-pointer transition-colors duration-200 border-r border-gray-300">
                  Choose file
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "parentCnic")}
                  />
                </label>
                <div className="flex-1 px-4 py-2.5 text-gray-400 overflow-hidden">
                  <span>{fileStatus.parentCnic}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">Max Size:1MB.</p>
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Medical Records
              </label>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <label className="px-4 py-2.5 text-white bg-[#202938] hover:bg-[#353a40] hover:text-white cursor-pointer transition-colors duration-200 border-r border-gray-300">
                  Choose file
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "medicalRecords")}
                  />
                </label>
                <div className="flex-1 px-4 py-2.5 text-gray-400 overflow-hidden">
                  <span>{fileStatus.medicalRecords}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">Max Size:1MB.</p>
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Additional Documents
              </label>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <label className="px-4 py-2.5 text-white bg-[#202938] hover:bg-[#353a40] hover:text-white cursor-pointer transition-colors duration-200 border-r border-gray-300">
                  Choose file
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const selectedFiles = Array.from(e.target.files || []);
                      const fileName =
                        selectedFiles.length > 0
                          ? selectedFiles.length === 1
                            ? selectedFiles[0].name
                            : `${selectedFiles.length} files selected`
                          : "No file chosen";

                      setFileStatus((prev) => ({
                        ...prev,
                        additionalDocuments: fileName,
                      }));

                      setFiles((prev) => ({
                        ...prev,
                        additionalDocuments: e.target.files[0],
                      }));
                    }}
                  />
                </label>
                <div className="flex-1 px-4 py-2.5 text-gray-400 overflow-hidden">
                  <span>{fileStatus.additionalDocuments}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">Max Size:1MB.</p>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#067954] text-white font-semibold cursor-pointer my-4 w-full px-6 py-2.5 rounded-xl transition-all duration-300 hover:bg-[#353a40] flex items-center justify-center gap-3 shadow-md hover:shadow-lg active:scale-[98%] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="tracking-wide">Processing...</span>
              ) : (
                <span className="tracking-wide">Save</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default function ProtectedAddStudents() {
  return (
    <ProtectedRoute allowedRoles={["admin", "staff"]}>
      <AddStudents />
    </ProtectedRoute>
  );
}
