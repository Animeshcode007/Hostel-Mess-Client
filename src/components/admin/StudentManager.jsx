import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import {
  UserPlus,
  UserX,
  Filter,
  AlertTriangle,
  UserCheck,
  CalendarDays,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const getSubscriptionStatus = (messEndDate) => {
  const today = new Date();
  const endDate = new Date(messEndDate);
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "expired";
  } else if (diffDays <= 7) {
    return "expiring_soon";
  } else {
    return "active";
  }
};

const toYYYYMMDD = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const StudentManager = ({ students, onUpdate, onViewDetails }) => {
  const [filter, setFilter] = useState("Active");

  const [isRegistering, setIsRegistering] = useState(false);

  const [newName, setNewName] = useState("");
  const [newRollNumber, setNewRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [renewingStudent, setRenewingStudent] = useState(null);
  const [newExpiryDate, setNewExpiryDate] = useState(null);
  const [reactivatingStudent, setReactivatingStudent] = useState(null);
  const [newStartDate, setNewStartDate] = useState(new Date());
  const [newEndDate, setNewEndDate] = useState(null);
  const [newMessStartDate, setNewMessStartDate] = useState(new Date());
  const [newMessEndDate, setNewMessEndDate] = useState(null);

  const openRenewModal = (student) => {
    setRenewingStudent(student);
    const currentEndDate =
      new Date(student.messEndDate) > new Date()
        ? new Date(student.messEndDate)
        : new Date();
    currentEndDate.setDate(currentEndDate.getDate() + 30);
    setNewExpiryDate(currentEndDate);
  };

  const handleRenewSubscription = async () => {
    if (!newExpiryDate) {
      toast.error("Please select a new expiry date.");
      return;
    }

    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const config = {
        headers: { Authorization: `Bearer ${adminInfo.token}` },
      };

      await axios.put(
        `/api/students/${renewingStudent._id}/renew`,
        {
          newMessEndDate: toYYYYMMDD(newExpiryDate),
        },
        config
      );

      toast.success(`${renewingStudent.name}'s subscription has been renewed.`);
      setRenewingStudent(null);
      onUpdate();
    } catch (error) {
      toast.error("Failed to renew subscription.");
    }
  };

  const handleRegisterStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token } = JSON.parse(localStorage.getItem("adminInfo"));
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        name: newName,
        rollNumber: newRollNumber,
        messStartDate: toYYYYMMDD(newMessStartDate),
        messEndDate: toYYYYMMDD(newMessEndDate),
      };
      await axios.post("/api/students", payload, config);

      toast.success(`Student '${newName}' registered successfully!`);
      setNewName("");
      setNewRollNumber("");
      setNewMessStartDate(new Date().toISOString().split("T")[0]);
      setNewMessEndDate("");
      setIsRegistering(false);
      onUpdate();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to register student.";
      setError({ api: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateStudentStatus = async (student, newStatus) => {
    try {
      const { token } = JSON.parse(localStorage.getItem("adminInfo"));
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(
        `/api/students/${student._id}/status`,
        { status: newStatus },
        config
      );

      toast.success(`'${student.name}' is now ${newStatus}.`);
      onUpdate();
    } catch (err) {
      toast.error(`Failed to update status for ${student.name}.`);
    }
  };

  const showTerminationConfirm = (student) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-3 p-2">
          <div className="flex items-center">
            <AlertTriangle className="text-yellow-400 mr-3" size={40} />
            <div>
              <p className="font-bold">Terminate {student.name}?</p>
              <p className="text-sm text-gray-300">
                This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="w-full flex justify-center gap-3">
            <button
              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
              onClick={() => {
                updateStudentStatus(student, "Terminated");
                toast.dismiss(t.id);
              }}
            >
              Confirm
            </button>
            <button
              className="flex-1 px-4 py-2 text-sm font-semibold bg-gray-600 rounded-md hover:bg-gray-500"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000,
      }
    );
  };

  const studentsToDisplay = students.filter((student) => {
    if (filter === "Expired") {
      return (
        getSubscriptionStatus(student.messEndDate) === "expired" &&
        student.status !== "Terminated"
      );
    }
    if (filter === "ExpiringSoon") {
      return (
        getSubscriptionStatus(student.messEndDate) === "expiring_soon" &&
        student.status !== "Terminated"
      );
    }
    if (filter === "Active" && student.status === "Active") {
      return getSubscriptionStatus(student.messEndDate) !== "expired";
    }

    return student.status === filter;
  });

  const handleReactivation = async () => {
    if (!newStartDate || !newEndDate) {
      toast.error("Both dates are required.");
      return;
    }

    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const config = {
        headers: { Authorization: `Bearer ${adminInfo.token}` },
      };

      await axios.put(
        `/api/students/${reactivatingStudent._id}/reactivate`,
        {
          messStartDate: toYYYYMMDD(newStartDate),
          messEndDate: toYYYYMMDD(newEndDate),
        },
        config
      );

      toast.success(`${reactivatingStudent.name} has been reactivated.`);
      setReactivatingStudent(null);
      onUpdate();
    } catch (error) {
      toast.error("Failed to reactivate student.");
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
          Manage Students
        </h2>
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="flex items-center text-sm px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
        >
          <UserPlus size={16} className="mr-2" />{" "}
          {isRegistering ? "Cancel" : "Register New Student"}
        </button>
      </div>
      {isRegistering && (
        <form
          onSubmit={handleRegisterStudent}
          className="p-4 mb-4 bg-gray-50 rounded-lg border space-y-3"
        >
          <h3 className="font-semibold">New Student Details</h3>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border rounded-md mt-1"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Enroll Number
            </label>
            <input
              type="text"
              value={newRollNumber}
              onChange={(e) => setNewRollNumber(e.target.value)}
              className="w-full p-2 border rounded-md mt-1"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">
                Mess Start Date
              </label>
              <DatePicker
                selected={newMessStartDate}
                onChange={(date) => setNewMessStartDate(date)}
                selectsStart
                startDate={newMessStartDate}
                endDate={newMessEndDate}
                className="w-full p-2 border rounded-md mt-1"
                dateFormat="dd/MM/yyyy"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">
                Mess End Date
              </label>
              <DatePicker
                selected={newMessEndDate}
                onChange={(date) => setNewMessEndDate(date)}
                selectsEnd
                startDate={newMessStartDate}
                endDate={newMessEndDate}
                minDate={newMessStartDate}
                className={`w-full p-2 border rounded-md mt-1 ${
                  error.endDate ? "border-red-500" : "border-gray-300"
                }`}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select end date"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md disabled:bg-green-300 hover:bg-green-600"
          >
            {loading ? "Saving..." : "Save Student"}
          </button>
        </form>
      )}

      <div className="flex items-center space-x-2 border-b mb-3 pb-2">
        <Filter size={16} className="text-gray-500" />
        <FilterButton
          label="Active"
          isActive={filter === "Active"}
          onClick={() => setFilter("Active")}
        />
        <FilterButton
          label="On Leave"
          isActive={filter === "OnLeave"}
          onClick={() => setFilter("OnLeave")}
        />
        <FilterButton
          label="Expiring Soon"
          icon={<Clock size={14} />}
          isActive={filter === "ExpiringSoon"}
          onClick={() => setFilter("ExpiringSoon")}
          className="bg-yellow-100 text-yellow-800"
        />
        <FilterButton
          label="Expired"
          icon={<AlertCircle size={14} />}
          isActive={filter === "Expired"}
          onClick={() => setFilter("Expired")}
          className="bg-red-100 text-red-800"
        />
        <FilterButton
          label="Terminated"
          isActive={filter === "Terminated"}
          onClick={() => setFilter("Terminated")}
        />
      </div>

      <div className="space-y-2">
        {studentsToDisplay.map((student) => {
          const subStatus = getSubscriptionStatus(student.messEndDate);
          const statusStyles = {
            expired: "border-l-4 border-red-500",
            expiring_soon: "border-l-4 border-yellow-500",
            active: "border-l-4 border-transparent",
          };
          return (
            <div
              key={student._id}
              className={`flex justify-between items-center p-3 bg-gray-50 rounded-lg ${statusStyles[subStatus]}`}
            >
              <div
                onClick={() => onViewDetails(student._id)}
                className="cursor-pointer hover:text-indigo-600"
              >
                <p className="font-semibold text-gray-800">{student.name}</p>
                <p className="text-xs text-gray-500">{student.rollNumber}</p>
                {subStatus !== "active" && student.status === "Active" && (
                  <div className="flex items-center mt-1">
                    <CalendarDays
                      size={14}
                      className={
                        subStatus === "expired"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }
                    />
                    <p
                      className={`ml-1 text-xs font-semibold ${
                        subStatus === "expired"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {subStatus === "expired"
                        ? "Subscription Expired"
                        : "Expires Soon"}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {student.status !== "Terminated" && (
                  <button
                    onClick={() => openRenewModal(student)}
                    title="Renew Subscription"
                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full"
                  >
                    <RefreshCw size={16} />
                  </button>
                )}

                {student.status === "Terminated" ? (
                  <button
                    onClick={() => setReactivatingStudent(student)}
                    title="Reactivate Student"
                    className="p-2 text-green-500 hover:text-green-700 hover:bg-green-100 rounded-full"
                  >
                    <UserCheck size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => showTerminationConfirm(student)}
                    title="Terminate Student"
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <UserX size={18} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {renewingStudent && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setRenewingStudent(null)}
        >
          <div
            className="relative bg-white w-full max-w-md p-6 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">
              Renew Subscription for {renewingStudent.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Current expiry:{" "}
              {new Date(renewingStudent.messEndDate).toLocaleDateString(
                "en-GB"
              )}
            </p>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                New Expiry Date
              </label>
              <DatePicker
                selected={newExpiryDate}
                onChange={(date) => setNewExpiryDate(date)}
                minDate={new Date()}
                className="w-full p-2 border rounded-md"
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setRenewingStudent(null)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRenewSubscription}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Confirm Renewal
              </button>
            </div>
          </div>
        </div>
      )}
      {reactivatingStudent && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setReactivatingStudent(null)}
        >
          <div
            className="relative bg-white w-full max-w-md p-6 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">
              Reactivate {reactivatingStudent.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Set the new subscription period for this student.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  New Start Date
                </label>
                <DatePicker
                  selected={newStartDate}
                  onChange={(date) => setNewStartDate(date)}
                  className="w-full p-2 border rounded-md"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  New End Date
                </label>
                <DatePicker
                  selected={newEndDate}
                  onChange={(date) => setNewEndDate(date)}
                  minDate={newStartDate}
                  placeholderText="Select new end date"
                  className="w-full p-2 border rounded-md"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setReactivatingStudent(null)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleReactivation}
                className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Confirm Reactivation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-sm rounded-full ${
      isActive
        ? "bg-indigo-100 text-indigo-700 font-semibold"
        : "text-gray-600 hover:bg-gray-200"
    }`}
  >
    {label}
  </button>
);

export default StudentManager;
