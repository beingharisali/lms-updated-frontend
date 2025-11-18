"use client";
import {
  FaUser,
  FaFilePdf,
  FaFileImage,
  FaFile,
  FaDownload,
  FaTimes,
} from "react-icons/fa";

interface FileType {
  url?: string;
  name?: string;
}

interface ParentGuardian {
  name?: string;
  phone?: string;
  email?: string;
  cnic?: string;
}

interface CourseInfo {
  selectedCourse?: string;
  totalFees?: number | string;
  downPayment?: number | string;
  numberOfInstallments?: number | string;
  feePerInstallment?: number | string;
  amountPaid?: number | string;
  enrolledDate?: string;
}

interface EmergencyContact {
  name?: string;
  relationship?: string;
  phoneNumber?: string;
}

export interface Student {
  _id?: string;
  studentId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  cnicBForm?: string;
  address?: string;
  status?: string;
  photo?: string | FileType;
  parentGuardian?: ParentGuardian;
  courses?: CourseInfo;
  emergencyContact?: EmergencyContact;
  studentCnicBForm?: string | FileType;
  parentCnic?: string | FileType;
  medicalRecords?: string | FileType;
  additionalDocuments?: string | FileType;
}

interface ViewStudentModalProps {
  student: Student;
  onClose: () => void;
}

export function ViewStudentModal({ student, onClose }: ViewStudentModalProps) {
  const renderFile = (file?: string | FileType, label?: string) => {
    if (!file) return null;

    const fileUrl = typeof file === "string" ? file : file.url || "";
    const fileName = typeof file === "string" ? label : file.name || label;
    const fileType = fileName?.split(".").pop()?.toLowerCase();

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

  const renderProfilePicture = (photo?: string | FileType) => {
    if (!photo) {
      return (
        <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center">
          <FaUser className="text-gray-400 text-3xl" />
        </div>
      );
    }

    const photoUrl = typeof photo === "string" ? photo : photo.url || "";

    return (
      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-gray-300">
        <img
          src={photoUrl}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = "none";
            if (target.nextSibling instanceof HTMLElement) {
              target.nextSibling.style.display = "flex";
            }
          }}
        />
        <div className="w-full h-full bg-gray-200 hidden items-center justify-center">
          <FaUser className="text-gray-400 text-2xl" />
        </div>
      </div>
    );
  };

  const InfoField = ({ label, value }: { label: string; value?: string | number }) => (
    <div>
      <p className="text-gray-600 font-medium text-sm">{label}:</p>
      <p className="text-gray-800 break-words text-sm">{value || "-"}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Student Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            {renderProfilePicture(student.photo)}
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              {student.firstName} {student.lastName}
            </h3>
            {student.studentId && (
              <p className="text-gray-600 text-sm">ID: {student.studentId}</p>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 border-b pb-2">
                Personal Information
              </h4>
              <InfoField label="Email" value={student.email} />
              <InfoField label="Phone" value={student.phone} />
              <InfoField label="Gender" value={student.gender} />
              <InfoField label="Date of Birth" value={student.dateOfBirth} />
              <InfoField label="CNIC/B-Form Number" value={student.cnicBForm} />
              <InfoField label="Address" value={student.address} />
            </div>

            {/* Parent */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 border-b pb-2">
                Parent/Guardian Information
              </h4>
              <InfoField label="Name" value={student.parentGuardian?.name} />
              <InfoField label="Phone" value={student.parentGuardian?.phone} />
              <InfoField label="Email" value={student.parentGuardian?.email} />
              <InfoField label="CNIC Number" value={student.parentGuardian?.cnic} />
            </div>

            {/* Course */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 border-b pb-2">
                Course Information
              </h4>
              <InfoField label="Course" value={student.courses?.selectedCourse} />
              <InfoField label="Total Fees" value={student.courses?.totalFees} />
              <InfoField label="Down Payment" value={student.courses?.downPayment} />
              <InfoField
                label="Installments"
                value={student.courses?.numberOfInstallments}
              />
              <InfoField
                label="Fee Per Installment"
                value={student.courses?.feePerInstallment}
              />
              <InfoField label="Amount Paid" value={student.courses?.amountPaid} />
              <InfoField
                label="Enrolled Date"
                value={student.courses?.enrolledDate}
              />
            </div>

            {/* Emergency */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 border-b pb-2">
                Emergency Contact
              </h4>
              <InfoField label="Name" value={student.emergencyContact?.name} />
              <InfoField
                label="Relationship"
                value={student.emergencyContact?.relationship}
              />
              <InfoField
                label="Phone Number"
                value={student.emergencyContact?.phoneNumber}
              />
            </div>
          </div>

          {/* Documents */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Documents</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFile(student.studentCnicBForm, "Student CNIC/B-Form")}
              {renderFile(student.parentCnic, "Parent CNIC")}
              {renderFile(student.medicalRecords, "Medical Records")}
              {renderFile(student.additionalDocuments, "Additional Documents")}
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
