"use client";

import React, { useRef, useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { useCourse } from "@/features/courses/hooks/useCourse";
import { useRouter } from "next/navigation";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

interface FileInfo {
  name: string;
  size: number;
  type: string;
}

const AddCourses = ({ onClose }: { onClose?: () => void }) => {
  const courseImageRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { createCourse, getInstructorsList, loading } = useCourse();

  const [courseId, setCourseId] = useState(
    "C" + Math.floor(10000 + Math.random() * 90000)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    courseName: "",
    duration: "",
    noOfStudentsEnrolled: "0",
    certifiedStudents: "0",
    freezedStudents: "0",
    totalLectures: "",
    lecturesDelivered: "0",
    phoneNumber: "",
    instructorEmail: "",
    description: "",
    status: "Active",
  });

  // File state
  const [courseImage, setCourseImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  // Load instructors on mount
  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    setLoadingInstructors(true);
    try {
      const instructorsList = await getInstructorsList();
      setInstructors(instructorsList);
    } catch (error) {
      console.error("Failed to load instructors:", error);
      setMessage({
        text: "Failed to load instructors list",
        type: "error",
      });
    } finally {
      setLoadingInstructors(false);
    }
  };

  const generateID = () => {
    const id = "C" + Math.floor(10000 + Math.random() * 90000);
    setCourseId(id);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setMessage({ text: "Please upload a valid image file", type: "error" });
      return;
    }

    if (file.size > MAX_BYTES) {
      setMessage({ text: "Image size must be less than 5MB", type: "error" });
      return;
    }

    setCourseImage(file);
    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setCourseImage(null);
    setImagePreview("");
    setFileInfo(null);
    if (courseImageRef.current) {
      courseImageRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      // Validation
      if (!formData.instructorEmail) {
        throw new Error("Please select an instructor");
      }

      if (
        parseInt(formData.certifiedStudents) >
        parseInt(formData.noOfStudentsEnrolled)
      ) {
        throw new Error("Certified students cannot exceed enrolled students");
      }

      if (
        parseInt(formData.freezedStudents) >
        parseInt(formData.noOfStudentsEnrolled)
      ) {
        throw new Error("Freezed students cannot exceed enrolled students");
      }

      if (
        parseInt(formData.lecturesDelivered) > parseInt(formData.totalLectures)
      ) {
        throw new Error("Lectures delivered cannot exceed total lectures");
      }

      // Create FormData
      const submitData = new FormData();
      submitData.append("courseId", courseId);
      submitData.append("courseName", formData.courseName);
      submitData.append("duration", formData.duration);
      submitData.append("noOfStudentsEnrolled", formData.noOfStudentsEnrolled);
      submitData.append("certifiedStudents", formData.certifiedStudents);
      submitData.append("freezedStudents", formData.freezedStudents);
      submitData.append("totalLectures", formData.totalLectures);
      submitData.append("lecturesDelivered", formData.lecturesDelivered);
      submitData.append("phoneNumber", formData.phoneNumber);
      submitData.append("instructorEmail", formData.instructorEmail);
      submitData.append("description", formData.description);
      submitData.append("status", formData.status);

      if (courseImage) {
        submitData.append("courseImage", courseImage);
      }

      await createCourse(submitData);

      setMessage({ text: "Course created successfully!", type: "success" });

      // Reset form
      setFormData({
        courseName: "",
        duration: "",
        noOfStudentsEnrolled: "0",
        certifiedStudents: "0",
        freezedStudents: "0",
        totalLectures: "",
        lecturesDelivered: "0",
        phoneNumber: "",
        instructorEmail: "",
        description: "",
        status: "Active",
      });
      removeImage();
      generateID();

      // Redirect after 2 seconds
      setTimeout(() => {
        if (onClose) {
          onClose();
        } else {
          router.push("/admin/courses");
        }
      }, 2000);
    } catch (error: any) {
      console.error("Error creating course:", error);
      setMessage({
        text: error.message || "Failed to create course. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const readableSize = (bytes: number) => {
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-4 sm:p-6">
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

      <div className="bg-gray-900 text-white px-4 py-2 rounded flex items-center justify-center text-sm font-semibold mb-6">
        Add Course
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <div
            onClick={() => courseImageRef.current?.click()}
            className="cursor-pointer w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-green-100 to-green-50 flex items-center justify-center shadow-md border border-gray-200 overflow-hidden relative"
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Course"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 text-xs shadow"
                >
                  ✕
                </button>
              </>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Click to upload course image (Max 5MB)
          </p>
          <input
            ref={courseImageRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Course Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Course ID */}
          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-medium text-gray-500">
              Course ID*
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={courseId}
                readOnly
                className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm"
              />
              <button
                type="button"
                onClick={generateID}
                className="ml-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-md shadow-sm"
              >
                <RotateCcw className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Course Name */}
          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-medium text-gray-500">
              Course Name*
            </label>
            <input
              type="text"
              name="courseName"
              placeholder="Enter course name"
              value={formData.courseName}
              onChange={handleInputChange}
              required
              className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm"
            />
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-medium text-gray-500">
              Duration*
            </label>
            <input
              type="text"
              name="duration"
              placeholder="e.g., 6 months"
              value={formData.duration}
              onChange={handleInputChange}
              required
              className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm"
            />
          </div>

          {/* No of Students Enrolled */}
          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-medium text-gray-500">
              No of Students Enrolled
            </label>
            <input
              type="number"
              name="noOfStudentsEnrolled"
              placeholder="0"
              value={formData.noOfStudentsEnrolled}
              onChange={handleInputChange}
              min="0"
              className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm"
            />
          </div>

          {/* Total Lectures */}
          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-medium text-gray-500">
              Total Lectures*
            </label>
            <input
              type="number"
              name="totalLectures"
              placeholder="Enter total lectures"
              value={formData.totalLectures}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm"
            />
          </div>

          {/* Lectures Delivered */}
          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-medium text-gray-500">
              Lectures Delivered
            </label>
            <input
              type="number"
              name="lecturesDelivered"
              placeholder="0"
              value={formData.lecturesDelivered}
              onChange={handleInputChange}
              min="0"
              className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm"
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-medium text-gray-500">
              Phone Number*
            </label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm"
            />
          </div>

          {/* Instructor Selection - WITH SCROLLABLE DROPDOWN */}
          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-medium text-gray-500">
              Select Instructor*
            </label>
            <select
              name="instructorEmail"
              value={formData.instructorEmail}
              onChange={handleInputChange}
              required
              disabled={loadingInstructors}
              className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm max-h-40 overflow-y-auto"
            >
              <option value="">
                {loadingInstructors
                  ? "Loading instructors..."
                  : "Select Instructor"}
              </option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.email}>
                  {instructor.fullDisplay}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">
              Select the instructor for this course
            </p>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-medium text-gray-500">Status*</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Completed">Completed</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>
        </div>

        {/* Student Statistics */}
        <div className="text-white font-semibold bg-[#353a40] rounded-lg px-4 text-center shadow-sm">
          Student Statistics
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-medium text-gray-500">
              Certified Students
            </label>
            <input
              type="number"
              name="certifiedStudents"
              placeholder="0"
              value={formData.certifiedStudents}
              onChange={handleInputChange}
              min="0"
              className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-medium text-gray-500">
              Freezed Students
            </label>
            <input
              type="number"
              name="freezedStudents"
              placeholder="0"
              value={formData.freezedStudents}
              onChange={handleInputChange}
              min="0"
              className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-y-2">
          <label className="text-sm font-medium text-gray-500">
            Description*
          </label>
          <textarea
            name="description"
            placeholder="Enter course description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full border bg-white border-gray-300 rounded-md px-3.5 py-2 shadow-sm"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#067954] text-white font-semibold cursor-pointer my-4 w-full px-6 py-2.5 rounded-xl transition-all duration-300 hover:bg-[#353a40] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Course..." : "Save Course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourses;
