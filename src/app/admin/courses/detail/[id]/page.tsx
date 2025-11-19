"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Bell, Edit, Save, X } from "lucide-react";
import Adminsidebar from "@/components/Adminsidebar";
import AdminHeader from "@/components/AdminHeader";
import { useCourse } from "@/features/courses/hooks/useCourse";
import ProtectedRoute from "@/components/ProtectedRoute";

function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getCourse, editCourse, getInstructorsList, loading } = useCourse();
  const [course, setCourse] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(true);

  const [formData, setFormData] = useState({
    courseName: "",
    duration: "",
    noOfStudentsEnrolled: "",
    certifiedStudents: "",
    freezedStudents: "",
    totalLectures: "",
    lecturesDelivered: "",
    phoneNumber: "",
    description: "",
    status: "Active",
    instructorName: "",
    instructorEmail: "",
  });

  const calculateProgress = () => {
    const lecturesDelivered = parseInt(formData.lecturesDelivered) || 0;
    const totalLectures = parseInt(formData.totalLectures) || 0;
    const certifiedStudents = parseInt(formData.certifiedStudents) || 0;
    const enrolledStudents = parseInt(formData.noOfStudentsEnrolled) || 0;

    const lectureProgress =
      totalLectures > 0
        ? ((lecturesDelivered / totalLectures) * 100).toFixed(2)
        : "0";
    const certificationRate =
      enrolledStudents > 0
        ? ((certifiedStudents / enrolledStudents) * 100).toFixed(2)
        : "0";

    return { lectureProgress, certificationRate };
  };

  const { lectureProgress, certificationRate } = calculateProgress();

  useEffect(() => {
    if (params.id) {
      loadCourseDetail();
    }
  }, [params.id]);

  const loadCourseDetail = async () => {
    try {
      const courseData = await getCourse(params.id as string);
      setCourse(courseData);
      setFormData({
        courseName: courseData.courseName || "",
        duration: courseData.duration || "",
        noOfStudentsEnrolled:
          courseData.noOfStudentsEnrolled?.toString() || "0",
        certifiedStudents: courseData.certifiedStudents?.toString() || "0",
        freezedStudents: courseData.freezedStudents?.toString() || "0",
        totalLectures: courseData.totalLectures?.toString() || "0",
        lecturesDelivered: courseData.lecturesDelivered?.toString() || "0",
        phoneNumber: courseData.phoneNumber || "",
        description: courseData.description || "",
        status: courseData.status || "Active",
        instructorName: courseData.instructor
          ? `${courseData.instructor.firstName} ${courseData.instructor.lastName}`
          : courseData.instructorName || "",
        instructorEmail:
          courseData.instructor?.email || courseData.instructorEmail || "",
      });
      await loadInstructors();
    } catch (error) {
      console.error("Failed to load course:", error);
      alert("Failed to load course details");
      router.push("/admin/courses");
    }
  };

  const loadInstructors = async () => {
    try {
      setLoadingInstructors(true);
      const data = await getInstructorsList();
      setInstructors(data || []);
    } catch (error) {
      console.error("Error loading instructors:", error);
    } finally {
      setLoadingInstructors(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "instructorEmail") {
      const selectedInstructor = instructors.find(
        (inst) => inst.email === value
      );
      if (selectedInstructor) {
        setFormData((prev) => ({
          ...prev,
          instructorName:
            selectedInstructor.fullDisplay ||
            `${selectedInstructor.firstName} ${selectedInstructor.lastName}`,
        }));
      }
    }

    if (name === "instructorName") {
      const selectedInstructor = instructors.find(
        (inst) =>
          inst.fullDisplay === value ||
          `${inst.firstName} ${inst.lastName}` === value
      );
      if (selectedInstructor) {
        setFormData((prev) => ({
          ...prev,
          instructorEmail: selectedInstructor.email,
        }));
      }
    }
  };

  const handleSave = async () => {
    if (!course) return;
    setEditLoading(true);

    try {
      const certified = parseInt(formData.certifiedStudents);
      const enrolled = parseInt(formData.noOfStudentsEnrolled);
      const freezed = parseInt(formData.freezedStudents);
      const delivered = parseInt(formData.lecturesDelivered);
      const total = parseInt(formData.totalLectures);

      if (certified > enrolled) {
        alert("Certified students cannot exceed enrolled students");
        return;
      }
      if (freezed > enrolled) {
        alert("Freezed students cannot exceed enrolled students");
        return;
      }
      if (delivered > total) {
        alert("Lectures delivered cannot exceed total lectures");
        return;
      }

      const updateData = new FormData();
      updateData.append("courseName", formData.courseName);
      updateData.append("duration", formData.duration);
      updateData.append("noOfStudentsEnrolled", formData.noOfStudentsEnrolled);
      updateData.append("certifiedStudents", formData.certifiedStudents);
      updateData.append("freezedStudents", formData.freezedStudents);
      updateData.append("totalLectures", formData.totalLectures);
      updateData.append("lecturesDelivered", formData.lecturesDelivered);
      updateData.append("phoneNumber", formData.phoneNumber);
      updateData.append("description", formData.description);
      updateData.append("status", formData.status);
      updateData.append("instructorName", formData.instructorName);
      updateData.append("instructorEmail", formData.instructorEmail);

      await editCourse(course._id, updateData);
      alert("Course updated successfully!");
      setIsEditing(false);
      await loadCourseDetail();
    } catch (error) {
      console.error("Failed to update course:", error);
      alert("Failed to update course");
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancel = () => {
    if (course) {
      setFormData({
        courseName: course.courseName || "",
        duration: course.duration || "",
        noOfStudentsEnrolled: course.noOfStudentsEnrolled?.toString() || "0",
        certifiedStudents: course.certifiedStudents?.toString() || "0",
        freezedStudents: course.freezedStudents?.toString() || "0",
        totalLectures: course.totalLectures?.toString() || "0",
        lecturesDelivered: course.lecturesDelivered?.toString() || "0",
        phoneNumber: course.phoneNumber || "",
        description: course.description || "",
        status: course.status || "Active",
        instructorName: course.instructorName || "",
        instructorEmail: course.instructorEmail || "",
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#eff6f9] items-center justify-center">
        <div className="text-gray-600">Loading course details...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen bg-[#eff6f9] items-center justify-center">
        <div className="text-gray-600">Course not found</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <main className="p-4 sm:p-6 md:mt-3 mt-22">
          <div className="mb-6 lg:mr-8">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => router.push("/admin/courses")}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                ← Back to Courses
              </button>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Edit size={16} />
                  Edit Course
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={editLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save size={16} />
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>

            {/* Course Image */}
            <div className="flex justify-center mb-6">
              {course.courseImage ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${course.courseImage}`}
                  alt={course.courseName}
                  className="w-32 h-32 sm:w-40 sm:h-40 bg-white object-cover rounded-full shadow-md"
                />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-4xl text-gray-400">
                    {course.courseName?.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-sm text-gray-800">
              {/* Course ID */}
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Course ID:
                </p>
                <p className="border-b-2 border-[#0b6ff1] text-xs sm:text-sm font-semibold">
                  {course.courseId || "-"}
                </p>
              </div>
              {/* Instructor Name Dropdown */}
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Instructor Name:
                </p>
                {isEditing ? (
                  <select
                    name="instructorName"
                    value={formData.instructorName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                  >
                    {/* Default option shows the current instructor */}
                    <option value={formData.instructorName}>
                      {loadingInstructors
                        ? "Loading instructors..."
                        : formData.instructorName ||
                          (course.instructor
                            ? `${course.instructor.firstName} ${course.instructor.lastName}`
                            : "Select Instructor")}
                    </option>

                    {instructors.map((inst) => (
                      <option
                        key={inst.id || inst._id}
                        value={
                          inst.fullDisplay ||
                          `${inst.firstName} ${inst.lastName}`
                        }
                      >
                        {inst.fullDisplay ||
                          `${inst.firstName} ${inst.lastName}`}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="border-b-2 border-[#0b6ff1] text-xs sm:text-sm font-semibold">
                    {course.instructor
                      ? `${course.instructor.firstName} ${course.instructor.lastName}`
                      : course.instructorName || "-"}
                  </p>
                )}
              </div>

              {/* Instructor Email Auto-filled */}
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Instructor Email:
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    name="instructorEmail"
                    value={formData.instructorEmail}
                    readOnly
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-gray-100"
                  />
                ) : (
                  <p className="border-b-2 border-[#0b6ff1] text-xs sm:text-sm font-semibold">
                    {course.instructor?.email || course.instructorEmail || "-"}
                  </p>
                )}
              </div>

              {/* Editable fields */}
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Course Name:
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  <p className="border-b-2 border-[#0b6ff1] text-xs sm:text-sm font-semibold">
                    {course.courseName || "-"}
                  </p>
                )}
              </div>

              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Duration:
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  <p className="border-b-2 border-[#0b6ff1] text-xs sm:text-sm font-semibold">
                    {course.duration || "-"}
                  </p>
                )}
              </div>

              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  No of Students Enrolled:
                </p>
                {isEditing ? (
                  <input
                    type="number"
                    name="noOfStudentsEnrolled"
                    value={formData.noOfStudentsEnrolled}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  <p className="border-b-2 border-[#0b6ff1] text-xs sm:text-sm font-semibold">
                    {course.noOfStudentsEnrolled || "0"}
                  </p>
                )}
              </div>

              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Lectures:
                </p>
                {isEditing ? (
                  <input
                    type="number"
                    name="totalLectures"
                    value={formData.totalLectures}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  <p className="border-b-2 border-[#0b6ff1] text-xs sm:text-sm font-semibold">
                    {course.totalLectures || "0"}
                  </p>
                )}
              </div>

              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Lectures Delivered:
                </p>
                {isEditing ? (
                  <input
                    type="number"
                    name="lecturesDelivered"
                    value={formData.lecturesDelivered}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  <p className="border-b-2 border-[#0b6ff1] text-xs sm:text-sm font-semibold">
                    {course.lecturesDelivered || "0"}
                  </p>
                )}
              </div>

              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Phone Number:
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  <p className="border-b-2 border-[#0b6ff1] text-xs sm:text-sm font-semibold">
                    {course.phoneNumber || "-"}
                  </p>
                )}
              </div>

              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Status:
                </p>
                {isEditing ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Completed">Completed</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                ) : (
                  <p className="border-b-2 border-[#0b6ff1] text-xs sm:text-sm font-semibold">
                    {course.status || "-"}
                  </p>
                )}
              </div>

              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Certified Students:
                </p>
                {isEditing ? (
                  <input
                    type="number"
                    name="certifiedStudents"
                    value={formData.certifiedStudents}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  <p className="border-b-2 border-[#0b6ff1] text-xs sm:text-sm font-semibold">
                    {course.certifiedStudents || "0"}
                  </p>
                )}
              </div>

              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Freezed Students:
                </p>
                {isEditing ? (
                  <input
                    type="number"
                    name="freezedStudents"
                    value={formData.freezedStudents}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  <p className="border-b-2 border-[#0b6ff1] text-xs sm:text-sm font-semibold">
                    {course.freezedStudents || "0"}
                  </p>
                )}
              </div>

              {/* Real-time calculated fields */}
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Lecture Progress:
                </p>
                <p
                  className={`border-b-2 border-[#0b6ff1] text-xs sm:text-sm font-semibold ${
                    isEditing ? "text-blue-600" : ""
                  }`}
                >
                  {isEditing
                    ? `${lectureProgress}%`
                    : course.lectureProgress
                    ? `${course.lectureProgress}%`
                    : "0%"}
                  {isEditing && " (Live)"}
                </p>
              </div>

              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Certification Rate:
                </p>
                <p
                  className={`border-b-2 border-[#0b6ff1] text-xs sm:text-sm font-semibold ${
                    isEditing ? "text-blue-600" : ""
                  }`}
                >
                  {isEditing
                    ? `${certificationRate}%`
                    : course.certificationRate
                    ? `${course.certificationRate}%`
                    : "0%"}
                  {isEditing && " (Live)"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-600">Description:</p>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-2"
                />
              ) : (
                <p className="text-sm text-gray-800 bg-white p-4 rounded-md shadow-sm mt-2">
                  {course.description || "No description available"}
                </p>
              )}
            </div>

            {/* Created Info */}
            <div className="mt-6 text-xs text-gray-500">
              <p>Created by: {course.createdBy?.name || "Unknown"}</p>
              <p>
                Created on:{" "}
                {course.createdAt
                  ? new Date(course.createdAt).toLocaleDateString()
                  : "Unknown"}
              </p>
              {course.updatedAt && course.updatedAt !== course.createdAt && (
                <p>
                  Last updated:{" "}
                  {new Date(course.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Action Buttons - Material, Assignment, Quiz, Resources disabled for now */}
            <div className="mt-8 sm:mt-10 flex flex-wrap justify-center sm:justify-around gap-3 sm:gap-4">
              <button
                disabled
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 bg-gray-300 text-gray-500 font-medium rounded cursor-not-allowed text-xs sm:text-sm"
              >
                📚 Material (Coming Soon)
              </button>
              <button
                disabled
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 bg-gray-300 text-gray-500 font-medium rounded cursor-not-allowed text-xs sm:text-sm"
              >
                📝 Assignment (Coming Soon)
              </button>
              <button
                disabled
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 bg-gray-300 text-gray-500 font-medium rounded cursor-not-allowed text-xs sm:text-sm"
              >
                ✏️ Quiz (Coming Soon)
              </button>
              <button
                disabled
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 bg-gray-300 text-gray-500 font-medium rounded cursor-not-allowed text-xs sm:text-sm"
              >
                📁 Resources (Coming Soon)
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default function ProtectedCourseDetailPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <CourseDetailPage />
    </ProtectedRoute>
  );
}
