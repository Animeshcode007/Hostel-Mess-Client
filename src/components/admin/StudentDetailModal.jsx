import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  User,
  Hash,
  Calendar,
  Power,
  PowerOff,
  CheckCircle,
  Clock,
  AlertCircle,
  Sandwich,
  Utensils,
  Soup,
  BarChart3,
  Loader2,
} from "lucide-react";

const getSubscriptionStatus = (messEndDate) => {
  if (!messEndDate) return { status: "active", label: "Active" };
  const today = new Date();
  const endDate = new Date(messEndDate);
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0)
    return {
      status: "expired",
      label: `Expired on ${endDate.toLocaleDateString("en-GB")}`,
    };
  if (diffDays <= 7)
    return { status: "expiring_soon", label: `Expires in ${diffDays} day(s)` };
  return {
    status: "active",
    label: `Expires on ${endDate.toLocaleDateString("en-GB")}`,
  };
};

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-start py-3 border-b border-gray-200">
    <div className="flex-shrink-0 w-8 text-gray-500 pt-1">{icon}</div>
    <div>
      <p className="text-sm sm:text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800 text-base">{value}</p>
    </div>
  </div>
);

const StudentDetailModal = ({ student, isOpen, onClose }) => {
  const [ledger, setLedger] = useState(null);
  const [loadingLedger, setLoadingLedger] = useState(true);

  useEffect(() => {
    if (isOpen && student) {
      const fetchLedger = async () => {
        setLoadingLedger(true);
        try {
          const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
          const config = {
            headers: { Authorization: `Bearer ${adminInfo.token}` },
          };
          const { data } = await axios.get(
            `/api/reports/student-meal-ledger/${student._id}`,
            config
          );
          setLedger(data.ledger);
        } catch (error) {
          console.error("Failed to fetch meal ledger", error);
          setLedger(null);
        } finally {
          setLoadingLedger(false);
        }
      };
      fetchLedger();
    }
  }, [isOpen, student]);

  if (!isOpen || !student) return null;

  const subInfo = getSubscriptionStatus(student.messEndDate);
  const statusColors = {
    expired: "bg-red-100 text-red-800",
    expiring_soon: "bg-yellow-100 text-yellow-800",
    active: "bg-green-100 text-green-800",
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-lg p-6 rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold">
            {student.name.charAt(0)}
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
            <p className="text-gray-500">Student Details</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <BarChart3 size={20} className="mr-2 text-indigo-500" />
            Meal Count
          </h3>
          {loadingLedger ? (
            <div className="text-center p-4">
              <Loader2 className="animate-spin" />
            </div>
          ) : ledger ? (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500">Allotted</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {ledger.totalAllotted}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Consumed</p>
                  <p className="text-2xl font-bold text-red-500">
                    {ledger.totalConsumed}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Remaining</p>
                  <p className="text-2xl font-bold text-green-600">
                    {ledger.remaining}
                  </p>
                </div>
              </div>
              <div className="mt-4 border-t pt-2 text-xs text-gray-600 space-y-1">
                <p className="flex justify-between">
                  <span>
                    <Sandwich size={14} className="inline mr-1" />
                    Morning Meals Consumed:
                  </span>{" "}
                  <strong>{ledger.consumedMorning}</strong>
                </p>
                <p className="flex justify-between">
                  <span>
                    <Soup size={14} className="inline mr-1" />
                    Evening Meals Consumed:
                  </span>{" "}
                  <strong>{ledger.consumedEvening}</strong>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-center text-gray-500">
              Could not load meal data.
            </p>
          )}
        </div>
        <div className="space-y-1">
          <DetailRow
            icon={<Hash size={20} />}
            label="Enroll Number"
            value={student.rollNumber}
          />
          <DetailRow
            icon={<Calendar size={20} />}
            label="Mess Subscription Start"
            value={new Date(student.messStartDate).toLocaleDateString("en-GB")}
          />
          <DetailRow
            icon={<Calendar size={20} />}
            label="Mess Subscription End"
            value={new Date(student.messEndDate).toLocaleDateString("en-GB")}
          />
          <DetailRow
            icon={
              subInfo.status === "expired" ? (
                <AlertCircle size={20} />
              ) : (
                <Clock size={20} />
              )
            }
            label="Subscription Status"
            value={
              <span
                className={`px-2 py-1 text-xs font-bold rounded-full ${
                  statusColors[subInfo.status]
                }`}
              >
                {subInfo.label}
              </span>
            }
          />
          <DetailRow
            icon={
              student.status === "Terminated" ? (
                <PowerOff size={20} />
              ) : (
                <Power size={20} />
              )
            }
            label="Account Status"
            value={student.status}
          />
          {student.status === "OnLeave" && (
            <DetailRow
              icon={<Plane size={20} />}
              label="Leave Period"
              value={`${new Date(student.leaveStartDate).toLocaleDateString(
                "en-GB"
              )} to ${new Date(student.leaveEndDate).toLocaleDateString(
                "en-GB"
              )}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
