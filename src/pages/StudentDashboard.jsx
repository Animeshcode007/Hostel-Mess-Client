import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import { Sun, Moon, Utensils, LogOut, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const toYYYYMM = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));

  const [ledger, setLedger] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeMonth, setActiveMonth] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const config = {
          headers: { Authorization: `Bearer ${studentInfo.token}` },
        };
        const ledgerPromise = axios.get("/api/student/my-ledger", config);
        const attendancePromise = axios.get(
          `/api/student/my-attendance?month=${toYYYYMM(activeMonth)}`,
          config
        );

        const [ledgerRes, attendanceRes] = await Promise.all([
          ledgerPromise,
          attendancePromise,
        ]);

        setLedger(ledgerRes.data);

        const attendanceMap = attendanceRes.data.reduce((acc, record) => {
          const dateKey = new Date(record.date).toISOString().split("T")[0];
          acc[dateKey] = { morning: record.morning, evening: record.evening };
          return acc;
        }, {});
        setAttendance(attendanceMap);
      } catch (error) {
        toast.error("Could not fetch dashboard data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentInfo.token, activeMonth]);

  const handleLogout = () => {
    localStorage.removeItem("studentInfo");
    navigate("/login");
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateKey = date.toISOString().split("T")[0];
      const record = attendance[dateKey];
      if (record) {
        return (
          <div className="flex justify-center items-center absolute bottom-1 left-0 right-0 space-x-1">
            {record.morning && <Sun size={12} className="text-yellow-500" />}
            {record.evening && <Moon size={12} className="text-indigo-500" />}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Welcome, {studentInfo?.name}!
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-sm px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:text-red-500"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-bold mb-4 flex items-center">
                  <Utensils className="mr-2" />
                  Meal Ledger
                </h2>
                {ledger ? (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Allotted</p>
                      <p className="text-3xl font-bold">
                        {ledger.totalAllotted}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Consumed</p>
                      <p className="text-3xl font-bold text-red-500">
                        {ledger.totalConsumed}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Remaining</p>
                      <p className="text-3xl font-bold text-green-600">
                        {ledger.remaining}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p>No ledger data.</p>
                )}
              </div>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4">Attendance History</h2>
              <Calendar
                activeStartDate={activeMonth}
                onActiveStartDateChange={({ activeStartDate }) =>
                  setActiveMonth(activeStartDate)
                }
                tileContent={tileContent}
                className="border-none w-full"
              />
              <div className="flex justify-end items-center mt-4 text-xs text-gray-500 space-x-4">
                <span>
                  <Sun size={14} className="inline mr-1 text-yellow-500" />{" "}
                  Morning
                </span>
                <span>
                  <Moon size={14} className="inline mr-1 text-indigo-500" />{" "}
                  Evening
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
