"use client";
import { useState } from "react";
import { DataTable } from "../../../components/table/DataTable";
import { useRouter } from "next/navigation";
import { Staff } from "../../../types/staff";
import { Teacher } from "../../../types/teacher";
import { useStaff } from "@/features/staff/hooks/useStaff";
import { useTeacher } from "@/features/teachers/hooks/useTeacher";
import { UniversalModal } from "@/components/ui/Modal";
import Adminsidebar from "../../../components/Adminsidebar";
import AdminHeader from "../../../components/AdminHeader";
import SearchHeader from "@/components/ui/SearchHeader";

// Extended Staff type to match comprehensive modal data
type ExtendedStaff = Staff & {
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  cnic?: string;
  address?: string;
  status?: string;
  photo?: string | { url?: string; name?: string };
  qualification?: {
    education?: string;
    institute?: string;
    yearOfPassing?: string;
    designation?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phoneNumber?: string;
  };
  authorities?: {
    students?: { review?: boolean; add?: boolean; edit?: boolean };
    courses?: { review?: boolean; add?: boolean; edit?: boolean };
    fees?: { review?: boolean; add?: boolean; edit?: boolean };
    instructorPayment?: { review?: boolean; add?: boolean; edit?: boolean };
    admissionForm?: { review?: boolean; add?: boolean; edit?: boolean };
    visitorForm?: { review?: boolean; add?: boolean; edit?: boolean };
  };
};

// Extended Teacher type based on your teacher modals
type ExtendedTeacher = Teacher & {
  teacherId?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  cnic?: string;
  address?: string;
  photo?: string | { url?: string; name?: string };
  qualification?: {
    degree?: string;
    institute?: string;
    passingYear?: string;
    obtainedCGPA?: string;
  };
  unassignedCourses?: {
    selectedCourse?: string;
    designation?: string;
    dateOfJoining?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phoneNumber?: string;
  };
  cnicDocument?: string | { url?: string; name?: string };
  degreeDocument?: string | { url?: string; name?: string };
  cvDocument?: string | { url?: string; name?: string };
  medicalRecords?: string | { url?: string; name?: string };
  additionalDocuments?: string | { url?: string; name?: string };
};

// Combined type for the table
type StaffFacultyMember = (ExtendedStaff | ExtendedTeacher) & {
  type: "staff" | "teacher";
};

export default function StaffFacultyPage() {
  const {
    staff,
    loading: staffLoading,
    loadStaff,
    editStaff,
    removeStaff,
  } = useStaff();
  const {
    teacher,
    loading: teacherLoading,
    loadTeacher,
    editTeacher,
    removeTeacher,
  } = useTeacher();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] =
    useState<StaffFacultyMember | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(
    null
  );

  // Combine all staff and teacher data in one view
  const staffData = staff.map((s: any) => ({ ...s, type: "staff" as const }));
  const teacherData = teacher.map((t: any) => ({
    ...t,
    type: "teacher" as const,
  }));
  const allData = [...staffData, ...teacherData];

  const loading = staffLoading || teacherLoading;

  const columns = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    {
      key: "id",
      label: "ID",
      accessor: (member: StaffFacultyMember) =>
        member.type === "staff"
          ? (member as ExtendedStaff).staffId || "N/A"
          : (member as ExtendedTeacher).teacherId || "N/A",
    },
    {
      key: "roleOrDesignation",
      label: "Role/Designation",
      accessor: (member: StaffFacultyMember) => {
        if (member.type === "staff") {
          const staff = member as ExtendedStaff;
          return staff.qualification?.designation || staff.role || "N/A";
        } else {
          const teacher = member as ExtendedTeacher;
          return teacher.unassignedCourses?.designation || "N/A";
        }
      },
    },
    {
      key: "type",
      label: "Type",
      accessor: (member: StaffFacultyMember) =>
        member.type.charAt(0).toUpperCase() + member.type.slice(1),
    },
  ];

  // Staff fields configuration - matching your AddStaff form exactly with ALL sections
  const staffFields = [
    // Personal Information Section
    {
      name: "firstName",
      label: "First Name",
      type: "text" as const,
      placeholder: "Enter first name",
      section: "Personal Information",
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text" as const,
      placeholder: "Enter last name",
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
      name: "password", // ADDED PASSWORD FIELD
      label: "Password",
      type: "password" as const,
      placeholder: "Enter password (min 6 characters)",
      section: "Personal Information",
      readOnlyInEdit: true, // Password cannot be edited
    },
    {
      name: "staffId",
      label: "Staff ID",
      type: "text" as const,
      placeholder: "Enter staff ID",
      section: "Personal Information",
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
      name: "cnic",
      label: "CNIC",
      type: "text" as const,
      placeholder: "Enter CNIC number (with dashes)",
      section: "Personal Information",
    },
    {
      name: "address",
      label: "Address",
      type: "textarea" as const,
      placeholder: "Enter complete address",
      section: "Personal Information",
    },

    // Qualification Information Section
    {
      name: "qualification.education",
      label: "Education",
      type: "text" as const,
      placeholder: "Enter education level",
      section: "Qualification Information",
    },
    {
      name: "qualification.institute",
      label: "Institute",
      type: "text" as const,
      placeholder: "Enter institute name",
      section: "Qualification Information",
    },
    {
      name: "qualification.yearOfPassing",
      label: "Year of Passing",
      type: "text" as const,
      placeholder: "Enter passing year",
      section: "Qualification Information",
    },
    {
      name: "qualification.designation",
      label: "Designation",
      type: "text" as const,
      placeholder: "Enter designation/role",
      section: "Qualification Information",
    },

    // Authorities & Permissions Section - Individual Authority Fields with Toggles
    {
      name: "authorities.students.review",
      label: "Students - Review Permission",
      type: "toggle" as const,
      section: "Authorities & Permissions",
    },
    {
      name: "authorities.students.add",
      label: "Students - Add Permission",
      type: "toggle" as const,
      section: "Authorities & Permissions",
    },
    {
      name: "authorities.students.edit",
      label: "Students - Edit Permission",
      type: "toggle" as const,
      section: "Authorities & Permissions",
    },
    {
      name: "authorities.courses.review",
      label: "Courses - Review Permission",
      type: "toggle" as const,
      section: "Authorities & Permissions",
    },
    {
      name: "authorities.courses.add",
      label: "Courses - Add Permission",
      type: "toggle" as const,
      section: "Authorities & Permissions",
    },
    {
      name: "authorities.courses.edit",
      label: "Courses - Edit Permission",
      type: "toggle" as const,
      section: "Authorities & Permissions",
    },
    {
      name: "authorities.fees.review",
      label: "Fees - Review Permission",
      type: "toggle" as const,
      section: "Authorities & Permissions",
    },
    {
      name: "authorities.fees.add",
      label: "Fees - Add Permission",
      type: "toggle" as const,
      section: "Authorities & Permissions",
    },
    {
      name: "authorities.fees.edit",
      label: "Fees - Edit Permission",
      type: "toggle" as const,
      section: "Authorities & Permissions",
    },
    {
      name: "authorities.instructorPayment.review",
      label: "Instructor Payment - Review Permission",
      type: "toggle" as const,
      section: "Authorities & Permissions",
    },
    {
      name: "authorities.instructorPayment.add",
      label: "Instructor Payment - Add Permission",
      type: "toggle" as const,
      section: "Authorities & Permissions",
    },
    {
      name: "authorities.instructorPayment.edit",
      label: "Instructor Payment - Edit Permission",
      type: "toggle" as const,
      section: "Authorities & Permissions",
    },
    {
      name: "authorities.admissionForm.review",
      label: "Admission Form - Review Permission",
      type: "toggle" as const,
      section: "Authorities & Permissions",
    },
    {
      name: "authorities.admissionForm.add",
      label: "Admission Form - Add Permission",
      type: "toggle" as const,
      section: "Authorities & Permissions",
    },
    {
      name: "authorities.admissionForm.edit",
      label: "Admission Form - Edit Permission",
      type: "toggle" as const,
      section: "Authorities & Permissions",
    },
    {
      name: "authorities.visitorForm.review",
      label: "Visitor Form - Review Permission",
      type: "toggle" as const,
      section: "Authorities & Permissions",
    },
    {
      name: "authorities.visitorForm.add",
      label: "Visitor Form - Add Permission",
      type: "toggle" as const,
      section: "Authorities & Permissions",
    },
    {
      name: "authorities.visitorForm.edit",
      label: "Visitor Form - Edit Permission",
      type: "toggle" as const,
      section: "Authorities & Permissions",
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

    // Document Information Section (with file uploads)
    {
      name: "photo",
      label: "Profile Photo",
      type: "file" as const,
      section: "Document Information",
      accept: "image/*",
    },
    {
      name: "cnicDocument",
      label: "CNIC Document",
      type: "file" as const,
      section: "Document Information",
      accept: ".pdf,.jpg,.jpeg,.png",
    },
    {
      name: "medicalRecords",
      label: "Medical Records",
      type: "file" as const,
      section: "Document Information",
      accept: ".pdf,.jpg,.jpeg,.png",
    },
    {
      name: "additionalDocuments",
      label: "Additional Documents",
      type: "file" as const,
      section: "Document Information",
      accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
    },
  ];

  // Teacher fields configuration - matching your AddTeacher form exactly with ALL sections
  const teacherFields = [
    // Personal Information Section
    {
      name: "teacherId",
      label: "Teacher ID",
      type: "text" as const,
      placeholder: "Enter teacher ID",
      section: "Personal Information",
    },
    {
      name: "firstName",
      label: "First Name",
      type: "text" as const,
      placeholder: "Enter first name",
      section: "Personal Information",
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text" as const,
      placeholder: "Enter last name",
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
      name: "password", // ADDED PASSWORD FIELD
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
      name: "cnic",
      label: "CNIC",
      type: "text" as const,
      placeholder: "Enter CNIC number (without dashes)",
      section: "Personal Information",
    },
    {
      name: "address",
      label: "Address",
      type: "textarea" as const,
      placeholder: "Enter complete address",
      section: "Personal Information",
    },

    // Qualification Information Section
    {
      name: "qualification.degree",
      label: "Degree",
      type: "text" as const,
      placeholder: "Enter degree",
      section: "Qualification Information",
    },
    {
      name: "qualification.institute",
      label: "Institute",
      type: "text" as const,
      placeholder: "Enter institute name",
      section: "Qualification Information",
    },
    {
      name: "qualification.passingYear",
      label: "Passing Year",
      type: "text" as const,
      placeholder: "Enter passing year",
      section: "Qualification Information",
    },
    {
      name: "qualification.obtainedCGPA",
      label: "Obtained CGPA",
      type: "number" as const,
      placeholder: "Enter CGPA",
      section: "Qualification Information",
    },

    // Unassigned Courses Section
    {
      name: "unassignedCourses.selectedCourse",
      label: "Selected Course",
      type: "text" as const,
      placeholder: "Enter course name",
      section: "Unassigned Courses",
    },
    {
      name: "unassignedCourses.designation",
      label: "Designation",
      type: "text" as const,
      placeholder: "Enter designation",
      section: "Unassigned Courses",
    },
    {
      name: "unassignedCourses.dateOfJoining",
      label: "Date of Joining",
      type: "date" as const,
      section: "Unassigned Courses",
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
      label: "Profile Photo",
      type: "file" as const,
      section: "Related Documents",
      accept: "image/*",
    },
    {
      name: "cnicDocument",
      label: "CNIC Document",
      type: "file" as const,
      section: "Related Documents",
      accept: ".pdf,.jpg,.jpeg,.png",
    },
    {
      name: "degreeDocument",
      label: "Degree Document",
      type: "file" as const,
      section: "Related Documents",
      accept: ".pdf,.jpg,.jpeg,.png",
    },
    {
      name: "cvDocument",
      label: "CV Document",
      type: "file" as const,
      section: "Related Documents",
      accept: ".pdf,.doc,.docx",
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
      onClick: (member: StaffFacultyMember) => {
        setSelectedMember(member);
        setModalType("view");
      },
    },
    {
      label: "Edit",
      variant: "edit",
      onClick: (member: StaffFacultyMember) => {
        setSelectedMember(member);
        setModalType("edit");
      },
    },
    {
      label: "Delete",
      variant: "delete",
      onClick: (member: StaffFacultyMember) => {
        setSelectedMember(member);
        setModalType("delete");
      },
    },
  ];

  const router = useRouter();

  // Helper function to flatten nested object for modal
  const flattenMemberData = (member: StaffFacultyMember) => {
    const flattened: any = { ...member };

    if (member.type === "staff") {
      const staff = member as ExtendedStaff;

      // Flatten qualification for staff (education, institute, yearOfPassing, designation)
      if (staff.qualification) {
        flattened["qualification.education"] =
          staff.qualification.education || "";
        flattened["qualification.institute"] =
          staff.qualification.institute || "";
        flattened["qualification.yearOfPassing"] =
          staff.qualification.yearOfPassing || "";
        flattened["qualification.designation"] =
          staff.qualification.designation || "";
      }

      // Flatten authorities for staff - ALL permissions
      if (staff.authorities) {
        // Students permissions
        if (staff.authorities.students) {
          flattened["authorities.students.review"] =
            staff.authorities.students.review || false;
          flattened["authorities.students.add"] =
            staff.authorities.students.add || false;
          flattened["authorities.students.edit"] =
            staff.authorities.students.edit || false;
        }
        // Courses permissions
        if (staff.authorities.courses) {
          flattened["authorities.courses.review"] =
            staff.authorities.courses.review || false;
          flattened["authorities.courses.add"] =
            staff.authorities.courses.add || false;
          flattened["authorities.courses.edit"] =
            staff.authorities.courses.edit || false;
        }
        // Fees permissions
        if (staff.authorities.fees) {
          flattened["authorities.fees.review"] =
            staff.authorities.fees.review || false;
          flattened["authorities.fees.add"] =
            staff.authorities.fees.add || false;
          flattened["authorities.fees.edit"] =
            staff.authorities.fees.edit || false;
        }
        // Instructor Payment permissions
        if (staff.authorities.instructorPayment) {
          flattened["authorities.instructorPayment.review"] =
            staff.authorities.instructorPayment.review || false;
          flattened["authorities.instructorPayment.add"] =
            staff.authorities.instructorPayment.add || false;
          flattened["authorities.instructorPayment.edit"] =
            staff.authorities.instructorPayment.edit || false;
        }
        // Admission Form permissions
        if (staff.authorities.admissionForm) {
          flattened["authorities.admissionForm.review"] =
            staff.authorities.admissionForm.review || false;
          flattened["authorities.admissionForm.add"] =
            staff.authorities.admissionForm.add || false;
          flattened["authorities.admissionForm.edit"] =
            staff.authorities.admissionForm.edit || false;
        }
        // Visitor Form permissions
        if (staff.authorities.visitorForm) {
          flattened["authorities.visitorForm.review"] =
            staff.authorities.visitorForm.review || false;
          flattened["authorities.visitorForm.add"] =
            staff.authorities.visitorForm.add || false;
          flattened["authorities.visitorForm.edit"] =
            staff.authorities.visitorForm.edit || false;
        }
      }

      // Flatten emergency contact for staff
      if (staff.emergencyContact) {
        flattened["emergencyContact.name"] = staff.emergencyContact.name || "";
        flattened["emergencyContact.relationship"] =
          staff.emergencyContact.relationship || "";
        flattened["emergencyContact.phoneNumber"] =
          staff.emergencyContact.phoneNumber || "";
      }
    }

    if (member.type === "teacher") {
      const teacher = member as ExtendedTeacher;

      // Flatten qualification for teacher (degree, institute, passingYear, obtainedCGPA)
      if (teacher.qualification) {
        flattened["qualification.degree"] = teacher.qualification.degree || "";
        flattened["qualification.institute"] =
          teacher.qualification.institute || "";
        flattened["qualification.passingYear"] =
          teacher.qualification.passingYear || "";
        flattened["qualification.obtainedCGPA"] =
          teacher.qualification.obtainedCGPA || "";
      }

      // Flatten unassigned courses for teacher
      if (teacher.unassignedCourses) {
        flattened["unassignedCourses.selectedCourse"] =
          teacher.unassignedCourses.selectedCourse || "";
        flattened["unassignedCourses.designation"] =
          teacher.unassignedCourses.designation || "";
        flattened["unassignedCourses.dateOfJoining"] =
          teacher.unassignedCourses.dateOfJoining || "";
      }

      // Flatten emergency contact for teacher
      if (teacher.emergencyContact) {
        flattened["emergencyContact.name"] =
          teacher.emergencyContact.name || "";
        flattened["emergencyContact.relationship"] =
          teacher.emergencyContact.relationship || "";
        flattened["emergencyContact.phoneNumber"] =
          teacher.emergencyContact.phoneNumber || "";
      }

      // Handle document fields
      flattened["cnicDocument"] = teacher.cnicDocument || "";
      flattened["degreeDocument"] = teacher.degreeDocument || "";
      flattened["cvDocument"] = teacher.cvDocument || "";
      flattened["medicalRecords"] = teacher.medicalRecords || "";
      flattened["additionalDocuments"] = teacher.additionalDocuments || "";
    }

    return flattened;
  };

  // Helper function to unflatten data for API call
  const unflattenMemberData = (flattenedData: any) => {
    const unflattened: any = {};

    Object.keys(flattenedData).forEach((key) => {
      if (key.includes(".")) {
        const parts = key.split(".");
        if (parts.length === 2) {
          const [parent, child] = parts;
          if (!unflattened[parent]) {
            unflattened[parent] = {};
          }
          // Handle boolean conversion for authorities
          if (
            parent === "authorities" &&
            (flattenedData[key] === "true" || flattenedData[key] === "false")
          ) {
            unflattened[parent][child] = flattenedData[key] === "true";
          } else {
            unflattened[parent][child] = flattenedData[key];
          }
        } else if (parts.length === 3) {
          // Handle nested authorities (e.g., authorities.students.review)
          const [grandparent, parent, child] = parts;
          if (!unflattened[grandparent]) {
            unflattened[grandparent] = {};
          }
          if (!unflattened[grandparent][parent]) {
            unflattened[grandparent][parent] = {};
          }
          // Convert string boolean to actual boolean for authorities
          if (typeof flattenedData[key] === "boolean") {
            unflattened[grandparent][parent][child] = flattenedData[key];
          } else if (
            flattenedData[key] === "true" ||
            flattenedData[key] === "false"
          ) {
            unflattened[grandparent][parent][child] =
              flattenedData[key] === "true";
          } else {
            unflattened[grandparent][parent][child] = flattenedData[key];
          }
        }
      } else {
        unflattened[key] = flattenedData[key];
      }
    });

    return unflattened;
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#eff6f9]">
      <Adminsidebar />
      <div className="w-full px-5">
        <AdminHeader
          breadcrumb="Super Admin / Staff & Faculty"
          title="Staff & Faculty Management"
        />
        <main className="p-6">
          <SearchHeader
            placeholder="Search staff & faculty by name, email, or ID..."
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            addLabel="Add Staff"
            addRedirect="/admin/admission/addstaff"
            stats={[
              { label: "Total", count: allData.length },
              { label: "Staff", count: staff.length, color: "text-blue-600" },
              {
                label: "Teachers",
                count: teacher.length,
                color: "text-green-600",
              },
            ]}
            filterOptions={[
              { value: "", label: "All Types" },
              { value: "staff", label: "Staff Only" },
              { value: "teacher", label: "Teachers Only" },
            ]}
            sortOptions={[
              { value: "name", label: "Name" },
              { value: "type", label: "Type" },
              { value: "date", label: "Date Added" },
            ]}
          />

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <DataTable
              columns={columns}
              data={allData}
              loading={loading}
              actions={actions}
              pageSize={10}
              externalSearch={searchTerm}
            />
          </div>
        </main>
      </div>

      {modalType && selectedMember && (
        <UniversalModal
          title={`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} ${
            selectedMember.type === "staff" ? "Staff" : "Teacher"
          }`}
          mode={modalType}
          data={flattenMemberData(selectedMember)}
          fields={selectedMember.type === "staff" ? staffFields : teacherFields}
          onClose={() => setModalType(null)}
          onSubmit={async (updated: any) => {
            const unflattenedData = unflattenMemberData(updated);

            if (modalType === "edit") {
              if (selectedMember.type === "staff") {
                await editStaff(selectedMember._id, unflattenedData);
              } else {
                await editTeacher(selectedMember._id, unflattenedData);
              }
            }
            if (modalType === "delete") {
              if (selectedMember.type === "staff") {
                await removeStaff(selectedMember._id);
              } else {
                await removeTeacher(selectedMember._id);
              }
            }

            // Reload both data sources after any changes
            loadStaff();
            loadTeacher();
          }}
        />
      )}
    </div>
  );
}
