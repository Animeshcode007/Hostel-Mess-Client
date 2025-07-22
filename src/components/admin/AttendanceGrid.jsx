import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import { Check, Loader2 } from "lucide-react";

const AttendanceGrid = ({ students, onViewDetails, onAttendanceChange }) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!date) return;
      setLoading(true);
      try {
        const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
        if (!adminInfo || !adminInfo.token) {
          setLoading(false);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${adminInfo.token}` },
          params: { date },
        };

        const { data } = await axios.get("/api/attendance", config);
        const attendanceMap = data.reduce((acc, record) => {
          acc[record.student] = {
            morning: record.morning,
            evening: record.evening,
          };
          return acc;
        }, {});
        setAttendance(attendanceMap);
      } catch (error) {
        console.error("Failed to fetch attendance", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [date]);

  const handleMarkAttendance = async (studentId, meal) => {
    const updateKey = `${studentId}-${meal}`;

    if (updating[updateKey]) return;

    setUpdating((prev) => ({ ...prev, [updateKey]: true }));

    const currentStatus = attendance[studentId]?.[meal] || false;
    const newStatus = !currentStatus;

    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      if (!adminInfo || !adminInfo.token) return;

      const config = {
        headers: { Authorization: `Bearer ${adminInfo.token}` },
      };

      await axios.post(
        "/api/attendance",
        { studentId, date, meal, status: newStatus },
        config
      );

      setAttendance((prev) => {
        const studentAtt = prev[studentId] || {};
        return {
          ...prev,
          [studentId]: { ...studentAtt, [meal]: newStatus },
        };
      });
      if (onAttendanceChange) {
        onAttendanceChange();
      }
    } catch (error) {
      toast.error(`Failed to mark attendance for ${meal}`, error);
      alert(`Error: Could not save attendance. Please try again.`);
    } finally {
      setUpdating((prev) => ({ ...prev, [updateKey]: false }));
    }
  };

  if (loading) {
    return (
      <div className="text-center p-10">
        <Loader2 className="animate-spin inline-block" /> Loading Attendance...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Mark Attendance</h2>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="p-2 border rounded-md mb-4"
      />
      <div className="overflow-x-auto">
        <div className="grid grid-cols-[minmax(200px,_3fr)_1fr_1fr] gap-2 p-2 bg-gray-100 font-bold rounded-t-lg">
          <div>Name</div>
          <div className="text-center">Morning</div>
          <div className="text-center">Evening</div>
        </div>
        {students
          .filter((s) => s.status === "Active")
          .map((student) => {
            const morningKey = `${student._id}-morning`;
            const eveningKey = `${student._id}-evening`;
            const isMorning = attendance[student._id]?.morning;
            const isEvening = attendance[student._id]?.evening;

            return (
              <div
                key={student._id}
                className="grid grid-cols-[minmax(200px,_3fr)_1fr_1fr] gap-2 p-2 items-center border-b"
              >
                <div
                  className="font-medium text-gray-700 cursor-pointer hover:text-indigo-600"
                  onClick={() => onViewDetails(student._id)}
                  title="View Student Details"
                >
                  {student.name}{" "}
                  <span className="text-gray-400 text-sm">
                    ({student.rollNumber})
                  </span>
                </div>

                <button
                  onClick={() => handleMarkAttendance(student._id, "morning")}
                  disabled={updating[morningKey]}
                  className={`flex justify-center items-center h-10 w-10 mx-auto rounded-lg transition-all ${
                    isMorning
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-400 hover:bg-green-100"
                  } disabled:opacity-50`}
                >
                  {updating[morningKey] ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : isMorning ? (
                    <Check size={20} />
                  ) : (
                    ""
                  )}
                </button>

                <button
                  onClick={() => handleMarkAttendance(student._id, "evening")}
                  disabled={updating[eveningKey]}
                  className={`flex justify-center items-center h-10 w-10 mx-auto rounded-lg transition-all ${
                    isEvening
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-200 text-gray-400 hover:bg-indigo-100"
                  } disabled:opacity-50`}
                >
                  {updating[eveningKey] ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : isEvening ? (
                    <Check size={20} />
                  ) : (
                    ""
                  )}
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AttendanceGrid;
