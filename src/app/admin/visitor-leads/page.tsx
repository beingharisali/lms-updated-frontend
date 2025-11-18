"use client";
import { useState } from "react";
import { DataTable } from "../../../components/table/DataTable";
import { useRouter } from "next/navigation";
import { Visitor } from "../../../types/visitors";
import { useVisitor } from "@/features/visitors/hooks/useVisitor";
import { UniversalModal } from "@/components/ui/Modal";
import Adminsidebar from "../../../components/Adminsidebar";
import AdminHeader from "../../../components/AdminHeader";
import SearchHeader from "@/components/ui/SearchHeader";

// Extended Visitor type to match your modal data structure
type ExtendedVisitor = Visitor & {
  userName?: string;
  notes?: string;
  formId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function VisitorLeadsPage() {
  const { visitors, loading, loadVisitors, editVisitor, removeVisitor } =
    useVisitor();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVisitor, setSelectedVisitor] =
    useState<ExtendedVisitor | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(
    null
  );

  // Updated columns to match your modal data structure
  const columns = [
    { key: "userName", label: "User Name" },
    { key: "email", label: "Email" },
    {
      key: "formId",
      label: "Form ID",
      accessor: (visitor: Visitor) => {
        const extVisitor = visitor as ExtendedVisitor;
        return (
          extVisitor.formId || `VIS-${visitor._id.slice(-6).toUpperCase()}`
        );
      },
    },
    {
      key: "createdAt",
      label: "Submitted At",
      accessor: (visitor: Visitor) => {
        const extVisitor = visitor as ExtendedVisitor;
        return extVisitor.createdAt
          ? new Date(extVisitor.createdAt).toLocaleDateString()
          : "-";
      },
    },
  ];

  // Field configuration using only supported types
  const visitorFields = [
    {
      name: "userName",
      label: "User Name",
      type: "text" as const,
      placeholder: "Enter user name",
    },
    {
      name: "email",
      label: "Email",
      type: "email" as const,
      placeholder: "Enter email address",
    },
    {
      name: "notes",
      label: "Notes",
      type: "text" as const, // Use "text" instead of "textarea"
      placeholder: "Add any additional notes...",
    },
    {
      name: "formId",
      label: "Form ID",
      type: "text" as const,
      placeholder: "Enter form ID",
    },
  ];

  const actions = [
    {
      label: "View",
      variant: "view",
      onClick: (visitor: Visitor) => {
        setSelectedVisitor(visitor as ExtendedVisitor);
        setModalType("view");
      },
    },
    {
      label: "Edit",
      variant: "edit",
      onClick: (visitor: Visitor) => {
        setSelectedVisitor(visitor as ExtendedVisitor);
        setModalType("edit");
      },
    },
    {
      label: "Delete",
      variant: "delete",
      onClick: (visitor: Visitor) => {
        setSelectedVisitor(visitor as ExtendedVisitor);
        setModalType("delete");
      },
    },
  ];

  const router = useRouter();

  // Helper function to get form ID consistently
  const getFormId = (visitor: ExtendedVisitor) => {
    return visitor.formId || `VIS-${visitor._id.slice(-6).toUpperCase()}`;
  };

  // Flatten data for modal compatibility
  const flattenVisitorData = (visitor: ExtendedVisitor) => {
    return {
      ...visitor,
      formId: getFormId(visitor),
    };
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#eff6f9]">
      <Adminsidebar />
      <div className="w-full px-5">
        <AdminHeader
          breadcrumb="Super Admin / Visitor Leads"
          title="Visitor Leads"
        />
        <main className="p-6">
          <SearchHeader
            placeholder="Search visitors by name, email, or form ID..."
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            addLabel="Add Visitor"
            addRedirect="/admin/admission/visitor-portal"
          />

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <DataTable
              columns={columns}
              data={visitors}
              loading={loading}
              actions={actions}
              pageSize={5}
              externalSearch={searchTerm}
            />
          </div>
        </main>
      </div>

      {modalType && selectedVisitor && (
        <UniversalModal
          title={`${
            modalType.charAt(0).toUpperCase() + modalType.slice(1)
          } Visitor`}
          mode={modalType}
          data={flattenVisitorData(selectedVisitor)}
          fields={visitorFields}
          onClose={() => setModalType(null)}
          onSubmit={async (updated) => {
            if (modalType === "edit") {
              await editVisitor(selectedVisitor._id, updated);
            }
            if (modalType === "delete") {
              await removeVisitor(selectedVisitor._id);
            }
            loadVisitors();
          }}
        />
      )}
    </div>
  );
}
