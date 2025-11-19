"use client";
import { useState, useEffect } from "react";
import { RotateCcw, Eye, EyeOff } from "lucide-react";
import Adminsidebar from "../../components/Adminsidebar";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import http from "@/services/http";
import AdminHeader from "../../components/AdminHeader";

const AddTeachers = () => {
  const [teacherId, setTeacherId] = useState(
    "T" + Math.floor(1000 + Math.random() * 9000)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);

  // Form state - USING YOUR ORIGINAL NESTED STRUCTURE
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    password: "",
    cnic: "",
    address: "",
    qualification: {
      degree: "",
      institute: "",
      passingYear: "",
      obtainedCGPA: "",
    },
    unassignedCourses: {
      selectedCourse: "",
      designation: "",
      dateOfJoining: new Date().toISOString().split("T")[0],
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phoneNumber: "",
    },
  });

  // File state
  const [files, setFiles] = useState({
    photo: null,
    cnicDocument: null,
    degreeDocument: null,
    cvDocument: null,
    medicalRecords: null,
    additionalDocuments: null,
  });

  // File status state
  const [fileStatus, setFileStatus] = useState({
    photo: "No file chosen",
    cnicDocument: "No file chosen",
    degreeDocument: "No file chosen",
    cvDocument: "No file chosen",
    medicalRecords: "No file chosen",
    additionalDocuments: "No file chosen",
  });

  const generateID = () => {
    const id = "T" + Math.floor(1000 + Math.random() * 9000);
    setTeacherId(id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested objects (your original logic)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else if (name.includes("[") && name.includes("]")) {
      const match = name.match(/(\w+)\[(\w+)\]/);
      if (match) {
        const [, parent, child] = match;
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

  // Reset form function
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      phone: "",
      email: "",
      password: "",
      cnic: "",
      address: "",
      qualification: {
        degree: "",
        institute: "",
        passingYear: "",
        obtainedCGPA: "",
      },
      unassignedCourses: {
        selectedCourse: "",
        designation: "",
        dateOfJoining: new Date().toISOString().split("T")[0],
      },
      emergencyContact: {
        name: "",
        relationship: "",
        phoneNumber: "",
      },
    });

    setFiles({
      photo: null,
      cnicDocument: null,
      degreeDocument: null,
      cvDocument: null,
      medicalRecords: null,
      additionalDocuments: null,
    });

    setFileStatus({
      photo: "No file chosen",
      cnicDocument: "No file chosen",
      degreeDocument: "No file chosen",
      cvDocument: "No file chosen",
      medicalRecords: "No file chosen",
      additionalDocuments: "No file chosen",
    });

    setShowPassword(false);
    generateID();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    // Validate required fields - USING NESTED STRUCTURE
    const requiredFields = [
      formData.firstName,
      formData.gender,
      formData.phone,
      formData.email,
      formData.password,
      formData.cnic,
      formData.qualification.degree,
      formData.qualification.institute,
      formData.qualification.passingYear,
      formData.qualification.obtainedCGPA,
      formData.unassignedCourses.selectedCourse,
      formData.unassignedCourses.designation,
    ];

    if (requiredFields.some((field) => !field)) {
      setMessage({
        text: "Please fill all required fields marked with *",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setMessage({
        text: "Password must be at least 6 characters long",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate CNIC length
    if (formData.cnic.length !== 13) {
      setMessage({
        text: "CNIC must be exactly 13 digits",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate phone number
    if (formData.phone.length < 10) {
      setMessage({
        text: "Phone number must be at least 10 digits",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData object
      const submitData = new FormData();

      // Add basic information
      submitData.append("teacherId", teacherId);
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      submitData.append("dateOfBirth", formData.dateOfBirth);
      submitData.append("gender", formData.gender);
      submitData.append("phone", formData.phone);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      submitData.append("cnic", formData.cnic);
      submitData.append("address", formData.address);

      // Add qualification - USING YOUR ORIGINAL NESTED FORMAT
      submitData.append("qualification[degree]", formData.qualification.degree);
      submitData.append(
        "qualification[institute]",
        formData.qualification.institute
      );
      submitData.append(
        "qualification[passingYear]",
        formData.qualification.passingYear
      );
      submitData.append(
        "qualification[obtainedCGPA]",
        formData.qualification.obtainedCGPA
      );

      // Add course assignment - USING YOUR ORIGINAL NESTED FORMAT
      submitData.append(
        "unassignedCourses[selectedCourse]",
        formData.unassignedCourses.selectedCourse
      );
      submitData.append(
        "unassignedCourses[designation]",
        formData.unassignedCourses.designation
      );
      submitData.append(
        "unassignedCourses[dateOfJoining]",
        formData.unassignedCourses.dateOfJoining
      );

      // Add emergency contact - USING YOUR ORIGINAL NESTED FORMAT
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

      // Add files
      if (files.photo) submitData.append("photo", files.photo);
      if (files.cnicDocument)
        submitData.append("cnicDocument", files.cnicDocument);
      if (files.degreeDocument)
        submitData.append("degreeDocument", files.degreeDocument);
      if (files.cvDocument) submitData.append("cvDocument", files.cvDocument);
      if (files.medicalRecords)
        submitData.append("medicalRecords", files.medicalRecords);
      if (files.additionalDocuments)
        submitData.append("additionalDocuments", files.additionalDocuments);

      // Make API request
      const response = await http.post("/teachers", submitData);

      setMessage({
        text: "Teacher created successfully!",
        type: "success",
      });

      // Reset form after successful submission
      setTimeout(() => {
        resetForm();
      }, 2000);
    } catch (error) {
      console.error("❌ Error creating teacher:", error);
      console.error("❌ Error response:", error.response?.data);

      let errorMessage = "Failed to create teacher. Please try again.";

      if (error.response?.status === 401) {
        errorMessage =
          "Authentication failed. Your session has expired. Please login again.";
        // localStorage.removeItem("token");
        // localStorage.removeItem("user");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else if (error.response?.status === 400) {
        // Show backend validation errors if available
        if (error.response?.data?.errors) {
          const backendErrors = error.response.data.errors;
          errorMessage = Object.values(backendErrors).flat().join(", ");
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = "Invalid data provided. Please check all fields.";
        }
      } else if (error.response?.status === 409) {
        errorMessage = "Teacher with this email or CNIC already exists.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setMessage({
        text: errorMessage,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Scrollable Content */}
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
          {/* Profile Photo Section */}
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
              <span className="text-gray-400 text-3xl">?</span>
            </div>

            <label className="block font-medium text-gray-700">
              Upload Teacher Photo
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

          {/* Teacher Information Section */}
          <div className="grid mb-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Teacher ID Field */}
            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Teacher ID*
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="teacherId"
                  value={teacherId}
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

            {/* First Name Field */}
            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                First Name*
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
              />
            </div>

            {/* Last Name Field */}
            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
              />
            </div>

            {/* Date of Birth Field */}
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

            {/* Gender Field */}
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

            {/* Phone Field */}
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

            {/* Email Field */}
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

            {/* Password Field */}
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

            {/* CNIC Field */}
            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                CNIC (without dashes)*
              </label>
              <input
                type="text"
                name="cnic"
                placeholder="1234567890123"
                value={formData.cnic}
                onChange={handleInputChange}
                required
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
                maxLength="13"
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

          {/* Qualification Section */}
          <div className="text-white font-semibold bg-[#353a40] rounded-lg px-4 text-center shadow-sm">
            Qualification
          </div>

          <div className="grid mb-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Degree*
              </label>
              <input
                type="text"
                name="qualification.degree"
                placeholder="Degree Name"
                value={formData.qualification.degree}
                onChange={handleInputChange}
                required
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Institute*
              </label>
              <input
                type="text"
                name="qualification.institute"
                placeholder="Institute Name"
                value={formData.qualification.institute}
                onChange={handleInputChange}
                required
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Passing Year*
              </label>
              <input
                type="text"
                name="qualification.passingYear"
                placeholder="YYYY"
                value={formData.qualification.passingYear}
                onChange={handleInputChange}
                required
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
                maxLength="4"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, "");
                }}
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Obtained CGPA*
              </label>
              <input
                type="number"
                name="qualification.obtainedCGPA"
                placeholder="CGPA"
                value={formData.qualification.obtainedCGPA}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                max="4"
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
              />
            </div>
          </div>

          {/* Unassigned Courses */}
          <div className="text-white font-semibold bg-[#353a40] rounded-lg px-4 text-center shadow-sm mt-6">
            Unassigned Courses
          </div>

          <div className="grid mb-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Select Course*
              </label>
              <input
                type="text"
                name="unassignedCourses.selectedCourse"
                placeholder="Type to Search"
                value={formData.unassignedCourses.selectedCourse}
                onChange={handleInputChange}
                required
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Designation*
              </label>
              <input
                type="text"
                name="unassignedCourses.designation"
                placeholder="-"
                value={formData.unassignedCourses.designation}
                onChange={handleInputChange}
                required
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Date of Joining*
              </label>
              <input
                type="date"
                name="unassignedCourses.dateOfJoining"
                value={formData.unassignedCourses.dateOfJoining}
                onChange={handleInputChange}
                required
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Emergency Contact Form */}
          <div className="text-white font-semibold bg-[#353a40] rounded-lg px-4 text-center shadow-sm mt-6">
            Emergency Contact Form
          </div>

          <div className="grid mb-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">Name</label>
              <input
                type="text"
                name="emergencyContact.name"
                placeholder="-"
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

          {/* Related Documents */}
          <div className="text-white font-semibold bg-[#353a40] rounded-lg px-4 text-center shadow-sm mt-6">
            Related Documents
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">CNIC</label>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <label className="px-4 py-2.5 text-white bg-[#202938] hover:bg-[#353a40] hover:text-white cursor-pointer transition-colors duration-200 border-r border-gray-300">
                  Choose file
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "cnicDocument")}
                  />
                </label>
                <div className="flex-1 px-4 py-2.5 text-gray-400 overflow-hidden">
                  <span>{fileStatus.cnicDocument}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">Max Size:1MB.</p>
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">
                Degree
              </label>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <label className="px-4 py-2.5 text-white bg-[#202938] hover:bg-[#353a40] hover:text-white cursor-pointer transition-colors duration-200 border-r border-gray-300">
                  Choose file
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "degreeDocument")}
                  />
                </label>
                <div className="flex-1 px-4 py-2.5 text-gray-400 overflow-hidden">
                  <span>{fileStatus.degreeDocument}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">Max Size:1MB.</p>
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-500">CV</label>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <label className="px-4 py-2.5 text-white bg-[#202938] hover:bg-[#353a40] hover:text-white cursor-pointer transition-colors duration-200 border-r border-gray-300">
                  Choose file
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "cvDocument")}
                  />
                </label>
                <div className="flex-1 px-4 py-2.5 text-gray-400 overflow-hidden">
                  <span>{fileStatus.cvDocument}</span>
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

            <div className="flex flex-col gap-y-2 md:col-span-2">
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

          {/* Save Button */}
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

// Export the protected version
export default function ProtectedAddTeachers() {
  return (
    <ProtectedRoute allowedRoles={["admin", "staff"]}>
      <AddTeachers />
    </ProtectedRoute>
  );
}
