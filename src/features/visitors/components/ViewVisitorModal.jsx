"use client";
import {
  FaUser,
  FaTimes,
  FaEnvelope,
  FaCalendar,
  FaIdCard,
} from "react-icons/fa";

export function ViewVisitorModal({ visitor, onClose }) {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  const getFormId = () => {
    return visitor.formId || `VIS-${visitor._id.slice(-6).toUpperCase()}`;
  };

  const InfoField = ({ label, value, icon }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="text-blue-500 text-lg mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-gray-600 font-medium text-sm">{label}:</p>
        <p className="text-gray-800 break-words text-base">{value || "-"}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Visitor Details
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
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4">
              <FaUser className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              {visitor.userName}
            </h3>
            <p className="text-gray-600 text-sm">Form ID: {getFormId()}</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <InfoField
              label="Form ID"
              value={getFormId()}
              icon={<FaIdCard />}
            />
            <InfoField
              label="User Name"
              value={visitor.userName}
              icon={<FaUser />}
            />
            <InfoField
              label="Email"
              value={visitor.email}
              icon={<FaEnvelope />}
            />
            <InfoField
              label="Submitted At"
              value={formatDate(visitor.createdAt)}
              icon={<FaCalendar />}
            />
            {visitor.updatedAt && visitor.updatedAt !== visitor.createdAt && (
              <InfoField
                label="Last Updated"
                value={formatDate(visitor.updatedAt)}
                icon={<FaCalendar />}
              />
            )}
          </div>

          {visitor.notes && (
            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Notes
              </h4>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{visitor.notes}</p>
              </div>
            </div>
          )}
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
