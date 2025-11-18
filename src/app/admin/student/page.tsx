"use client";
import { useState } from "react";
import { DataTable } from "../../../components/table/DataTable";
import { useRouter } from "next/navigation";
import { Student } from "../../../types/student";
import { useStudent } from "@/features/students/hooks/useStudent";
import { UniversalModal } from "@/components/ui/Modal";
import Adminsidebar from "../../../components/Adminsidebar";
import AdminHeader from "../../../components/AdminHeader";
import SearchHeader from "@/components/ui/SearchHeader";
import { useAuth } from "@/hooks/useAuth";
import { Bell } from "lucide-react";
import UserProfile from "@/components/UserProfile";

// Extended Student type to match comprehensive modal data
type ExtendedStudent = Student & {
  gender?: string;
  dateOfBirth?: string;
  cnicBForm?: string;
  address?: string;
  status?: string;
  photo?: string | { url?: string; name?: string };
  parentGuardian?: {
    name?: string;
    phone?: string;
    email?: string;
    cnic?: string;
  };
  courses?: {
    selectedCourse?: string;
    totalFees?: number | string;
    downPayment?: number | string;
    numberOfInstallments?: number | string;
    feePerInstallment?: number | string;
    amountPaid?: number | string;
    enrolledDate?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phoneNumber?: string;
  };
  studentCnicBForm?: string | { url?: string; name?: string };
  parentCnic?: string | { url?: string; name?: string };
  medicalRecords?: string | { url?: string; name?: string };
  additionalDocuments?: string | { url?: string; name?: string };
};

export default function StudentPage() {
  const { students, loading, loadStudents, editStudent, removeStudent } =
    useStudent();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<ExtendedStudent | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(
    null
  );

  const columns = [
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "studentId", label: "Student ID" },
    { key: "status", label: "Status" },
    {
      key: "selectedCourse",
      label: "Course",
      accessor: (student: Student) =>
        (student as ExtendedStudent).courses?.selectedCourse || "N/A",
    },
  ];

  // Comprehensive field configuration matching AddStudents form exactly with ALL sections
  const studentFields = [
    // Personal Information Section
    {
      name: "studentId",
      label: "Student ID",
      type: "text" as const,
      placeholder: "Enter student ID",
      section: "Personal Information",
    },
    {
      name: "fullName",
      label: "Full Name",
      type: "text" as const,
      placeholder: "Enter first name",
      section: "Personal Information",
    },
    {
      name: "email",
      label: "Email",
      type: "email" as const,
      placeholder: "Enter email address",
      section: "Personal Information",
      readOnlyInEdit: true, // Email cannot be edited
    },
    {
      name: "phone",
      label: "Phone",
      type: "text" as const,
      placeholder: "Enter phone number",
      section: "Personal Information",
    },
    {
      name: "password",
      label: "Password",
      type: "password" as const,
      placeholder: "Enter password (min 6 characters)",
      section: "Personal Information",
      readOnlyInEdit: true, // Password cannot be edited
    },
    {
      name: "dateOfBirth",
      label: "Date of Birth",
      type: "date" as const,
      section: "Personal Information",
    },
    {
      name: "gender",
      label: "Gender",
      type: "select" as const,
      placeholder: "Select gender",
      section: "Personal Information",
      options: ["Male", "Female", "Other"],
    },
    {
      name: "cnicBForm",
      label: "CNIC/B-Form Number",
      type: "text" as const,
      placeholder: "Enter CNIC/B-Form number (without dashes)",
      section: "Personal Information",
    },
    {
      name: "address",
      label: "Address",
      type: "textarea" as const,
      placeholder: "Enter complete address",
      section: "Personal Information",
    },

    // Parent/Guardian Information Section
    {
      name: "parentGuardian.name",
      label: "Parent/Guardian Name",
      type: "text" as const,
      placeholder: "Enter parent/guardian name",
      section: "Parent/Guardian Information",
    },
    {
      name: "parentGuardian.phone",
      label: "Parent/Guardian Phone",
      type: "text" as const,
      placeholder: "Enter parent/guardian phone",
      section: "Parent/Guardian Information",
    },
    {
      name: "parentGuardian.email",
      label: "Parent/Guardian Email",
      type: "email" as const,
      placeholder: "Enter parent/guardian email",
      section: "Parent/Guardian Information",
    },
    {
      name: "parentGuardian.cnic",
      label: "Parent/Guardian CNIC",
      type: "text" as const,
      placeholder: "Enter parent/guardian CNIC",
      section: "Parent/Guardian Information",
    },

    // Course Information Section
    {
      name: "courses.selectedCourse",
      label: "Selected Course",
      type: "text" as const,
      placeholder: "Enter course name",
      section: "Course Information",
    },
    {
      name: "courses.totalFees",
      label: "Total Fees",
      type: "number" as const,
      placeholder: "Enter total fees",
      section: "Course Information",
    },
    {
      name: "courses.downPayment",
      label: "Down Payment",
      type: "number" as const,
      placeholder: "Enter down payment",
      section: "Course Information",
    },
    {
      name: "courses.numberOfInstallments",
      label: "Number of Installments",
      type: "number" as const,
      placeholder: "Enter number of installments",
      section: "Course Information",
    },
    {
      name: "courses.feePerInstallment",
      label: "Fee Per Installment",
      type: "number" as const,
      placeholder: "Enter fee per installment",
      section: "Course Information",
    },
    {
      name: "courses.amountPaid",
      label: "Amount Paid",
      type: "number" as const,
      placeholder: "Enter amount paid",
      section: "Course Information",
    },
    {
      name: "courses.enrolledDate",
      label: "Enrolled Date",
      type: "date" as const,
      section: "Course Information",
    },

    // Emergency Contact Information Section
    {
      name: "emergencyContact.name",
      label: "Emergency Contact Name",
      type: "text" as const,
      placeholder: "Enter emergency contact name",
      section: "Emergency Contact Information",
    },
    {
      name: "emergencyContact.relationship",
      label: "Emergency Contact Relationship",
      type: "text" as const,
      placeholder: "Enter relationship",
      section: "Emergency Contact Information",
    },
    {
      name: "emergencyContact.phoneNumber",
      label: "Emergency Contact Phone",
      type: "text" as const,
      placeholder: "Enter emergency contact phone",
      section: "Emergency Contact Information",
    },

    // Related Documents Section (with file uploads)
    {
      name: "photo",
      label: "Student Photo",
      type: "file" as const,
      section: "Related Documents",
      accept: "image/*",
    },
    {
      name: "studentCnicBForm",
      label: "Student CNIC/B-Form",
      type: "file" as const,
      section: "Related Documents",
      accept: ".pdf,.jpg,.jpeg,.png",
    },
    {
      name: "parentCnic",
      label: "Parent CNIC",
      type: "file" as const,
      section: "Related Documents",
      accept: ".pdf,.jpg,.jpeg,.png",
    },
    {
      name: "medicalRecords",
      label: "Medical Records",
      type: "file" as const,
      section: "Related Documents",
      accept: ".pdf,.jpg,.jpeg,.png",
    },
    {
      name: "additionalDocuments",
      label: "Additional Documents",
      type: "file" as const,
      section: "Related Documents",
      accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
    },
  ];

  const actions = [
    {
      label: "View",
      variant: "view",
      onClick: (s: Student) => {
        setSelectedStudent(s as ExtendedStudent);
        setModalType("view");
      },
    },
    {
      label: "Edit",
      variant: "edit",
      onClick: (s: Student) => {
        setSelectedStudent(s as ExtendedStudent);
        setModalType("edit");
      },
    },
    {
      label: "Delete",
      variant: "delete",
      onClick: (s: Student) => {
        setSelectedStudent(s as ExtendedStudent);
        setModalType("delete");
      },
    },
  ];

  const router = useRouter();

  // Helper function to flatten nested object for modal
  const flattenStudentData = (student: ExtendedStudent) => {
    const flattened: any = { ...student };

    // Flatten parent guardian
    if (student.parentGuardian) {
      flattened["parentGuardian.name"] = student.parentGuardian.name || "";
      flattened["parentGuardian.phone"] = student.parentGuardian.phone || "";
      flattened["parentGuardian.email"] = student.parentGuardian.email || "";
      flattened["parentGuardian.cnic"] = student.parentGuardian.cnic || "";
    }

    // Flatten courses
    if (student.courses) {
      flattened["courses.selectedCourse"] =
        student.courses.selectedCourse || "";
      flattened["courses.totalFees"] = student.courses.totalFees || "";
      flattened["courses.downPayment"] = student.courses.downPayment || "";
      flattened["courses.numberOfInstallments"] =
        student.courses.numberOfInstallments || "";
      flattened["courses.feePerInstallment"] =
        student.courses.feePerInstallment || "";
      flattened["courses.amountPaid"] = student.courses.amountPaid || "";
      flattened["courses.enrolledDate"] = student.courses.enrolledDate || "";
    }

    // Flatten emergency contact
    if (student.emergencyContact) {
      flattened["emergencyContact.name"] = student.emergencyContact.name || "";
      flattened["emergencyContact.relationship"] =
        student.emergencyContact.relationship || "";
      flattened["emergencyContact.phoneNumber"] =
        student.emergencyContact.phoneNumber || "";
    }

    // Handle document fields
    flattened["studentCnicBForm"] = student.studentCnicBForm || "";
    flattened["parentCnic"] = student.parentCnic || "";
    flattened["medicalRecords"] = student.medicalRecords || "";
    flattened["additionalDocuments"] = student.additionalDocuments || "";

    return flattened;
  };

  // Helper function to unflatten data for API call
  const unflattenStudentData = (flattenedData: any) => {
    const unflattened: any = {};

    Object.keys(flattenedData).forEach((key) => {
      if (key.includes(".")) {
        const [parent, child] = key.split(".");
        if (!unflattened[parent]) {
          unflattened[parent] = {};
        }
        unflattened[parent][child] = flattenedData[key];
      } else {
        unflattened[key] = flattenedData[key];
      }
    });

    return unflattened;
  };
 

   const auth = useAuth();
    async function logout() {
      await auth.logoutUser();
    }
  
  return (
    <div className="flex flex-col md:flex-row bg-[#eff6f9]">
      <Adminsidebar />
      <div className="w-full px-5">
         <div className="bg-transparent shadow py-2 mx-2 rounded-2xl sticky md:top-3 top-20 z-40 backdrop-blur-sm flex items-center justify-between min-w-[300px]">
                    <div>
                      <h2 className="ml-4 text-sm sm:text-base md:text-base">
                        Pages / Main Dashboard
                      </h2>
                      <h2 className="ml-4 text-lg sm:text-xl md:text-2xl text-gray-800">
                        Main Dashboard
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mr-2 sm:mr-3 md:mr-4">
                      <span className="bg-gray-200 text-gray-700 px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium shadow-sm animate-tilt-pulse">
                        Main Branch
                      </span>
                      <Bell className="text-gray-600 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
                      <button onClick={logout}>logout</button>
                      <UserProfile />
                    </div>
                  </div>
        <main className="p-6">
          <SearchHeader
            placeholder="Search students by name, email, student ID, or course..."
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            addLabel="Add Student"
            addRedirect="/admin/admission/addstudent"
            stats={[
              { label: "Total Students", count: students.length },
              {
                label: "Active",
                count: students.filter((s: any) => s.status === "Active")
                  .length,
                color: "text-green-600",
              },
              {
                label: "Inactive",
                count: students.filter((s: any) => s.status === "Inactive")
                  .length,
                color: "text-red-600",
              },
            ]}
            filterOptions={[
              { value: "", label: "All Status" },
              { value: "Active", label: "Active Students" },
              { value: "Inactive", label: "Inactive Students" },
            ]}
            sortOptions={[
              { value: "name", label: "Name" },
              { value: "date", label: "Date Added" },
              { value: "course", label: "Course" },
            ]}
          />

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <DataTable
              columns={columns}
              data={students}
              loading={loading}
              actions={actions}
              pageSize={10}
              externalSearch={searchTerm}
            />
          </div>
        </main>
      </div>

      {modalType && selectedStudent && (
        <UniversalModal
          title={`${
            modalType.charAt(0).toUpperCase() + modalType.slice(1)
          } Student`}
          mode={modalType}
          data={flattenStudentData(selectedStudent)}
          fields={studentFields}
          onClose={() => setModalType(null)}
          onSubmit={async (updated: any) => {
            const unflattenedData = unflattenStudentData(updated);

            if (modalType === "edit") {
              await editStudent(selectedStudent._id, unflattenedData);
            }
            if (modalType === "delete") {
              await removeStudent(selectedStudent._id);
            }
            loadStudents();
          }}
        />
      )}
    </div>
  );
}
