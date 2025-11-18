"use client";
import React, { useState, useRef } from "react";

export type FieldConfig = {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "number"
    | "password"
    | "date"
    | "select"
    | "textarea"
    | "toggle"
    | "file";
  placeholder?: string;
  options?: string[]; // for select fields
  section?: string; // to group fields into sections
  accept?: string; // for file inputs (e.g., "image/*", ".pdf,.doc")
  readOnlyInEdit?: boolean; // NEW: Make field read-only in edit mode
};

interface UniversalModalProps<T extends Record<string, any>> {
  title: string;
  mode: "view" | "edit" | "delete";
  data: T | null;
  fields: FieldConfig[];
  onClose: () => void;
  onSubmit: (updatedData: Partial<T>) => Promise<void> | void;
}

export function UniversalModal<T extends Record<string, any>>({
  title,
  mode,
  data,
  fields,
  onClose,
  onSubmit,
}: UniversalModalProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>(data || {});
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>(
    {}
  );
  const [showPassword, setShowPassword] = useState(false); // NEW: For password visibility
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...(prev as any), [name]: checked }));
  };

  const handleFileChange = (name: string, file: File | null) => {
    if (file) {
      setUploadedFiles((prev) => ({ ...prev, [name]: file }));
      setFormData((prev) => ({ ...prev, [name]: file.name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== "view" && data) {
      // Include uploaded files in the submission
      const submitData: Record<string, any> = { ...formData };
      Object.keys(uploadedFiles).forEach((key) => {
        submitData[key] = uploadedFiles[key];
      });
      await onSubmit(submitData as Partial<T>);
    }
    onClose();
  };

  // Group fields by sections
  const groupFieldsBySection = () => {
    const sections: { [key: string]: FieldConfig[] } = {};

    fields.forEach((field) => {
      const sectionName = field.section || "General Information";
      if (!sections[sectionName]) {
        sections[sectionName] = [];
      }
      sections[sectionName].push(field);
    });

    return sections;
  };

  const sections = groupFieldsBySection();

  // Format date value properly
  const formatDateValue = (value: any) => {
    if (!value) return "";

    // If it's already in YYYY-MM-DD format, return as is
    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return value;
    }

    // Try to parse and format the date
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    } catch {
      // If parsing fails, return empty string
    }

    return "";
  };

  // Get profile picture URL
  const getProfilePictureUrl = () => {
    const photo = data?.["photo"];
    if (typeof photo === "string") return photo;
    if (photo && typeof photo === "object" && photo.url) return photo.url;
    return null;
  };

  // NEW: Check if field should be read-only
  const isFieldReadOnly = (field: FieldConfig) => {
    if (mode === "view") return true;
    if (field.readOnlyInEdit) return true;
    return false;
  };

  const renderField = (field: FieldConfig) => {
    let value = formData[field.name] as string | number | boolean | undefined;
    const isReadOnly = isFieldReadOnly(field);

    // Handle date fields specially
    if (field.type === "date") {
      value = formatDateValue(value);
    } else if (field.type === "toggle") {
      // Handle boolean values for toggles
      if (typeof value === "string") {
        value = value === "true";
      }
      value = Boolean(value);
    } else {
      value = value || "";
    }

    return (
      <div key={field.name} className="space-y-1">
        <label className="text-xs font-medium text-gray-600">
          {field.label}
        </label>

        {field.type === "textarea" ? (
          <textarea
            name={field.name}
            value={String(value)}
            placeholder={field.placeholder}
            readOnly={isReadOnly}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded text-sm min-h-[80px] resize-vertical ${
              isReadOnly
                ? "bg-gray-100 cursor-not-allowed text-gray-600"
                : "border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            }`}
          />
        ) : field.type === "select" ? (
          <select
            name={field.name}
            value={String(value)}
            disabled={isReadOnly}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded text-sm ${
              isReadOnly
                ? "bg-gray-100 cursor-not-allowed text-gray-600"
                : "border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            }`}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : field.type === "toggle" ? (
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) =>
                  handleToggleChange(field.name, e.target.checked)
                }
                disabled={isReadOnly}
                className="sr-only peer"
              />
              <div
                className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  Boolean(value) ? "peer-checked:bg-blue-600" : ""
                } ${isReadOnly ? "opacity-50 cursor-not-allowed" : ""}`}
              ></div>
            </label>
            <span
              className={`text-sm ${
                Boolean(value) ? "text-green-600 font-medium" : "text-gray-500"
              }`}
            >
              {Boolean(value) ? "Enabled" : "Disabled"}
            </span>
          </div>
        ) : field.type === "file" ? (
          <div className="space-y-2">
            {/* Show current file if exists */}
            {value && (
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                Current: {String(value)}
              </div>
            )}

            {mode !== "view" && !isReadOnly && (
              <div className="flex items-center space-x-2">
                <input
                  ref={(el) => {
                    if (el) fileInputRefs.current[field.name] = el;
                  }}
                  type="file"
                  accept={field.accept || "*/*"}
                  onChange={(e) =>
                    handleFileChange(field.name, e.target.files?.[0] || null)
                  }
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[field.name]?.click()}
                  className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Choose File
                </button>
                {uploadedFiles[field.name] && (
                  <span className="text-sm text-green-600">
                    Selected: {uploadedFiles[field.name].name}
                  </span>
                )}
              </div>
            )}
          </div>
        ) : field.type === "password" ? (
          // SPECIAL HANDLING FOR PASSWORD FIELD
          <div className="relative">
            <input
              name={field.name}
              type={mode === "view" && !showPassword ? "password" : "text"}
              value={String(value)}
              placeholder={field.placeholder}
              readOnly={isReadOnly}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded text-sm pr-10 ${
                isReadOnly
                  ? "bg-gray-100 cursor-not-allowed text-gray-600"
                  : "border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              }`}
            />
            {/* Show/Hide Password Button */}
            {mode === "view" && value && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            )}
            {mode === "view" && value && (
              <div className="text-xs text-gray-500 mt-1">
                Click the eye icon to {showPassword ? "hide" : "reveal"}{" "}
                password
              </div>
            )}
          </div>
        ) : (
          <input
            name={field.name}
            type={field.type}
            value={String(value)}
            placeholder={field.placeholder}
            readOnly={isReadOnly}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded text-sm ${
              isReadOnly
                ? "bg-gray-100 cursor-not-allowed text-gray-600"
                : "border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            }`}
          />
        )}
      </div>
    );
  };

  const renderFieldSection = (
    sectionTitle: string,
    sectionFields: FieldConfig[]
  ) => {
    if (sectionFields.length === 0) return null;

    return (
      <div key={sectionTitle} className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 border-b pb-2 bg-gray-50 px-3 py-2 rounded">
          {sectionTitle}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-3">
          {sectionFields.map(renderField)}
        </div>
      </div>
    );
  };

  if (mode === "delete") {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-bold text-red-600 mb-4">
            Confirm Delete
          </h2>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {data?.["firstName"]} {data?.["lastName"]}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  const profilePictureUrl = getProfilePictureUrl();

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center p-6 border-b bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Profile Picture Section - Show for teachers, staff, and students */}
        {(title.toLowerCase().includes("teacher") ||
          title.toLowerCase().includes("staff") ||
          title.toLowerCase().includes("student")) && (
          <div className="text-center py-6 bg-gray-50">
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center shadow-md overflow-hidden">
              {profilePictureUrl ? (
                <img
                  src={profilePictureUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-2xl">
                  {data?.["firstName"]?.charAt(0) || "?"}
                </span>
              )}
            </div>
            <h3 className="mt-3 text-lg font-semibold text-gray-800">
              {data?.["firstName"]} {data?.["lastName"]}
            </h3>
            <p className="text-sm text-gray-600">{data?.["email"]}</p>

            {/* Photo upload for edit mode */}
            {mode === "edit" && (
              <div className="mt-3">
                <input
                  ref={(el) => {
                    if (el) fileInputRefs.current["photo"] = el;
                  }}
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange("photo", e.target.files?.[0] || null)
                  }
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.current["photo"]?.click()}
                  className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Update Photo
                </button>
                {uploadedFiles["photo"] && (
                  <p className="text-sm text-green-600 mt-1">
                    New photo selected: {uploadedFiles["photo"].name}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Render all sections */}
            {Object.entries(sections).map(([sectionTitle, sectionFields]) =>
              renderFieldSection(sectionTitle, sectionFields)
            )}

            <div className="flex justify-end space-x-2 pt-4 border-t bg-white sticky bottom-0">
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                onClick={onClose}
              >
                Cancel
              </button>
              {mode === "edit" && (
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Save Changes
                </button>
              )}
              {mode === "view" && (
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
