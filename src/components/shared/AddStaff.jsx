"use client";
import { useState } from "react";
import { RotateCcw, Eye, EyeOff } from "lucide-react";
import Adminsidebar from "../../components/Adminsidebar";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import http from "@/services/http";
import AdminHeader from "../../components/AdminHeader";

const AddStaff = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);

  // Default authorities structure
  const defaultAuthorities = {
    students: { review: false, add: false, edit: false },
    courses: { review: false, add: false, edit: false },
    fees: { review: false, add: false, edit: false },
    instructorPayment: { review: false, add: false, edit: false },
    admissionForm: { review: false, add: false, edit: false },
    visitorForm: { review: false, add: false, edit: false },
  };

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    password: "", // ADDED PASSWORD FIELD
    cnic: "",
    address: "",
    qualification: {
      education: "",
      institute: "",
      yearOfPassing: "",
      designation: "",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phoneNumber: "",
    },
    authorities: defaultAuthorities,
  });

  // File state
  const [files, setFiles] = useState({
    cnicDocument: null,
    medicalRecords: null,
    additionalDocuments: null,
  });

  // File status state to avoid DOM manipulation
  const [fileStatus, setFileStatus] = useState({
    cnicDocument: "No file chosen",
    medicalRecords: "No file chosen",
    additionalDocuments: "No file chosen",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

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
      // Handle nested objects with bracket notation
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

  const handleAuthorityChange = (category, permission, value) => {
    setFormData((prev) => ({
      ...prev,
      authorities: {
        ...prev.authorities,
        [category]: {
          ...prev.authorities[category],
          [permission]: value,
        },
      },
    }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    setFiles((prev) => ({ ...prev, [fileType]: file }));

    // Update file status using state instead of DOM manipulation
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

    // Validate password length
    if (formData.password.length < 6) {
      setMessage({
        text: "Password must be at least 6 characters long",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData object for multipart/form-data
      const submitData = new FormData();

      // Add all form fields to FormData
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      submitData.append("dateOfBirth", formData.dateOfBirth);
      submitData.append("gender", formData.gender);
      submitData.append("phone", formData.phone);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password); // ADDED PASSWORD
      submitData.append("cnic", formData.cnic);
      submitData.append("address", formData.address);

      // Add qualification data
      submitData.append(
        "qualification[education]",
        formData.qualification.education
      );
      submitData.append(
        "qualification[institute]",
        formData.qualification.institute
      );
      submitData.append(
        "qualification[yearOfPassing]",
        formData.qualification.yearOfPassing
      );
      submitData.append(
        "qualification[designation]",
        formData.qualification.designation
      );

      // Add emergency contact data
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

      // Add authorities as JSON string
      submitData.append("authorities", JSON.stringify(formData.authorities));

      // Add files
      if (files.cnicDocument)
        submitData.append("cnicDocument", files.cnicDocument);
      if (files.medicalRecords)
        submitData.append("medicalRecords", files.medicalRecords);
      if (files.additionalDocuments)
        submitData.append("additionalDocuments", files.additionalDocuments);

      // Make API request using the http service
      const response = await http.post("/staff", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 200 && response.status !== 201) {
        const errorData = await response.data;
        throw new Error(errorData.message || "Failed to create staff member");
      }

      const result = await response.data;
      setMessage({
        text: "Staff member created successfully!",
        type: "success",
      });

      // Reset form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        email: "",
        password: "", // RESET PASSWORD
        cnic: "",
        address: "",
        qualification: {
          education: "",
          institute: "",
          yearOfPassing: "",
          designation: "",
        },
        emergencyContact: {
          name: "",
          relationship: "",
          phoneNumber: "",
        },
        authorities: defaultAuthorities,
      });

      setFiles({
        cnicDocument: null,
        medicalRecords: null,
        additionalDocuments: null,
      });

      // Reset file status using state
      setFileStatus({
        cnicDocument: "No file chosen",
        medicalRecords: "No file chosen",
        additionalDocuments: "No file chosen",
      });

      setShowPassword(false); // Hide password after submission
    } catch (error) {
      console.error("Error creating staff member:", error);
      setMessage({
        text:
          error.message || "Failed to create staff member. Please try again.",
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
          {/* Staff Information Section */}
          <div className="grid mb-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

            {/* Password Field - ADDED */}
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
                CNIC (with dashes)*
              </label>
              <input
                type="text"
                name="cnic"
                placeholder="12345-6789012-3"
                value={formData.cnic}
                onChange={handleInputChange}
                required
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
                maxLength="15"
                onInput={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 5) {
                    value = value.substring(0, 5) + "-" + value.substring(5);
                  }
                  if (value.length > 13) {
                    value = value.substring(0, 13) + "-" + value.substring(13);
                  }
                  if (value.length > 15) {
                    value = value.substring(0, 15);
                  }
                  e.target.value = value;
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
                Education*
              </label>
              <input
                type="text"
                name="qualification.education"
                placeholder="Education Level"
                value={formData.qualification.education}
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
                Year of Passing*
              </label>
              <input
                type="text"
                name="qualification.yearOfPassing"
                placeholder="YYYY"
                value={formData.qualification.yearOfPassing}
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
                Designation*
              </label>
              <input
                type="text"
                name="qualification.designation"
                placeholder="Designation/Role"
                value={formData.qualification.designation}
                onChange={handleInputChange}
                required
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-150 outline-none"
              />
            </div>
          </div>

          {/* Authorities/Permissions Section */}
          <div className="text-white font-semibold bg-[#353a40] rounded-lg px-4 text-center shadow-sm mt-6">
            Authorities & Permissions
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(formData.authorities).map(
                ([category, permissions]) => (
                  <div key={category} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-700 mb-3 capitalize">
                      {category.replace(/([A-Z])/g, " $1")}
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(permissions).map(([permission]) => (
                        <div
                          key={permission}
                          className="flex items-center justify-between"
                        >
                          <label className="text-sm text-gray-600 capitalize">
                            {permission}
                          </label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                formData.authorities[category][permission]
                              }
                              onChange={(e) =>
                                handleAuthorityChange(
                                  category,
                                  permission,
                                  e.target.checked
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
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
              <label className="text-sm font-medium text-gray-500">
                CNIC Document
              </label>
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
export default function ProtectedAddStaff() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AddStaff />
    </ProtectedRoute>
  );
}
