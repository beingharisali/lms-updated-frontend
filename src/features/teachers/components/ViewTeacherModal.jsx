"use client";
import {
  FaUser,
  FaFilePdf,
  FaFileImage,
  FaFile,
  FaDownload,
  FaTimes,
} from "react-icons/fa";

export function ViewTeacherModal({ teacher, onClose }) {
  const renderFile = (file, label) => {
    if (!file) return null;

    const fileUrl = typeof file === "string" ? file : file.url || file;
    const fileName = typeof file === "string" ? label : file.name || label;
    const fileType = fileName.split(".").pop()?.toLowerCase();

    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(
      fileType || ""
    );
    const isPdf = fileType === "pdf";

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
        <div className="w-full h-full bg-gray-200 hidden items-center justify-center">
          <FaUser className="text-gray-400 text-2xl" />
        </div>
      </div>
    );
  };

  const InfoField = ({ label, value }) => (
    <div>
      <p className="text-gray-600 font-medium text-sm">{label}:</p>
      <p className="text-gray-800 break-words text-sm">{value || "-"}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Teacher Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            {renderProfilePicture(teacher.photo)}
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              {teacher.firstName} {teacher.lastName}
            </h3>
            {teacher.teacherId && (
              <p className="text-gray-600 text-sm">ID: {teacher.teacherId}</p>
            )}
            {teacher.unassignedCourses?.designation && (
              <p className="text-blue-600 text-sm font-medium">
                {teacher.unassignedCourses.designation}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 border-b pb-2">
                Personal Information
              </h4>
              <InfoField label="Email" value={teacher.email} />
              <InfoField label="Phone" value={teacher.phone} />
              <InfoField label="Gender" value={teacher.gender} />
              <InfoField label="Date of Birth" value={teacher.dateOfBirth} />
              <InfoField label="CNIC" value={teacher.cnic} />
              <InfoField label="Address" value={teacher.address} />
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 border-b pb-2">
                Qualification Information
              </h4>
              <InfoField label="Degree" value={teacher.qualification?.degree} />
              <InfoField
                label="Institute"
                value={teacher.qualification?.institute}
              />
              <InfoField
                label="Passing Year"
                value={teacher.qualification?.passingYear}
              />
              <InfoField
                label="CGPA"
                value={teacher.qualification?.obtainedCGPA}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 border-b pb-2">
                Course Information
              </h4>
              <InfoField
                label="Selected Course"
                value={teacher.unassignedCourses?.selectedCourse}
              />
              <InfoField
                label="Designation"
                value={teacher.unassignedCourses?.designation}
              />
              <InfoField
                label="Date of Joining"
                value={teacher.unassignedCourses?.dateOfJoining}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 border-b pb-2">
                Emergency Contact
              </h4>
              <InfoField label="Name" value={teacher.emergencyContact?.name} />
              <InfoField
                label="Relationship"
                value={teacher.emergencyContact?.relationship}
              />
              <InfoField
                label="Phone Number"
                value={teacher.emergencyContact?.phoneNumber}
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Documents
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFile(teacher.cnicDocument, "CNIC Document")}
              {renderFile(teacher.degreeDocument, "Degree Document")}
              {renderFile(teacher.cvDocument, "CV Document")}
              {renderFile(teacher.medicalRecords, "Medical Records")}
              {renderFile(teacher.additionalDocuments, "Additional Documents")}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
