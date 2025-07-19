import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plane, UserCheck, Flag, X } from "lucide-react";
import Modal from "../Modal";

const LeaveManager = ({ students, onUpdate, onViewDetails }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [leaveStartDate, setLeaveStartDate] = useState("");
  const [leaveEndDate, setLeaveEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openLeaveModal = (student) => {
    setSelectedStudent(student);
    setLeaveStartDate(new Date().toISOString().split("T")[0]);
    setLeaveEndDate(new Date().toISOString().split("T")[0]);
    setModalOpen(true);
    setError("");
  };

  const handleUpdateStatus = async (student, newStatus) => {
    setLoading(true);
    setError("");
    try {
      const { token } = JSON.parse(localStorage.getItem("adminInfo"));
      const config = { headers: { Authorization: `Bearer ${token}` } };

      let payload = { status: newStatus };
      if (newStatus === "OnLeave") {
        if (!leaveStartDate || !leaveEndDate) {
          setError("Both start and end dates are required.");
          setLoading(false);
          return;
        }
        payload = { ...payload, leaveStartDate, leaveEndDate };
      }

      await axios.put(`/api/students/${student._id}/status`, payload, config);
      toast.success(`'${student.name}' marked as ${newStatus}`);
      onUpdate();
      setModalOpen(false);
      setSelectedStudent(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update status.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Leave Management</h2>
      <div className="space-y-2">
        {students.map((student) => (
          <div
            key={student._id}
            className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg
                        ${
                          student.status === "OnLeave"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-50"
                        }`}
          >
            <div className="flex items-center mb-2 sm:mb-0">
              {student.status === "OnLeave" && (
                <Plane size={20} className="mr-3 flex-shrink-0" />
              )}
              <div>
                <p
                  onClick={() => onViewDetails(student._id)}
                  className="cursor-pointer font-semibold text-gray-800"
                >
                  {student.name}
                </p>
                {student.status === "OnLeave" ? (
                  <p className="text-xs font-medium">
                    On Leave until{" "}
                    {new Date(student.leaveEndDate).toLocaleDateString("en-GB")}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">{student.rollNumber}</p>
                )}
              </div>
            </div>

            {student.status === "Active" ? (
              <button
                onClick={() => openLeaveModal(student)}
                className="flex items-center text-sm px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                <Flag size={14} className="mr-1" /> Mark Leave
              </button>
            ) : student.status === "OnLeave" ? (
              <button
                onClick={() => handleUpdateStatus(student, "Active")}
                className="flex items-center text-sm px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              >
                <UserCheck size={14} className="mr-1" /> Mark Active
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-bold mb-4">
              Set Leave for {selectedStudent.name}
            </h3>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  value={leaveStartDate}
                  onChange={(e) => setLeaveStartDate(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">End Date</label>
                <input
                  type="date"
                  value={leaveEndDate}
                  onChange={(e) => setLeaveEndDate(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedStudent, "OnLeave")}
                disabled={loading}
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              >
                {loading ? "Saving..." : "Confirm Leave"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManager;
