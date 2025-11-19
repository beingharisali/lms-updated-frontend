"use client";
import { useState, useEffect } from "react";
import {
  Bell,
  X,
  Star,
  FileText,
  Download,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Check,
  AlertTriangle,
} from "lucide-react";
import { FaSearch, FaSyncAlt } from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth";
import UserProfile from "@/components/UserProfile";
import Adminsidebar from "../../../components/Adminsidebar";
import ProtectedRoute from "../../../components/ProtectedRoute";

const generateMockLeads = () => [
  {
    id: "A101",
    date: "2025-06-30",
    time: "09:14 AM",
    action: "Lead Submitted",
    status: "new",
    priority: false,
    notes: "Interested in Computer Science program",
  },
  {
    id: "B204",
    date: "2025-06-29",
    time: "12:30 PM",
    action: "Follow-up Added",
    status: "followup",
    priority: true,
    notes: "Needs scholarship information",
  },
  {
    id: "X331",
    date: "2024-12-15",
    time: "04:52 PM",
    action: "Student Converted",
    status: "converted",
    priority: false,
    notes: "Enrolled in Fall 2025 batch",
  },
  {
    id: "M111",
    date: "2025-06-28",
    time: "10:10 AM",
    action: "Inquiry Received",
    status: "new",
    priority: false,
    notes: "Asked about accommodation options",
  },
  {
    id: "Z220",
    date: "2024-11-22",
    time: "03:21 PM",
    action: "Call Scheduled",
    status: "scheduled",
    priority: true,
    notes: "Call scheduled for Monday 10 AM",
  },
  {
    id: "L010",
    date: "2025-06-30",
    time: "06:05 PM",
    action: "Walk-in Recorded",
    status: "new",
    priority: false,
    notes: "Visited campus with parents",
  },
];

function useCounter(target) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 20);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [target]);
  return count;
}

export default function SuperAdminDashboard() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [mockLeads, setMockLeads] = useState(generateMockLeads());
  const [filteredActivity, setFilteredActivity] = useState(mockLeads);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showChart, setShowChart] = useState(false);

  const handleReset = () => {
    setSearch("");
    setYear("");
    setMonth("");
    setDay("");
    setSelectedLeads([]);
  };

  const handleRefresh = () => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const more = {
      id: "N" + Math.floor(Math.random() * 999),
      date,
      time,
      action: "Lead Submitted",
      status: "new",
      priority: Math.random() > 0.7,
      notes: "",
    };
    const updated = [...mockLeads, more];
    setMockLeads(updated);
    setFilteredActivity(updated);
  };

  useEffect(() => {
    const filtered = mockLeads.filter((lead) => {
      const dateObj = new Date(lead.date);
      const matchesSearch =
        !search || lead.id.toLowerCase().includes(search.toLowerCase());
      const matchesYear = !year || dateObj.getFullYear().toString() === year;
      const matchesMonth =
        !month ||
        dateObj.toLocaleString("default", { month: "long" }).toLowerCase() ===
          month.toLowerCase();
      const matchesDay = !day || dateObj.getDate().toString() === day;
      return matchesSearch && matchesYear && matchesMonth && matchesDay;
    });
    setFilteredActivity(filtered);
  }, [search, year, month, day, mockLeads]);

  const totalLeads = useCounter(filteredActivity.length);
  const convertedStudents = useCounter(84 + Math.floor(mockLeads.length / 4));
  const pendingFollowups = useCounter(30 + (mockLeads.length % 5));
  const todaysSubmissions = useCounter(
    mockLeads.filter((lead) => lead.date === "2025-06-30").length
  );

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedLead) return;

    const updatedLeads = mockLeads.map((lead) => {
      if (lead.id === selectedLead.id) {
        return {
          ...lead,
          notes: lead.notes ? `${lead.notes}\n${newNote}` : newNote,
        };
      }
      return lead;
    });

    setMockLeads(updatedLeads);
    setSelectedLead({
      ...selectedLead,
      notes: selectedLead.notes ? `${selectedLead.notes}\n${newNote}` : newNote,
    });
    setNewNote("");
  };

  const togglePriority = (leadId) => {
    const updatedLeads = mockLeads.map((lead) => {
      if (lead.id === leadId) {
        return { ...lead, priority: !lead.priority };
      }
      return lead;
    });
    setMockLeads(updatedLeads);

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, priority: !selectedLead.priority });
    }
  };

  const toggleLeadSelection = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  const bulkUpdateStatus = (status) => {
    const updatedLeads = mockLeads.map((lead) => {
      if (selectedLeads.includes(lead.id)) {
        return { ...lead, status };
      }
      return lead;
    });
    setMockLeads(updatedLeads);
    setSelectedLeads([]);
  };

  const exportData = () => {
    const dataToExport = filteredActivity.map((lead) => ({
      ID: lead.id,
      Date: lead.date,
      Time: lead.time,
      Action: lead.action,
      Status: lead.status,
      Priority: lead.priority ? "High" : "Normal",
      Notes: lead.notes || "",
    }));

    const csvContent = [
      Object.keys(dataToExport[0]).join(","),
      ...dataToExport.map((item) => Object.values(item).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `leads_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "followup":
        return "bg-yellow-100 text-yellow-800";
      case "converted":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusCount = (status) => {
    return mockLeads.filter((lead) => lead.status === status).length;
  };

  const statusData = [
    { name: "New", value: getStatusCount("new"), color: "bg-blue-500" },
    {
      name: "Follow-up",
      value: getStatusCount("followup"),
      color: "bg-yellow-500",
    },
    {
      name: "Converted",
      value: getStatusCount("converted"),
      color: "bg-green-500",
    },
    {
      name: "Scheduled",
      value: getStatusCount("scheduled"),
      color: "bg-purple-500",
    },
  ];
  const auth = useAuth();
  async function logout() {
    await auth.logoutUser();
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <>
        <div className="flex-1 flex flex-col overflow-x-auto">
          {/* <Fee/> */}
          <main className="p-4 sm:p-6 md:ml-4 space-y-4 md:mt-3 mt-18 min-w-[300px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Total Leads", value: totalLeads },
                { title: "Pending Follow-ups", value: pendingFollowups },
                { title: "Converted Students", value: convertedStudents },
                { title: "Today's Submissions", value: todaysSubmissions },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl shadow text-center"
                >
                  <h4 className="text-xs text-gray-500 font-medium mb-1">
                    {item.title}
                  </h4>
                  <p className="text-2xl font-semibold text-gray-800">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white shadow rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Lead Status Overview</h3>
                <button
                  onClick={() => setShowChart(!showChart)}
                  className="text-sm text-blue-600 cursor-pointer hover:text-blue-800"
                >
                  {showChart ? "Hide Chart" : "Show Chart"}
                </button>
              </div>

              {showChart && (
                <div className="flex items-end h-32 mb-4 gap-1">
                  {statusData.map((item, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className={`w-full ${item.color} rounded-t-sm`}
                        style={{
                          height: `${
                            (item.value /
                              Math.max(...statusData.map((s) => s.value))) *
                            80
                          }px`,
                        }}
                      ></div>
                      <span className="text-xs mt-1">{item.name}</span>
                      <span className="text-xs font-semibold">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {statusData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${item.color} mr-2`}
                    ></div>
                    <span className="text-sm">{item.name}: </span>
                    <span className="text-sm font-semibold ml-1">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 items-stretch w-full">
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  placeholder="Search Form Id..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 rounded-lg shadow bg-white focus:outline-none"
                />
                <button className="absolute right-10 top-1/2 transform  cursor-pointer -translate-y-1/2 text-blue-600">
                  <FaSearch />
                </button>
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer  text-gray-500"
                  onClick={handleReset}
                >
                  <FaSyncAlt />
                </button>
              </div>

              <div className="grid grid-cols-3 md:flex gap-2">
                {[year, month, day].map((_, idx) => {
                  const labels = ["Year", "Month", "Day"];
                  const values = [
                    ["2025", "2024"],
                    [
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ],
                    [...Array(31)].map((_, i) => (i + 1).toString()),
                  ];
                  const setFns = [setYear, setMonth, setDay];
                  const currVals = [year, month, day];
                  return (
                    <select
                      key={labels[idx]}
                      value={currVals[idx]}
                      onChange={(e) => setFns[idx](e.target.value)}
                      className="p-2 rounded shadow text-sm bg-white cursor-pointer w-full"
                    >
                      <option value="">{labels[idx]}</option>
                      {values[idx].map((val) => (
                        <option key={val}>{val}</option>
                      ))}
                    </select>
                  );
                })}
              </div>

              <button
                onClick={handleRefresh}
                className="bg-blue-600 text-white px-3 py-2 text-sm cursor-pointer rounded shadow hover:bg-blue-700 transition w-full md:w-auto"
              >
                <FaSyncAlt className="inline mr-1" /> Refresh Data
              </button>
            </div>

            {selectedLeads.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-medium">
                  {selectedLeads.length} lead(s) selected
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => bulkUpdateStatus("followup")}
                    className="flex items-center gap-1 bg-white text-yellow-700 px-3 py-1 rounded text-xs border border-yellow-200 hover:bg-yellow-100"
                  >
                    <MessageSquare size={14} /> Mark Follow-up
                  </button>
                  <button
                    onClick={() => bulkUpdateStatus("converted")}
                    className="flex items-center gap-1 bg-white text-green-700 px-3 py-1 rounded text-xs border border-green-200 hover:bg-green-100"
                  >
                    <Check size={14} /> Mark Converted
                  </button>
                  <button
                    onClick={() => {
                      const updatedLeads = mockLeads.map((lead) => {
                        if (selectedLeads.includes(lead.id)) {
                          return { ...lead, priority: true };
                        }
                        return lead;
                      });
                      setMockLeads(updatedLeads);
                      setSelectedLeads([]);
                    }}
                    className="flex items-center gap-1 bg-white text-red-700 px-3 py-1 rounded text-xs border border-red-200 hover:bg-red-100"
                  >
                    <AlertTriangle size={14} /> Mark Priority
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <button
                  onClick={exportData}
                  className="flex items-center gap-1 text-sm cursp text-blue-600 hover:text-blue-800"
                >
                  <Download size={16} /> Export
                </button>
              </div>
              <div className="min-w-[600px]">
                <ul className="text-sm text-gray-700 space-y-1 max-h-[300px] overflow-y-auto pr-2">
                  {filteredActivity.length === 0 ? (
                    <li className="p-2">No matching activity found.</li>
                  ) : (
                    filteredActivity.map((act, i) => (
                      <li
                        key={i}
                        onClick={() => setSelectedLead(act)}
                        className={`p-2 rounded cursor-pointer hover:bg-blue-50 ${
                          selectedLead?.id === act.id ? "bg-blue-100" : ""
                        } flex items-start gap-2`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(act.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleLeadSelection(act.id);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{act.id}</span>
                            {act.priority && (
                              <Star className="text-yellow-500 w-4 h-4 fill-current" />
                            )}
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                act.status
                              )}`}
                            >
                              {act.status}
                            </span>
                          </div>
                          <div>
                            {act.action} on {act.date} at {act.time}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePriority(act.id);
                          }}
                          className="text-gray-400 hover:text-yellow-500"
                        >
                          <Star
                            className="w-4 h-4"
                            fill={act.priority ? "currentColor" : "none"}
                          />
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </main>
        </div>

        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedLead(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              >
                <X />
              </button>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Lead Details</h2>
                <button
                  onClick={() => togglePriority(selectedLead.id)}
                  className="text-gray-400 hover:text-yellow-500"
                >
                  <Star
                    className="w-5 h-5"
                    fill={selectedLead.priority ? "currentColor" : "none"}
                  />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <p>
                  <strong>ID:</strong> {selectedLead.id}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(
                      selectedLead.status
                    )}`}
                  >
                    {selectedLead.status}
                  </span>
                </p>
                <p>
                  <strong>Action:</strong> {selectedLead.action}
                </p>
                <p>
                  <strong>Date:</strong> {selectedLead.date}
                </p>
                <p>
                  <strong>Time:</strong> {selectedLead.time}
                </p>
              </div>

              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <FileText className="mr-2 w-4 h-4" /> Notes
                </h3>
                {selectedLead.notes ? (
                  <div className="bg-gray-50 p-3 rounded whitespace-pre-wrap text-sm">
                    {selectedLead.notes}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No notes available</p>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Add Note</h3>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full border rounded p-2 text-sm mb-2"
                  rows="3"
                  placeholder="Add a note about this lead..."
                ></textarea>
                <button
                  onClick={handleAddNote}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Save Note
                </button>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-2">Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm">
                    <Mail size={16} /> Email
                  </button>
                  <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm">
                    <Phone size={16} /> Call
                  </button>
                  <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm">
                    <Calendar size={16} /> Schedule
                  </button>
                  <button
                    onClick={() => {
                      const updatedLeads = mockLeads.map((lead) => {
                        if (lead.id === selectedLead.id) {
                          return { ...lead, status: "converted" };
                        }
                        return lead;
                      });
                      setMockLeads(updatedLeads);
                      setSelectedLead({ ...selectedLead, status: "converted" });
                    }}
                    className="flex items-center gap-1 bg-green-100 hover:bg-green-200 px-3 py-1 rounded text-sm"
                  >
                    <Check size={16} /> Mark Converted
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </ProtectedRoute>
  );
}
