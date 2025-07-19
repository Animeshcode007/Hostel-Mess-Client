import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Utensils,
  Sun,
  Moon,
  Users,
  Loader2,
  BarChart2,
  UserSearch,
} from "lucide-react";
import Select from "react-select";
import DatePicker from "react-datepicker";

const StudentMonthlyReport = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
        const config = {
          headers: { Authorization: `Bearer ${adminInfo.token}` },
        };
        const { data } = await axios.get("/api/students?limit=1000", config);
        const studentOptions = data.students.map((s) => ({
          value: s._id,
          label: `${s.name} (${s.rollNumber})`,
        }));
        setAllStudents(studentOptions);
      } catch (error) {
        console.error("Failed to fetch all students for dropdown", error);
      }
    };
    fetchAllStudents();
  }, []);

  const handleGenerateReport = async () => {
    if (!selectedStudent || !month) {
      toast.error("Please select a student and a month.");
      return;
    }
    setLoading(true);
    setReport(null);
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const config = {
        headers: { Authorization: `Bearer ${adminInfo.token}` },
        params: { studentId: selectedStudent.value, month },
      };
      const { data } = await axios.get(
        "/api/reports/monthly-student-summary",
        config
      );
      setReport(data);
    } catch (error) {
      console.error("Failed to generate student report", error);
      toast.error("Could not generate report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
        <UserSearch className="mr-2" />
        Student Monthly Report
      </h3>
      <div className="p-4 bg-gray-50 rounded-lg border">
        <div className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student
            </label>
            <Select
              options={allStudents}
              onChange={setSelectedStudent}
              value={selectedStudent}
              placeholder="Select a student..."
              isSearchable
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <DatePicker
              selected={month}
              onChange={(date) => setMonth(date)}
              dateFormat="MMMM, yyyy"
              showMonthYearPicker
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex justify-center items-center h-[42px]"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Generate Report"
              )}
            </button>
          </div>
        </div>
      </div>
      {report && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-18 animate-fade-in">
          <StatCard
            icon={<Sun size={24} className="text-yellow-500" />}
            label="Morning Meals"
            value={report.morningMeals}
            color="bg-yellow-100"
          />
          <StatCard
            icon={<Moon size={24} className="text-indigo-500" />}
            label="Evening Meals"
            value={report.eveningMeals}
            color="bg-indigo-100"
          />
          <StatCard
            icon={<Utensils size={24} className="text-green-500" />}
            label="Total Meals Taken"
            value={report.totalMeals}
            color="bg-green-100"
          />
        </div>
      )}
    </div>
  );
};

const Reports = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      if (!date) return;
      setLoading(true);
      setError("");
      try {
        const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
        const config = {
          headers: { Authorization: `Bearer ${adminInfo.token}` },
          params: { date },
        };
        const { data } = await axios.get("/api/reports/daily-summary", config);
        setSummary(data);
      } catch (err) {
        setError("Failed to fetch summary data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [date]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 sm:mb-0">
          Daily Meal Report
        </h2>
        <div>
          <label htmlFor="report-date" className="text-sm font-medium mr-2">
            Select Date:
          </label>
          <input
            type="date"
            id="report-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center p-10">
          <Loader2 className="animate-spin inline-block mr-2" />
          Loading Report...
        </div>
      ) : error ? (
        <div className="text-center p-10 text-red-500">{error}</div>
      ) : summary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Sun size={24} className="text-yellow-500" />}
            label="Morning Meals"
            value={summary.morningMeals}
            color="bg-yellow-100"
          />
          <StatCard
            icon={<Moon size={24} className="text-indigo-500" />}
            label="Evening Meals"
            value={summary.eveningMeals}
            color="bg-indigo-100"
          />
          <StatCard
            icon={<Utensils size={24} className="text-green-500" />}
            label="Total Meals Served"
            value={summary.totalMeals}
            color="bg-green-100"
          />
          <StatCard
            icon={<Users size={24} className="text-blue-500" />}
            label="Total Active Students"
            value={summary.totalActiveStudents}
            color="bg-blue-100"
          />
          <StudentMonthlyReport />
        </div>
      ) : (
        <div className="text-center p-10 text-gray-500">
          No data available for this date.
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className={`p-6 rounded-lg flex items-center space-x-4 ${color}`}>
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <p className="text-gray-600 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default Reports;
